# 生命保険の顧客向けダッシュボード アプリケーション ファイル構成 

## 概要

顧客の契約状況、提案プラン、シミュレーション機能などを統合的に表示するダッシュボードアプリケーション。React と Tailwind CSS を使用。状態管理とロジックの分離を目的としたリファクタリングを実施済み。

## ディレクトリ構成

my-dashboard-app/
├── public/
│ ├── index.html
│ └── pentan.png # AIコンシェルジュ用アイコン
├── src/
│ ├── components/ # UIコンポーネント
│ │ ├── AiConcierge.jsx
│ │ ├── CoverageRadarChart.jsx
│ │ ├── CurrentContracts.jsx
│ │ ├── CustomerHeader.jsx
│ │ ├── PlanDetails.jsx
│ │ ├── SimulationSliders.jsx
│ │ └── Timeline.jsx
│ ├── constants/ # 定数データ
│ │ ├── aiContent.js # AIコンシェルジュ静的コンテンツ (お知らせ、プロフィール)
│ │ ├── customerData.js # 顧客初期データ、プランデータ、PLYデータ等
│ │ ├── radarConfig.js # レーダーチャート軸設定、必要保障ベンチマーク
│ │ ├── sliderConfig.js # シミュレーションスライダー設定 (TODO: 移行)
│ │ └── timelineEvents.js # タイムラインイベントデータ
│ ├── hooks/ # カスタムフック (状態管理とロジック)
│ │ ├── useAiConcierge.js
│ │ ├── useNotifications.js
│ │ ├── usePlanSimulation.js
│ │ └── useRadarChartData.js
│ ├── utils/ # ユーティリティ関数 (純粋計算等)
│ │ └── calculationUtils.js
│ ├── App.js # メインアプリケーションコンポーネント
│ ├── index.css # Tailwind CSS セットアップ
│ └── index.js # アプリケーションエントリーポイント
├── package.json
├── tailwind.config.js
└── ... (その他の設定ファイル)


## 各ディレクトリと主要ファイルの役割

### `src/`

アプリケーションのソースコードのルートディレクトリ。

*   **`App.js`**:
    *   アプリケーション全体のレイアウトと構造を定義。
    *   各カスタムフック (`use...`) を呼び出し、状態とハンドラを取得。
    *   各UIコンポーネント (`components/*`) をレンダリングし、必要な Props を渡す。
    *   主にコンポーネントの組み立てと Props の受け渡しを担当。

### `src/components/`

再利用可能なUIコンポーネント群。

*   `CustomerHeader.jsx`: 顧客情報、通知アイコン、プロフィールアイコンを表示するヘッダー。
*   `CurrentContracts.jsx`: 現在の契約状況（本人・その他）を表示するセクション。
*   `CoverageRadarChart.jsx`: 保障の充足度を示すレーダーチャート。`echarts-for-react` を使用。
*   `PlanDetails.jsx`: 提案プランの詳細（保障内容、保険料など）を表示するセクション。プラン選択ボタンも含む。
*   `SimulationSliders.jsx`: 保障内容を調整するためのスライダー群。
*   `Timeline.jsx`: 顧客のライフイベントタイムラインを表示するセクション。
*   `AiConcierge.jsx`: 右下に表示されるAIコンシェルジュパネル。お知らせ、プロフィール編集、各種ガイダンスなどを表示。

### `src/constants/`

アプリケーション全体で使用される定数データ。

*   `customerData.js`: 顧客のプロフィール、初期シミュレーションデータ、各プラン（推奨、A、B、C）の詳細データ、既存契約データ、PLY（Peers Like You）データなどを保持。
*   `radarConfig.js`: レーダーチャートの軸（indicators）定義と、各軸の必要保障レベルのベンチマークデータ (`requiredCoverageBenchmark`) を保持。
*   `timelineEvents.js`: タイムラインに表示するイベントデータ。
*   `aiContent.js`: AIコンシェルジュに表示する静的なHTMLコンテンツ（お知らせ一覧・詳細、プロフィール編集画面）。
*   `sliderConfig.js`: シミュレーションスライダーの設定 (注: このファイルへの移行はまだ途中かもしれません)。

### `src/hooks/`

状態管理ロジックや関連するハンドラをカプセル化したカスタムフック。`App.js` の肥大化を防ぎ、関心の分離を促進。

*   `useAiConcierge.js`: AIコンシェルジュの開閉状態 (`isAiConciergeOpen`)、表示メッセージ (`aiMessage`)、および関連するハンドラ (`toggleAiConcierge`, `updateAiMessage` 等) を管理。
*   `useNotifications.js`: お知らせの未読件数 (`notificationCount`) と、お知らせ表示関連のハンドラ (`handleShowNotifications` 等) を管理。
*   `usePlanSimulation.js`: シミュレーション中のプランデータ (`simulatedData`)、現在選択されているプランのコンテキスト (`currentPlanContext`)、プラン読み込み (`loadPlan`) やスライダー変更 (`handleSliderChange`) のハンドラを管理。
*   `useRadarChartData.js`: レーダーチャート描画に必要な計算済みデータ（必要保障レベル `requiredRadarData`、現契約 `currentRadarData`、シミュレーション `simulatedRadarData`、チャート軸設定 `indicatorsConfig` 等）を `useMemo` を使って効率的に計算・提供。

### `src/utils/`

純粋な計算処理やデータ変換などを行うユーティリティ関数。特定のコンポーネントや状態に依存しない汎用的なロジック。

*   `calculationUtils.js`: 保障額の計算、医療保障スコアの計算、レーダーチャートのデータポイント計算、保険料計算、カバレッジギャップ計算などの関数群。

---
