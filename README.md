# オリジナルゲーム

12のゲーム・ツールをまとめた、インストール不要のホームです。

**ホーム:** https://kpcaf1274.github.io/ORIGINAL_GAMES/

## あそびかた

ホームは各ゲームのHTMLへ直接移動するランチャーです。ゲーム画面に共通メニューやホームボタンは追加していません。各ゲームは単体でも使えます。カテゴリ、検索、お気に入り、最近あそんだゲーム、おまかせ機能も使えます。

お気に入りと最近あそんだゲームは、そのブラウザに保存します。保存を許可しない環境でもゲームは開けます。ポケモンの画像・音声や一部の書体などには、各ゲームがもともと利用している外部サービスへの接続が必要です。

## 構成

- `index.html` — ホーム
- `assets/games.js` — ゲームの一覧、分類、説明、操作方法
- `assets/home.*` — ランチャーの画面と操作
- `assets/illustrations.svg` — ホームのイラスト（外部読み込みなし）
- ルートの各ゲームHTML — 従来どおり単体でも開けるゲーム本体

HTML・CSS・JavaScriptのみで動きます。ビルドや依存パッケージのインストールは不要です。

## ローカルで開く

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

`http://127.0.0.1:8000/` をブラウザで開きます。

## GitHub Pages

既存の GitHub Pages の `main` / `/ (root)` から配信します。`.nojekyll` により静的ファイルをそのまま公開します。すべて相対パスなので `/ORIGINAL_GAMES/` 配下でも使えます。

## ゲームの追加

1. ゲームのHTMLと必要なファイルを追加します。
2. `assets/games.js` の `games` に項目を追加します。
3. ホームの件数表示とJavaScript無効時のリンクを更新します。
4. ホームのリンクから、そのゲームのHTMLへ直接移動することを確認します。

## 統合元

既存の `ORIGINAL_GAMES` の7ファイルは内容を維持しています。

以下の5ファイルは、同じ所有者の [POKEMON-NAME-](https://github.com/kpcaf1274/POKEMON-NAME-)（コミット `db84e051ee2c3e1dfc9b0395e82e83c955a63912`）から、内容・ファイル名を変えずに取り込みました。

- `Pokemon-hiragana.html`
- `Pokemon-katakana.html`
- `Pokemon-type-quiz.html`
- `Pokemon-typing.html`
- `pokemon-kuku.html`

元リポジトリや従来のゲームURLも引き続き利用できます。移行前のポケモンゲームの保存情報がある場合、ブラウザの保存領域はURLごとに分かれるため、新しいURLには自動移行されません。
