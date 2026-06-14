# D·Ho · 3D ティルトカード

> マウス位置に応じてカードが 3D で傾き、表面のホログラム反射（conic gradient）と光帯（linear gradient）が滑らかに移動する。架空のソロデザインスタジオ **Studio HALO** の作品キュレーションサイトとして組み込んだ実用デモ。

**Live demo**: `./index.html`

## 概要

| 項目 | 内容 |
|---|---|
| ジャンル | D · 3D / 空間 |
| 用途 | Ho · ホバー |
| 主な参考 | vanilla-tilt, Tobias Reich |
| 依存 | なし（Pure HTML + CSS + Vanilla JS） |
| 推奨配置 | ポートフォリオ／コレクション／プロダクトカタログ／ローンチ予定リスト |


## スキルとして導入 / Install as a skill

このリポジトリは Claude Code / Codex CLI 共通の **`SKILL.md`**（オープン標準）を同梱しており、AI エージェントのスキルとして使えます。リポジトリ自体をスキルディレクトリへリンクするだけです。

This repo ships a cross-agent **`SKILL.md`** (open standard) usable by both Claude Code and Codex CLI. Just link the repo into the agent's skills directory.

```bash
# Claude Code
ln -s "$(pwd)" ~/.claude/skills/anim-tilt-card
# Codex CLI
ln -s "$(pwd)" ~/.codex/skills/anim-tilt-card
```

エージェントを再起動すると `description` に基づき自動でマッチします（スキル名: `anim-tilt-card`）。
Restart the agent; it is matched automatically by the skill's `description` (skill name: `anim-tilt-card`).

## 仕組み

各 `[data-tilt]` カードの上で `pointermove` を拾い、カード中心からのオフセット (-1..1) を計算。それを `rotateX` / `rotateY` の目標値とし、`requestAnimationFrame` で `cur += (target - cur) * ease` の指数アプローチで滑らかに追従する。

カード表面の 2 つのレイヤーが傾きに同期して動く：

- **`[data-tilt-gloss]`** — `conic-gradient` で 6 色のホログラム。中心 (`--gx` / `--gy`) と開始角 (`--gloss-angle`) を tilt 量に応じて移動。`mix-blend-mode: overlay`
- **`[data-tilt-shine]`** — 細い `linear-gradient` の光帯。`background-position` を tilt の逆方向に動かして「光源が固定されている」感を出す。`mix-blend-mode: screen`

カーソルが離れると目標値が 0 に戻り、ease で復帰する。完全に静止した時点で `transform: ''` を消して GPU 合成も外す。

## 組み込み手順

### 1. 2 ファイルをコピー

`style.css` の `/* ─── COMPONENT ─── */` ブロック（`.tilt-card` / `.tc-*` / `.halo*`）と、`script.js` の IIFE 全体を移植先へ。外部依存ゼロ。

### 2. マークアップ

```html
<article class="tilt-card" data-tilt>
  <div class="tc-inner">
    <div class="tc-vis"> <!-- 上半分のビジュアル --> </div>
    <div class="tc-meta">
      <span class="tc-no">WORK · 03</span>
      <h3 class="tc-title">Tide <em>identity</em></h3>
      <dl class="tc-spec"> <!-- メタ情報 --> </dl>
    </div>
    <span class="tc-edition">EDITION · 03 / 24</span>
    <div class="tc-gloss" data-tilt-gloss aria-hidden="true"></div>
    <div class="tc-shine" data-tilt-shine aria-hidden="true"></div>
  </div>
</article>
```

## カスタマイズ可能な属性

| データ属性 | 役割 | デフォルト | 範囲 |
|---|---|---|---|
| `data-tilt-max` | 最大傾き角（°） | `14` | 0–40 |
| `data-tilt-perspective` | 奥行き（px） | `900` | 200–3000 |
| `data-tilt-scale` | hover 時のスケール倍率 | `1.04` | 1–1.2 |
| `data-tilt-ease` | 追従の ease 係数（大きいほどスナップ） | `0.14` | 0.04–0.5 |

### よくある調整例

```html
<!-- 控えめに傾く -->
<article class="tilt-card" data-tilt data-tilt-max="6" data-tilt-scale="1.02"></article>

<!-- 速くスナップ -->
<article class="tilt-card" data-tilt data-tilt-ease="0.32"></article>

<!-- 奥行きを強める -->
<article class="tilt-card" data-tilt data-tilt-perspective="600"></article>
```

## アクセシビリティ

- `prefers-reduced-motion: reduce` 時はスクリプトを起動せず、CSS 側でも `transform: none` で静的なカードとして表示。
- `pointer: coarse`（タッチ端末）でも自動的に無効化（誤動作防止）。
- 装飾ビジュアル要素は `aria-hidden`。本文（タイトル / dl）は通常のセマンティクス（h3 / dl）。

## 制約 / 既知の挙動

- カードの境界をまたぐ pointer 移動が頻発する環境（並べた grid）では、enter/leave が短時間に切り替わる。ease 補間で見た目は滑らかだが、CPU 負荷が増える場合は `--tilt-ease` を上げてフレーム回数を減らす。
- 完全に静止すると `transform: ''` でクリアし、GPU 合成も外している（メモリ節約）。
- `pointer: fine` 判定は初期化時のみ。途中でデバイス入力が変わる SLI/dock 環境では再読込が必要。

## 変更履歴

- **v0.1** — 初版。6 作品の作風別 CSS visual、conic gradient gloss + linear shine、pointermove → ease 補間。

## ライセンス

ANIMATION DESIGN STUDY の一部として公開（コピペ自由）。
