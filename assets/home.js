(() => {
  'use strict';
  const { games, categories, favorites, toggleFavorite, storage, gameUrl } = window.OriginalGames;
  const grid = document.getElementById('game-grid');
  const search = document.getElementById('search');
  const favoriteButton = document.getElementById('show-favorites');
  const clearButton = document.getElementById('clear-filters');
  let category = 'all';
  let favoritesOnly = false;

  function normalize(value) {
    return value.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g, character => String.fromCharCode(character.charCodeAt(0) - 0x60));
  }
  function matchingGames() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const saved = favorites();
    return games.filter(game => {
      const haystack = normalize([game.title, game.subtitle, game.description, categories[game.category], ...game.tags].join(' '));
      return (category === 'all' || category === game.category) && (!favoritesOnly || saved.includes(game.id)) && terms.every(term => haystack.includes(term));
    });
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function illustration(game) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 400 230');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(svg.namespaceURI, 'use');
    use.setAttribute('href', 'assets/illustrations.svg?v=20261025-2#' + game.art);
    svg.append(use);
    return svg;
  }
  function card(game) {
    const article = element('article', 'game-card');
    article.dataset.game = game.id;
    const visual = element('div', 'card-visual ' + game.color);
    const artLink = element('a', 'art-link');
    artLink.href = gameUrl(game.id);
    artLink.tabIndex = -1;
    artLink.setAttribute('aria-hidden', 'true');
    artLink.append(illustration(game));
    const badge = element('span', 'card-label', game.label);
    const favorite = element('button', 'favorite-toggle', favorites().includes(game.id) ? '♥' : '♡');
    favorite.type = 'button';
    favorite.dataset.favorite = game.id;
    favorite.setAttribute('aria-label', game.title + 'をお気に入りに' + (favorites().includes(game.id) ? '登録済み' : '登録'));
    favorite.setAttribute('aria-pressed', String(favorites().includes(game.id)));
    visual.append(artLink, badge, favorite);
    const body = element('div', 'card-body');
    const tags = element('div', 'card-tags');
    game.tags.forEach(tag => tags.append(element('span', '', tag)));
    const heading = element('h3');
    const link = element('a', 'game-title', game.title);
    link.href = gameUrl(game.id);
    heading.append(link);
    const description = element('p', 'card-description', game.description);
    const action = element('a', 'card-play');
    action.href = gameUrl(game.id);
    action.setAttribute('aria-label', game.title + 'であそぶ');
    action.append(element('span', '', 'あそぶ'), element('span', 'play-arrow', '↗'));
    body.append(tags, heading, description, action);
    article.append(visual, body);
    return article;
  }
  function render() {
    const results = matchingGames();
    grid.replaceChildren(...results.map(card));
    document.getElementById('favorite-count').textContent = favorites().length;
    document.getElementById('result-count').textContent = `${results.length}のあそび` + (favoritesOnly ? ' · お気に入り' : '');
    favoriteButton.setAttribute('aria-pressed', String(favoritesOnly));
    clearButton.hidden = category === 'all' && !search.value && !favoritesOnly;
    document.querySelectorAll('[data-category]').forEach(button => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('empty-state').hidden = results.length > 0;
    document.getElementById('empty-title').textContent = favoritesOnly && favorites().length === 0 ? 'お気に入りは、これから。' : 'あそびがみつかりませんでした';
    document.getElementById('empty-description').textContent = favoritesOnly && favorites().length === 0 ? 'ゲームの♡を押すと、ここに集まるよ。' : 'ちがうことばやカテゴリで、もういちどさがしてみてね。';
  }
  function reset() { category = 'all'; favoritesOnly = false; search.value = ''; render(); }
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
  search.addEventListener('input', render);
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-favorite]');
    if (!button) return;
    const id = button.dataset.favorite;
    toggleFavorite(id);
    render();
    // Preserve keyboard focus when updating the card list.
    const replacement = grid.querySelector(`[data-favorite="${id}"]`);
    if (replacement) replacement.focus({ preventScroll: true });
    else favoriteButton.focus({ preventScroll: true });
  });
  favoriteButton.addEventListener('click', () => { favoritesOnly = !favoritesOnly; category = 'all'; search.value = ''; render(); document.getElementById('games').scrollIntoView({ behavior: 'smooth' }); });
  document.querySelector('.nav-all').addEventListener('click', reset);
  clearButton.addEventListener('click', reset);
  document.getElementById('reset-search').addEventListener('click', reset);
  function recordRecent(game) {
    const saved = storage.read('recent', []);
    const recent = Array.isArray(saved) ? saved : [];
    storage.write('recent', [game.id, ...recent.filter(id => id !== game.id)].slice(0, 3));
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const game = games.find(item => item.file === link.getAttribute('href'));
    if (game) recordRecent(game);
  });
  document.getElementById('random-game').addEventListener('click', () => { const game = games[Math.floor(Math.random() * games.length)]; recordRecent(game); window.location.href = gameUrl(game.id); });
  function renderRecent() {
    const saved = storage.read('recent', []);
    const recent = Array.isArray(saved) ? saved.map(id => games.find(game => game.id === id)).filter(Boolean).slice(0, 3) : [];
    document.getElementById('recent-section').hidden = recent.length === 0;
    const links = recent.map(game => { const link = element('a', 'recent-link', game.title + ' ↗'); link.href = gameUrl(game.id); return link; });
    document.getElementById('recent-games').replaceChildren(...links);
  }
  window.addEventListener('pageshow', () => { render(); renderRecent(); });
  window.addEventListener('storage', () => { render(); renderRecent(); });
  render();
  renderRecent();
})();
