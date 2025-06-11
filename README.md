# 生命保険顧客向けダッシュボード アプリケーション

## 📋 プロジェクト概要

このアプリケーションは、生命保険の顧客に向けた包括的なダッシュボードシステムです。顧客の契約状況、提案プラン、シミュレーション機能、AIコンシェルジュ機能を統合的に提供し、視覚的でユーザーフレンドリーなインターフェースを通じて、顧客が自分の保険プランを理解し、最適化できるよう支援します。

### 🎯 主な機能

- **リアルタイム保障シミュレーション**: スライダーを使った直感的な保障額調整
- **レーダーチャート分析**: 保障の充足度を視覚的に表示
- **AIコンシェルジュ**: インタラクティブなガイダンスと情報提供
- **プラン比較**: 複数の保険プランの詳細比較
- **ライフイベントタイムライン**: 将来の保険ニーズ予測
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応

## 🏗️ アーキテクチャ

### 技術スタック

- **Frontend**: React 19.1.0
- **スタイリング**: Tailwind CSS 3.x
- **チャート**: ECharts 5.6.0 (echarts-for-react 3.0.2)
- **アニメーション**: GSAP 3.13.0
- **アイコン**: Font Awesome 6.7.2
- **ビルドツール**: Create React App 5.0.1

### 設計パターン

- **関心の分離**: コンポーネント、ロジック、データを明確に分離
- **カスタムフック**: 状態管理とビジネスロジックをフック化
- **純粋関数**: 計算処理をユーティリティ関数として分離
- **定数管理**: 静的データを定数ファイルで一元管理

## 📁 ディレクトリ構成

```
my-dashboard-app/
├── public/                          # 静的ファイル
│   ├── index.html                   # HTMLテンプレート
│   ├── pentan.png                   # AIコンシェルジュアイコン
│   ├── greeting.png                 # 各種ガイド画像
│   ├── analysis.png
│   ├── hearing.png
│   ├── comparison.png
│   ├── setting.png
│   └── ...                         # その他のPWA関連ファイル
├── src/                            # ソースコード
│   ├── components/                 # UIコンポーネント
│   │   ├── AiConcierge.jsx        # AIコンシェルジュパネル
│   │   ├── CoverageRadarChart.jsx # 保障レーダーチャート
│   │   ├── CurrentContracts.jsx   # 現在契約状況表示
│   │   ├── CustomerHeader.jsx     # 顧客情報ヘッダー
│   │   ├── PlanDetails.jsx        # プラン詳細・比較
│   │   ├── SimulationSliders.jsx  # シミュレーションスライダー
│   │   └── Timeline.jsx           # ライフイベントタイムライン
│   ├── constants/                  # 定数・設定データ
│   │   ├── aiContent.js           # AIコンシェルジュ静的コンテンツ
│   │   ├── customerData.js        # 顧客データ・プランデータ
│   │   ├── radarConfig.js         # レーダーチャート設定
│   │   ├── sliderConfig.js        # スライダー設定
│   │   └── timelineEvents.js      # タイムラインイベント
│   ├── hooks/                      # カスタムフック
│   │   ├── useAiConcierge.js      # AIコンシェルジュ状態管理
│   │   ├── useNotifications.js    # 通知機能
│   │   ├── usePlanSimulation.js   # プランシミュレーション
│   │   └── useRadarChartData.js   # レーダーチャートデータ計算
│   ├── utils/                      # ユーティリティ関数
│   │   └── calculationUtils.js    # 保険計算ロジック
│   ├── App.js                      # メインアプリケーション
│   ├── App.css                     # アプリケーション固有スタイル
│   ├── index.js                    # アプリケーションエントリーポイント
│   └── index.css                   # Tailwind CSSセットアップ
├── package.json                    # 依存関係とスクリプト
├── tailwind.config.js             # Tailwind CSS設定
└── README.md                      # プロジェクトドキュメント
```

## 🎨 コンポーネント構成

### 主要コンポーネント

#### 1. CustomerHeader.jsx (8.7KB, 187行)
- 顧客基本情報表示
- 通知バッジ表示
- プロフィールアイコン
- 最終更新日時表示

#### 2. CoverageRadarChart.jsx (18KB, 390行)
- EChartsを使用したレーダーチャート
- 必要保障・現契約・シミュレーション結果の3軸表示
- インタラクティブなツールチップ
- データ点の詳細表示機能

