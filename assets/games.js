/* Launcher catalog. Keep each independent game at its original path. */
window.OriginalGames = (() => {
  'use strict';
  const games = [
    { id: 'hiragana', file: 'Pokemon-hiragana.html', title: 'ポケモン ひらがな', subtitle: 'このポケモン、だーれだ？', category: 'learn', label: 'ことば', art: 'hiragana', color: 'yellow', tags: ['ひらがな', 'クイズ'], description: 'シルエットを見て、ひらがなの名前をえらぼう。', controls: '名前のボタンをタップして答えよう。正解したら「つぎの ポケモン！」へ。' },
    { id: 'katakana', file: 'Pokemon-katakana.html', title: 'ポケモン カタカナ', subtitle: 'なまえを読んで、みつけよう。', category: 'learn', label: 'ことば', art: 'katakana', color: 'mint', tags: ['カタカナ', 'クイズ'], description: 'そっくりな名前の中から、正しいカタカナをみつけよう。', controls: '名前のボタンをタップして答えよう。鳴き声もヒントになるよ。' },
    { id: 'types', file: 'Pokemon-type-quiz.html', title: 'ポケモン タイプクイズ', subtitle: 'ほのお？ みず？ でんき？', category: 'learn', label: 'クイズ', art: 'types', color: 'peach', tags: ['タイプ', 'クイズ'], description: 'ポケモンをよく見て、ぴったりのタイプを当てよう。', controls: 'タイプのボタンをタップして答えよう。2つのタイプを持つポケモンもいるよ。' },
    { id: 'typing', file: 'Pokemon-typing.html', title: 'ポケモン タイピング', subtitle: 'すきな名前で、キーのれんしゅう。', category: 'learn', label: 'タイピング', art: 'typing', color: 'lavender', tags: ['ローマ字', 'キーボード'], description: 'ポケモンの名前をローマ字で入力。少しずつ速くなろう。', controls: '表示されたローマ字をキーボードで入力しよう。半角英数に切り替えて遊んでね。' },
    { id: 'kuku', file: 'pokemon-kuku.html', title: 'ポケモンでくく！', subtitle: 'いっしょに、九九をマスター。', category: 'learn', label: 'さんすう', art: 'kuku', color: 'sky', tags: ['九九', 'かけ算'], description: 'れんしゅうする段をえらんで、かけ算にチャレンジ。', controls: 'れんしゅうしたい段をえらぼう。画面の数字ボタンで答えを入力できるよ。' },
    { id: 'clock', file: 'pokemon-clock.html', title: 'ポケモン とけい', subtitle: 'いま、なんじ？', category: 'learn', label: 'とけい', art: 'clock', color: 'yellow', tags: ['時計', 'じかん'], description: '時計の針を見ながら、時間の読み方をおぼえよう。', controls: 'ゲーム内のモードをえらんで、時計の読み方をれんしゅうしよう。' },
    { id: 'brain', file: 'pokemon-brain-trainer.html', title: 'ポケモン 脳トレ', subtitle: 'おぼえる、かんがえる、ひらめく。', category: 'learn', label: '脳トレ', art: 'brain', color: 'mint', tags: ['5つのあそび', 'パズル'], description: 'おなじさがし・計算・ナインタイルなど、5つのあそび。', controls: '最初のメニューで5つのあそびからえらぼう。それぞれに設定と操作ボタンがあるよ。' },
    { id: 'ok-play', file: 'gomoku.html', title: 'OK PLAY', subtitle: '5つつなげる、ひらめき勝負。', category: 'board', label: 'ボードゲーム', art: 'board', color: 'peach', tags: ['2〜4人', '五目ならべ'], description: '自分の色のタイルを5つ並べよう。みんなでじっくり対戦。', controls: '2〜4人をえらんでスタート。タイルを置いて自分の色を5つつなげよう。UNDOで一手戻せるよ。' },
    { id: 'blokus', file: 'blokus.html', title: 'CORNER BLOCKS', subtitle: '角から、広がる。ブロックス風ゲーム。', category: 'board', label: 'ブロック陣取り', art: 'blocks', color: 'sky', tags: ['1〜4人', 'CPU対戦'], description: 'ブロックス風の陣取り。21種類のピースを角でつなごう。', controls: 'ピースを選び、回転・裏返しをして配置。1〜4人とCPUで遊べます。' },
    { id: 'mancala', file: 'mancala.html', title: 'マンカラ', subtitle: 'ころころ、石をめぐらせよう。', category: 'board', label: 'ボードゲーム', art: 'mancala', color: 'lavender', tags: ['2人', '対戦'], description: '石を順番に配って、自分のゴールに集めるボードゲーム。', controls: '自分の側の穴をえらぶと、石を順番に配れるよ。ゴールにたくさん石を集めよう。' },
    { id: 'space', file: 'space-shooter.html', title: 'SPACE SHOOTERS', subtitle: '宇宙をまもる、きみの出番。', category: 'action', label: 'シューティング', art: 'space', color: 'night', tags: ['1人', 'アクション'], description: '宇宙船を動かしてエイリアンを撃退。ハイスコアをねらおう。', controls: 'START MISSIONで開始。左右キーで移動、スペースキーで発射。画面下の移動・FIREボタンでも遊べるよ。' },
    { id: 'mirogue', file: 'mirogue.html', title: 'mirogue', subtitle: '一歩ずつ、ダンジョンの奥へ。', category: 'action', label: 'ダンジョン', art: 'dungeon', color: 'forest', tags: ['1人', 'ローグライク'], description: '道具を集め、敵と戦う。何が待っているかは進んでから。', controls: '画面のテンキーで移動。「決定」で拾う・階段、「地図」でマップを確認できるよ。' },
    { id: 'guitar', file: 'virtual-guitar.html', title: 'バーチャルギター', subtitle: 'ブラウザが、きみの楽器に。', category: 'music', label: '音楽', art: 'guitar', color: 'peach', tags: ['楽器', '音であそぶ'], description: '弦を鳴らしてコードを奏でよう。気軽にギター体験。', controls: '最初に画面をタップして音を有効にしよう。弦をタップしたり、設定でコードを変えたりできるよ。' }
  ];
  const categories = { learn: 'ポケモンでまなぶ', board: 'ボードゲーム', action: 'アクション', music: '音楽' };
  const memory = {};
  const storage = {
    read(key, fallback) {
      try { return JSON.parse(localStorage.getItem('original-games:' + key)) ?? fallback; }
      catch { return memory[key] ?? fallback; }
    },
    write(key, value) {
      memory[key] = value;
      try { localStorage.setItem('original-games:' + key, JSON.stringify(value)); } catch { /* Browsing still works without storage. */ }
    }
  };
  const favorites = () => {
    const ids = storage.read('favorites', []);
    return Array.isArray(ids) ? ids.filter(id => games.some(game => game.id === id)) : [];
  };
  function toggleFavorite(id) {
    const ids = favorites();
    const next = ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
    storage.write('favorites', next);
    return next.includes(id);
  }
  return Object.freeze({ games, categories, storage, favorites, toggleFavorite, gameUrl: id => games.find(game => game.id === id)?.file });
})();
