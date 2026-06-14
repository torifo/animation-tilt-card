---
name: anim-tilt-card
description: "3d / spatial hover / micro-interaction animation (pure HTML/CSS/JS, no deps). Use when you need a hover / micro-interaction effect with a 3D / spatial feel — e.g. ポートフォリオ／コレクション／プロダクトカタログ／ローンチ予定リスト. マウス位置に応じてカードが 3D で傾き、表面のホログラム反射（conic gradient）と光帯（linear gradient）が滑らかに移動する。架空のソロデザインスタジオ **Studio HALO** の作品キュレーションサイトとして組み込んだ実用デモ。"
---

# anim-tilt-card (D·Ho · 3D ティルトカード)

Pure HTML + CSS + vanilla JS, **zero dependencies**. マウス位置に応じてカードが 3D で傾き、表面のホログラム反射（conic gradient）と光帯（linear gradient）が滑らかに移動する。架空のソロデザインスタジオ **Studio HALO** の作品キュレーションサイトとして組み込んだ実用デモ。

## When to use / 使いどころ
- **EN:** a *hover / micro-interaction* effect with a *3D / spatial* feel.
- **JP:** 3D・空間 × ホバー／マイクロインタラクション。推奨配置: ポートフォリオ／コレクション／プロダクトカタログ／ローンチ予定リスト

## Bundled assets / 同梱アセット
This skill folder is the reference implementation — copy from these files:
- `index.html` — full working demo (open to preview)
- `style.css` — component styles
- `script.js` — the self-contained logic
- `README.md` — full human-facing doc (JP): mechanism, accessibility, constraints

## How to apply / 組み込み手順
Copy the component CSS block from `style.css` and the script from `script.js` (no build step), then follow the markup/parameters below.

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

## Customize / カスタマイズ
### カスタマイズ可能な属性
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

---
> Full mechanism, accessibility and known constraints: see **`README.md`** / 詳細・機構・アクセシビリティは README.md 参照。