#### 3. PlanDetails.jsx (43KB, 736行)
- 複数プランの詳細表示
- プラン選択ボタン
- 保障内容の詳細情報
- 保険料の内訳表示
- プラン比較機能

#### 4. SimulationSliders.jsx (4.6KB, 93行)
- スライダーによる保障額調整
- リアルタイム計算更新
- カスタムプラン作成
- 入力値の検証機能

#### 5. AiConcierge.jsx (6.8KB, 137行)
- 右下固定のAIアシスタント
- 動的メッセージ表示
- お知らせ機能
- プロフィール編集機能
- 各種ガイダンス提供

#### 6. Timeline.jsx (19KB, 405行)
- ライフイベントタイムライン
- 年齢別保険ニーズ予測
- 将来の見直し提案
- アニメーション効果

#### 7. CurrentContracts.jsx (15KB, 292行)
- 現在の契約状況表示
- 本人・その他の保障内容
- 契約詳細の表示
- 保険料の表示

## 🔧 状態管理（カスタムフック）

### 1. useAiConcierge.js (23KB, 343行)
```javascript
const {
  isAiConciergeOpen,
  aiMessage,
  toggleAiConcierge,
  updateAiMessage,
  showOtherContractGuide,
  showCoverageDetailGuide,
  showRichBenefitDetailGuide
} = useAiConcierge();
```

**機能**:
- AIコンシェルジュの開閉状態管理
- 動的メッセージ生成
- 各種ガイダンス表示
- コンテキストに応じたメッセージ切り替え

### 2. usePlanSimulation.js (3.0KB, 81行)
```javascript
const {
  simulatedData,
  currentPlanContext,
  loadPlan,
  handleSliderChange
} = usePlanSimulation(initialSimData, customerData, generateAndSetAiMessage);
```

**機能**:
- プランデータの読み込み
- スライダー値の変更処理
- カスタムプランの作成
- プランコンテキストの管理

### 3. useRadarChartData.js (4.6KB, 103行)
```javascript
const {
  requiredRadarData,
  currentRadarData,
  simulatedRadarData,
  combinedCurrentCoverage,
  premiumBreakdownText,
  mainGapText,
  mainGapClass,
  indicatorsConfig
} = useRadarChartData(simulatedData, currentPlanContext, customerData);
```

**機能**:
- レーダーチャート用データ計算
- 保障充足度の算出
- 保険料内訳の計算
- ギャップ分析の実行

### 4. useNotifications.js (1.8KB, 49行)
```javascript
const {
  notificationCount,
  handleShowNotifications,
  showNotificationListHandler
} = useNotifications(updateAiMessage, userProfile);
```

**機能**:
- 通知件数の管理
- 通知表示処理
- AIメッセージとの連携

## 🧮 計算ロジック（ユーティリティ）

### calculationUtils.js (8.8KB, 192行)

主要な計算関数：

#### 1. calculateQuantitativeValue(dataSet, indicatorKey)
- 保障額の定量的価値計算
- 一時金 + 年金・月額給付の等価換算
- 死亡・就業不能保障の総合価値算出

#### 2. calculateMedicalCoverageScore(planData, isCurrentCoverage)
- 医療保障の質的レベル計算（0-100スケール）
- 保障内容の充実度評価
- 現契約と新プランの比較

#### 3. calculateRadarDataPoint(indicatorKey, planData, requiredData, isCurrentCoverage)
- レーダーチャートのデータポイント計算
- 必要保障に対する充足率の算出
- 各保障項目の達成度評価

#### 4. combineCurrentCoverage(self, other)
- 本人・その他の保障合算
- 重複排除処理
- 統合保障内容の作成

#### 5. calculateSimulatedPremium(simData, currentPlanContext, customerData)
- シミュレーション保険料計算
- 保障・貯蓄の保険料内訳
- カスタムプランの保険料推定

## 📊 データ構造

### 顧客データ (customerData.js)

```javascript
export const initialCustomerData = {
  profile: {
    name: "明治 太郎",
    age: 40,
    family: "配偶者, 子2人(10歳男, 8歳女)",
    address: "埼玉県川越市1-1-1",
    tags: ["#40代", "#子育て中", "#持ち家検討中", ...]
  },
  currentCoverageSelf: { /* 本人の現契約 */ },
  currentCoverageOther: { /* その他の現契約 */ },
  recommendedPlanData: { /* 推奨プラン */ },
  planAData: { /* プレミアプラン */ },
  planB_MedicalFocusData: { /* 医療重視プラン */ },
  planC_DeathFocusData: { /* 生活保障重視プラン */ },
  plyData: { /* 類似顧客分析データ */ }
};
```

