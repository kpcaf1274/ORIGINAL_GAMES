const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../blokus.html'), 'utf8');
const engineSource = html.match(/<script id="rules-engine">([\s\S]*?)<\/script>/)[1];
const context = {};
vm.runInNewContext(engineSource + '\nthis.engine = BlockEngine;', context);
const E = context.engine;

// An independent enumeration of every connected free polyomino up to size 5.
// This checks the catalog itself, including reflected duplicates and omissions.
function canonical(cells) {
  const variants = [];
  for (const swap of [false, true]) for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const transformed = cells.map(([x,y]) => swap ? [sx*y,sy*x] : [sx*x,sy*y]);
    const minX = Math.min(...transformed.map(c => c[0]));
    const minY = Math.min(...transformed.map(c => c[1]));
    variants.push(transformed.map(([x,y]) => [x-minX,y-minY]).sort((a,b) => a[0]-b[0] || a[1]-b[1]).map(c => c.join(',')).join(';'));
  }
  return variants.sort()[0];
}
function allFreePolyominoes() {
  let shapes = new Map([['0,0', [[0,0]]]]);
  const all = new Map([[1, shapes]]);
  for (let size=2; size<=5; size++) {
    const next = new Map();
    for (const shape of shapes.values()) for (const [x,y] of shape) for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const candidate = [x+dx,y+dy];
      if (shape.some(c => c[0]===candidate[0] && c[1]===candidate[1])) continue;
      const expanded = [...shape, candidate];
      next.set(canonical(expanded), expanded);
    }
    shapes = next;
    all.set(size, shapes);
  }
  return all;
}
function rng(seed=123456) {
  return () => { seed = (seed*1664525+1013904223) >>> 0; return seed/4294967296; };
}
function referenceLegal(state, player, cells, x, y) {
  const points = cells.map(([cx,cy]) => [x+cx,y+cy]);
  if (points.some(([cx,cy]) => cx<0 || cx>=20 || cy<0 || cy>=20 || state.board[cy*20+cx])) return false;
  const friendly=[];
  state.board.forEach((value,index) => { if(value===player+1) friendly.push([index%20,Math.floor(index/20)]); });
  if(points.some(([x,y]) => friendly.some(([fx,fy]) => Math.abs(x-fx)+Math.abs(y-fy)===1))) return false;
  if(!friendly.length) {
    const corners=[[0,0],[19,0],[19,19],[0,19]];
    return points.some(([x,y]) => x===corners[player][0] && y===corners[player][1]);
  }
  return points.some(([x,y]) => friendly.some(([fx,fy]) => Math.abs(x-fx)===1 && Math.abs(y-fy)===1));
}

test('catalog has exactly every free polyomino of sizes 1–5, totaling 21 pieces and 89 cells', () => {
  const generated=allFreePolyominoes();
  assert.equal(E.PIECES.length,21);
  assert.equal(E.PIECES.reduce((sum,piece)=>sum+piece.size,0),89);
  assert.deepEqual([...generated.values()].map(shapes=>shapes.size),[1,1,2,5,12]);
  for(const [size,shapes] of generated) {
    const catalog = E.PIECES.filter(piece=>piece.size===size).map(piece=>canonical(piece.cells)).sort();
    assert.deepEqual(Array.from(catalog),[...shapes.keys()].sort());
  }
  assert.deepEqual(Array.from(E.ORIENTATIONS, orientations=>orientations.length),[1,2,2,4,2,1,4,8,4,8,2,8,8,8,4,4,4,4,1,8,4]);
});

test('first piece covers the assigned corner; future pieces touch corners but never same-color edges', () => {
  const state=E.create(4);
  assert.equal(E.legal(state,0,[[0,0]],0,0),'');
  assert.notEqual(E.legal(state,0,[[0,0]],5,5),'');
  assert.notEqual(E.legal(state,0,[[0,0]],-1,0),'');
  assert.equal(E.apply(state,{piece:0,orientation:0,x:0,y:0}),'');
  assert.equal(E.legal(state,0,[[0,0]],1,1),'');
  assert.notEqual(E.legal(state,0,[[0,0]],1,0),'');
  assert.notEqual(E.legal(state,0,[[0,0]],0,0),'');
  assert.notEqual(E.legal(state,0,[[0,0]],3,3),'');
  state.board[1*20+2]=2;
  state.players[1].placed=1;
  assert.equal(E.legal(state,1,[[0,0]],1,0),'','different-color edges are allowed');
});

test('frontier-based legal moves match an independent full-board scan', () => {
  const state=E.create(4),random=rng(77);
  for(let step=0;step<20;step++) {
    const move=E.chooseAI(state,state.turn,'normal',random);
    assert(move);
    assert.equal(E.apply(state,move),'');
    E.advance(state);
  }
  for(const player of [0,2]) {
    const optimized = new Set();
    E.eachMove(state,player,move=>optimized.add(`${move.piece}/${move.orientation}/${move.x}/${move.y}`));
    const bruteForce = new Set();
    for(const piece of E.PIECES) if(state.players[player].remaining[piece.id]) {
      E.ORIENTATIONS[piece.id].forEach((cells,orientation)=>{
        for(let y=0;y<20;y++) for(let x=0;x<20;x++) if(referenceLegal(state,player,cells,x,y)) bruteForce.add(`${piece.id}/${orientation}/${x}/${y}`);
      });
    }
    assert.deepEqual([...optimized].sort(),[...bruteForce].sort());
  }
});

for(const difficulty of ['easy','normal','hard']) test(`${difficulty} CPU completes an entire game using only legal moves`, () => {
  const state=E.create(1,difficulty),random=rng(91);
  let turns=0;
  while(!state.ended) {
    E.advance(state);
    if(state.ended)break;
    const player=state.turn,move=E.chooseAI(state,player,difficulty,random);
    assert(move,'a legal move must be returned if one exists');
    const cells=E.ORIENTATIONS[move.piece][move.orientation];
    assert(referenceLegal(state,player,cells,move.x,move.y));
    assert.equal(E.apply(state,move),'');
    assert(E.validState(state));
    assert(++turns<=84,'game must terminate within the finite piece inventory');
  }
  for(let player=0;player<4;player++) assert.equal(E.findMove(state,player),null);
  assert(turns>20);
});

test('scoring, used-piece rejection, and resume-data validation', () => {
  const state=E.create(2);
  assert.equal(state.players.filter(player=>player.kind==='human').length,2);
  assert.equal(state.players[0].kind,'human');
  assert.equal(state.players[2].kind,'human');
  assert.equal(E.score(state.players[0]),-89);
  const player={remaining:Array(21).fill(false),lastPiece:0};
  assert.equal(E.score(player),20);
  player.lastPiece=1;
  assert.equal(E.score(player),15);
  player.remaining[10]=true;
  assert.equal(E.score(player),-5);
  const first={piece:0,orientation:0,x:0,y:0};
  assert.equal(E.apply(state,first),'');
  state.turn=0;
  assert.notEqual(E.apply(state,{...first,x:1,y:1}),'');
  assert(E.validState(JSON.parse(JSON.stringify(state))));
  const broken=E.clone(state);broken.board[0]=4;
  assert.equal(E.validState(broken),false);
  assert.equal(E.validState({version:1}),false);
});

test('the game is self-contained: no network resource dependencies', () => {
  assert(!/<script[^>]+src=/i.test(html));
  assert(!/<link[^>]+href=["']https?:/i.test(html));
  assert(!/\b(?:fetch|importScripts)\s*\(/.test(html));
  for(const code of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(code[1]);
});