### プランデータ構造

```javascript
{
  name: "プラン名",
  description: "プランの説明",
  deathLumpsum: 500,        // 死亡一時金（万円）
  deathAnnuity: 10,         // 死亡年金（万円/月）
  disabilityLumpsum: 1000,  // 就業不能一時金（万円）
  disabilityMonthly: 20,    // 就業不能月額（万円/月）
  medicalDaily: 4000,       // 入院日額（円）
  medicalSurgery: 0,        // 手術一時金（万円）
  criticalCancer: 100,      // がん一時金（万円）
  criticalCirculatory: 100, // 循環器一時金（万円）
  savingsMonthly: 35000,    // 積立額（円/月）
  totalPremium: 48000,      // 総保険料（円/月）
  protectionPremium: 16500, // 保障保険料（円/月）
  savingsPremium: 31500,    // 貯蓄保険料（円/月）
  benefitKeywords: ["balanced_plan", "education_fund"],
  medicalBenefitsIncluded: ["daily", "treatment", "postDischarge"]
}
```

## 🚀 開発・運用

### 必要要件

- **Node.js**: 16.x 以上
- **npm**: 8.x 以上
- **モダンブラウザ**: Chrome 90+, Firefox 88+, Safari 14+

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm start

# 本番ビルド
npm run build

# テスト実行
npm test
```

### 開発サーバー

```bash
npm start
```
- 開発モード: http://localhost:3000
- ホットリロード機能付き
- リアルタイムエラー表示

### 本番ビルド

```bash
npm run build
```
- 最適化されたビルドファイルを`build/`フォルダに生成
- JSバンドルの圧縮・最適化
- 静的ファイルのキャッシュ対応

## 🎨 スタイリング

### Tailwind CSS 設定

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### カスタムスタイル

主要なカスタムスタイルは`src/App.css`で定義：

- AIコンシェルジュのアニメーション
- レーダーチャートのカスタマイズ
- レスポンシブデザインの調整
- ホバーエフェクト・トランジション

## 🔧 設定・カスタマイズ

### 1. 保障計算パラメータの調整

```javascript
// src/utils/calculationUtils.js
const userTargetValues = {
  death: 5000,       // 死亡保障目標値（万円）
  disability: 8000,  // 就業不能保障目標値（万円）
  savings: 60000,    // 貯蓄目標値（円/月）
  critical: 400      // 重病保障目標値（万円）
};
```

### 2. レーダーチャート軸の設定

```javascript
// src/constants/radarConfig.js
export const indicatorsConfig = [
  { name: '死亡保障', key: 'death', max: 100 },
  { name: '就業不能保障', key: 'disability', max: 100 },
  { name: '医療保障', key: 'medical', max: 100 },
  { name: '重い病気', key: 'critical', max: 100 },
  { name: '貯蓄', key: 'savings', max: 100 }
];
```

### 3. プランデータの追加・変更

```javascript
// src/constants/customerData.js に新プランを追加
planDData: {
  name: "新プラン",
  description: "新しいプランの説明",
  // 保障内容の設定
  // ...
}
```

## 🧪 テスト

### 単体テスト

```bash
npm test
```

### テストファイル構成

- `src/App.test.js`: アプリケーション基本テスト
- `src/setupTests.js`: テスト環境設定

### 推奨テスト戦略

1. **コンポーネントテスト**: レンダリング・プロパティ・イベント処理
2. **フックテスト**: 状態管理・副作用の検証
3. **ユーティリティテスト**: 計算ロジックの精度検証
4. **統合テスト**: コンポーネント間の連携確認

## 📱 レスポンシブ対応

### ブレークポイント

- **モバイル**: 320px - 767px
- **タブレット**: 768px - 1023px
- **デスクトップ**: 1024px以上

### レスポンシブ機能

- 可変レイアウト
- タッチ操作対応
- 画面サイズ別コンテンツ最適化
- レーダーチャートの自動サイズ調整

## 🎯 パフォーマンス最適化

### 実装済み最適化

1. **useMemo**: 重い計算処理のメモ化
2. **useCallback**: 関数のメモ化とre-render防止
3. **コンポーネント分割**: 必要な部分のみ再レンダリング
4. **遅延ローディング**: 大きなデータの段階的読み込み


---#   l c - d a s h b o a r d  
 