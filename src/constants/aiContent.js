// src/constants/aiContent.js

export const profileEditorHtml = `
<div class="p-3 text-sm space-y-3">
  <h4 class="text-base font-bold text-green-800 mb-2 border-b border-green-200 pb-1">プロフィール編集</h4>
  
  <div>
    <label class="block text-xs font-medium text-gray-600 mb-0.5">氏名</label>
    <input type="text" value="明治 太郎" class="w-full p-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500" readonly />
  </div>
  <div>
    <label class="block text-xs font-medium text-gray-600 mb-0.5">住所</label>
    <input type="text" value="埼玉県川越市1-1-1" class="w-full p-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500" readonly />
  </div>
  <div>
    <label class="block text-xs font-medium text-gray-600 mb-0.5">生年月日</label>
    <input type="text" value="1984/05/15" class="w-full p-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500" readonly />
  </div>
  <div>
    <label class="block text-xs font-medium text-gray-600 mb-0.5">メールアドレス</label>
    <input type="email" value="taro.meiji@example.com" class="w-full p-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500" readonly />
  </div>
  <button class="text-xs bg-emerald-600 text-white py-1 px-2 rounded hover:bg-emerald-700">基本情報を更新</button>

  <h5 class="font-semibold text-green-800 mt-4 pt-2 mb-2 border-b border-green-200 pb-1 text-base">世帯情報</h5>
  
  <div class="space-y-1">
    <p class="text-xs font-medium text-gray-600 flex justify-between items-center">
      <span>配偶者:</span>
      <button class="text-xs bg-gray-200 text-gray-700 py-0.5 px-1.5 rounded hover:bg-gray-300">+ 追加</button>
    </p>
    <div class="flex items-center justify-between gap-2 text-xs bg-gray-50 p-1.5 border border-gray-200 rounded">
      <span>明治 花子 (38歳)</span>
      <div>
          <button class="text-blue-600 hover:underline text-[10px] px-1">編集</button>
          <button class="text-red-600 hover:underline text-[10px] px-1">削除</button>
      </div>
    </div>
  </div>

  <div class="space-y-1">
     <p class="text-xs font-medium text-gray-600 flex justify-between items-center">
        <span>お子様:</span>
        <button class="text-xs bg-gray-200 text-gray-700 py-0.5 px-1.5 rounded hover:bg-gray-300">+ 追加</button>
    </p>
    <div class="flex items-center justify-between gap-2 text-xs bg-gray-50 p-1.5 border border-gray-200 rounded">
      <span>明治 一郎 (10歳)</span>
      <div>
          <button class="text-blue-600 hover:underline text-[10px] px-1">編集</button>
          <button class="text-red-600 hover:underline text-[10px] px-1">削除</button>
      </div>
    </div>
     <div class="flex items-center justify-between gap-2 text-xs bg-gray-50 p-1.5 border border-gray-200 rounded">
      <span>明治 次子 (8歳)</span>
       <div>
          <button class="text-blue-600 hover:underline text-[10px] px-1">編集</button>
          <button class="text-red-600 hover:underline text-[10px] px-1">削除</button>
      </div>
    </div>
  </div>
  
   <div class="space-y-1">
     <p class="text-xs font-medium text-gray-600 flex justify-between items-center">
        <span>ご両親:</span>
        <button class="text-xs bg-gray-200 text-gray-700 py-0.5 px-1.5 rounded hover:bg-gray-300">+ 追加</button>
     </p>
     <p class="text-xs text-gray-400 italic px-1.5 py-1">（未登録）</p>
  </div>

   <p class="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">※ 変更内容を送信するには下のボタンを押してください。</p>
    <button class="mt-1 text-sm w-full bg-amber-400 text-emerald-900 py-1.5 rounded font-semibold hover:bg-amber-300 transition-colors duration-200">変更内容をペンタンに伝える</button>
</div>
`;

export const notificationListHtml = (isUnread) => `
<div class="p-3 text-sm space-y-3">
  <h4 class="text-base font-bold text-green-800 mb-3 border-b border-green-200 pb-1 flex justify-between items-center"><span>お知らせ</span> <button class="text-xs text-gray-500 hover:text-gray-700">すべて既読</button></h4>

  <div class="notification-card cursor-pointer p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 bg-white shadow-sm transition-colors duration-150" data-notification-id="kawagoe_support">
    <div class="flex items-center justify-between mb-1">
      <span class="font-semibold text-blue-700 text-sm flex items-center">
        ${isUnread ? '<span class="inline-block h-2 w-2 bg-blue-500 rounded-full mr-2"></span>' : '<span class="inline-block h-2 w-2 mr-2"></span>'}
        <i class="fas fa-baby mr-1.5"></i>子育て支援情報
      </span>
      <span class="text-xs text-gray-400">2日前</span>
    </div>
    <p class="text-xs text-gray-600 pl-4">お住まいの川越市の児童手当や医療費助成など、利用可能な支援制度について...</p>
  </div>

   <div class="notification-card cursor-pointer p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 bg-white shadow-sm transition-colors duration-150" data-notification-id="medical_expense">
    <div class="flex items-center justify-between mb-1">
      <span class="font-semibold text-orange-700 text-sm flex items-center">
        ${isUnread ? '<span class="inline-block h-2 w-2 bg-orange-500 rounded-full mr-2"></span>' : '<span class="inline-block h-2 w-2 mr-2"></span>'}
        <i class="fas fa-notes-medical mr-1.5"></i>【重要】高額療養費制度
      </span>
       <span class="text-xs text-gray-400">1日前</span>
    </div>
    <p class="text-xs text-gray-600 pl-4">制度見直しによる自己負担額への影響について、ご確認ください...</p>
  </div>

  <button class="close-concierge-button mt-3 text-sm w-full bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors duration-200">閉じる</button>
</div>
`;

export const kawagoeSupportDetailHtml = `
<div class="p-3 text-sm space-y-3">
  <button class="back-to-notifications text-xs text-blue-600 hover:underline mb-2"><i class="fas fa-chevron-left mr-1"></i> お知らせ一覧に戻る</button>
  <h4 class="text-base font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1 flex items-center">
     <i class="fas fa-baby mr-2"></i> お住まいの地域の子育て支援情報 (川越市)
  </h4>
   <p class="text-xs text-gray-500 mb-3">明治 太郎様のお住まいの埼玉県川越市で利用可能な主な子育て支援制度です。</p>
    <ul class="list-disc list-inside space-y-2 text-xs pl-2 text-gray-700">
      <li><strong>児童手当:</strong> 高校生年代まで月1〜1.5万円 (所得制限撤廃後)。出生翌月から高校卒業年の3月まで。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
      <li><strong>子育てファミリー応援給付金:</strong> 出生児1人につき最大5,000円相当のベビー用品等を給付。1歳未満で申請。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
      <li><strong>出産・子育て応援給付金:</strong> 妊娠届提出時に5万円、出生届提出後に5万円を給付（国・市連携）。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
      <li><strong>子ども医療費助成:</strong> 18歳年度末まで医療費の自己負担分（保険診療）を助成。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
      <li><strong>病児保育・一時預かり/ファミサポ:</strong> 就労等の理由で家庭での保育が困難な場合に、施設での預かりや地域でのマッチング支援（有料）。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
      <li><strong>子育て世代包括支援センター:</strong> 妊娠・出産・育児に関する相談、情報提供、手続き等をワンストップで支援。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
      <li><strong>子育て支援メール配信:</strong> 給付金の申請期限、地域のイベント、防灘情報などをメールでお知らせ。 <a href="#" class="text-blue-600 hover:underline text-[10px] ml-1" target="_blank" rel="noopener noreferrer">(市HP)</a></li>
    </ul>
    <p class="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">詳細な条件や申請方法は、必ず川越市の公式ウェブサイトや担当窓口でご確認ください。</p>
    <button class="close-concierge-button mt-2 text-sm w-full bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors duration-200">閉じる</button>
</div>
`;

export const medicalExpenseDetailHtml = `
<div class="p-3 text-sm space-y-3">
  <button class="back-to-notifications text-xs text-blue-600 hover:underline mb-2"><i class="fas fa-chevron-left mr-1"></i> お知らせ一覧に戻る</button>
  <h4 class="text-base font-bold text-orange-800 mb-2 border-b border-orange-200 pb-1 flex items-center">
     <i class="fas fa-notes-medical mr-2"></i> 【重要】高額療養費制度の見直しについて
  </h4>
  <p class="text-xs text-gray-700 leading-relaxed">医療費が高額になった際の自己負担額を抑える「高額療養費制度」について、現在見直しが検討されています。</p>
  <div class="bg-orange-50 border border-orange-200 p-2.5 rounded mt-2 space-y-1.5">
    <p class="text-sm font-semibold text-orange-900">見直しのポイント <i class="fas fa-exclamation-circle ml-1"></i></p>
    <ul class="list-disc list-inside space-y-1 text-xs pl-2 text-gray-700">
      <li>政府の修正案に基づくと、制度利用者の<strong class="text-red-600">約7割で自己負担額が増加</strong>する可能性があるとの試算が発表されました（東京大学 五十嵐特任准教授による試算）。</li>
      <li>影韚は<strong class="text-gray-800">がん（大腸がん、乳がん等）、循環器疾患、糖尿病</strong>など、幅広い病気の患者さんに及ぶ可能性があります。</li>
      <li>特に長期間の治療が必要な方への影響が懸念されており、患者団体からは見直しの凍結・修正を求める声も上がっています。</li>
      <li>今後の<strong class="text-gray-800">制度改正の動向に注意</strong>が必要です。</li>
    </ul>
   </div>
   <p class="text-xs text-gray-500 mt-3">この見直しは、将来の医療費負担に影韚を与える可能性があります。ご自身の状泚に合わせて、最新情報を確認するようにしましょう。</p>
   <div class="text-right mt-1">
      <a href="#" class="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">関連ニュース・情報源を見る (ダミー)</a>
   </div>
   <button class="close-concierge-button mt-2 text-sm w-full bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors duration-200">閉じる</button>
</div>
`;

export const otherContractGuideHtml = `
<div class="p-3 text-sm space-y-4">
  <h4 class="text-base font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-1.5 flex items-center">
    <i class="fas fa-file-import mr-2.5 text-emerald-600"></i>他社保険の情報を入力
  </h4>
  <p class="text-xs text-gray-700">
    ご加入中の他社保険について、以下の情報を入力いただくと、より正確なプランのご提案や比較が可能になります。
  </p>
  <div class="p-3 bg-sky-50 rounded-lg border border-sky-200 shadow-sm">
    <h5 class="font-semibold text-sky-800 mb-2 text-sm"><i class="fas fa-list-alt mr-2"></i>主な入力項目リスト</h5>
    <ul class="list-none space-y-1.5 text-xs text-gray-600">
      <li class="flex items-center"><i class="fas fa-building w-4 text-center mr-2 text-sky-500"></i>保険会社名</li>
      <li class="flex items-center"><i class="fas fa-shield-alt w-4 text-center mr-2 text-sky-500"></i>保険の種類 (例: 終身保険、医療保険)</li>
      <li class="flex items-center"><i class="fas fa-yen-sign w-4 text-center mr-2 text-sky-500"></i>主な保障額 (例: 死亡保障 1,000万円)</li>
      <li class="flex items-center"><i class="fas fa-calendar-alt w-4 text-center mr-2 text-sky-500"></i>保険期間・払込期間</li>
      <li class="flex items-center"><i class="fas fa-wallet w-4 text-center mr-2 text-sky-500"></i>毎月の保険料</li>
    </ul>
  </div>
  <p class="text-xs text-gray-500 mt-2">
    <i class="fas fa-info-circle mr-1 text-gray-400"></i>お手元に保険証券をご用意いただくとスムーズにご入力いただけます。
  </p>
  <div class="p-3 bg-teal-50 rounded-lg border border-teal-200 shadow-sm mt-3">
    <h5 class="font-semibold text-teal-800 mb-1.5 text-sm"><i class="fas fa-camera-retro mr-2 text-teal-600"></i>カンタン登録！OCR機能</h5>
    <p class="text-xs text-gray-700 leading-relaxed">
      お手持ちの保険証券をスマートフォンで撮影してアップロードするだけで、AIが内容を自動解析し、カンタンに登録できます！
    </p>
  </div>
  <div class="mt-4">
    <button class="w-full bg-amber-400 hover:bg-amber-300 text-emerald-900 font-semibold py-2 px-3 rounded-md shadow hover:shadow-md transition-all duration-200 text-sm flex items-center justify-center">
      <i class="fas fa-keyboard mr-2"></i>入力フォームを開く (開発中)
    </button>
    <button class="close-concierge-button mt-2 text-sm w-full bg-gray-200 text-gray-700 py-1.5 rounded hover:bg-gray-300 transition-colors duration-200">今はしない</button>
  </div>
</div>
`;

export const coverageDetailGuideHtmlTemplate = `
<div class="p-3 text-sm space-y-3">
  <h4 class="text-base font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-1.5 flex items-center">
    <i class="{{iconClass}} mr-2.5 text-emerald-600"></i>「{{itemName}}」について
  </h4>

  <p class="text-sm text-gray-700">
    現在ご加入中の「{{itemName}}」の保障額は <strong class="text-emerald-700 text-md">{{itemValueString}}</strong> です。
  </p>
  {{else}}
  <p class="text-sm text-gray-600 italic">
    現在「{{itemName}}」の保障は登録されていません。
  </p>


  <div class="p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
    <h5 class="font-semibold text-green-800 mb-1.5 text-sm"><i class="fas fa-question-circle mr-2"></i>どんな保障なの？</h5>
    <p class="text-xs text-gray-600 leading-relaxed">
      {{itemDescription}}
    </p>
  </div>

  <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm mt-2">
    <h5 class="font-semibold text-yellow-800 mb-1.5 text-sm"><i class="fas fa-lightbulb mr-2"></i>ワンポイントアドバイス</h5>
    <p class="text-xs text-gray-600 leading-relaxed">
      {{itemTips}}
    </p>
  </div>


  <div class="mt-4 space-y-2">
    <button class="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-1.5 px-3 rounded-md shadow hover:shadow-md transition-all duration-200 text-xs flex items-center justify-center">
      <i class="fas fa-calculator mr-2"></i>必要保障額をシミュレーション (開発中)
    </button>
    <button class="close-concierge-button text-sm w-full bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors duration-200">詳しく分かった！</button>
  </div>
</div>
`;

export const richBenefitDetailGuideHtmlTemplate = `
<div class="p-3.5 text-sm space-y-4 bg-white rounded-lg shadow-xl">
  <div class="flex items-center justify-between pb-2 border-b border-gray-200">
    <h4 class="text-lg font-bold text-emerald-700 flex items-center">
      <i class="{{benefitIconClass}} mr-2.5 text-2xl"></i>
      「{{benefitName}}」詳細ガイド
    </h4>
    <button class="close-concierge-button text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
  </div>

  <!-- 現在の設定値 -->
  <div class="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
    <p class="text-sm text-emerald-800">
      現在のプラン「<strong>{{currentPlanName}}</strong>」での設定： 
      <strong class="text-lg ml-1">{{currentValueString}}</strong>
        <span class="text-xs text-emerald-700 ml-1"> ({{currentSubValueString}})</span>
    </p>
  </div>

  <!-- 1. 必要性 -->
  <div class="content-section">
    <h5 class="section-title"><i class="fas fa-check-circle text-green-500 mr-2"></i>この保障の役割・必要性</h5>
    <p class="section-text">{{necessityText}}</p>
  </div>

  <!-- 2. 設定している根拠 -->
  <div class="content-section">
    <h5 class="section-title"><i class="fas fa-bullseye text-red-500 mr-2"></i>設定の考え方・プランでの位置づけ</h5>
    <p class="section-text"><strong>一般的な必要保障額の考え方：</strong><br>{{{rationaleTextGeneralHtml}}}</p>
    <p class="section-text mt-1.5"><strong>「{{currentPlanName}}」での考え方：</strong><br>{{{rationaleTextPlanSpecificHtml}}}</p>
      <p class="section-text mt-1.5"><strong>一時金と年金の役割：</strong><br>{{annuityLumpsumRoleText}}</p>
  </div>

  <!-- 4. 保険金額の変更イメージ -->
  <div class="content-section">
    <h5 class="section-title"><i class="fas fa-sliders-h text-purple-500 mr-2"></i>保障額の調整イメージ</h5>
    <p class="text-xs text-gray-600 mb-2">現在の設定値「{{currentValueString}}」から変更する場合のイメージです。(実際のプランには反映されません)</p>
    <div class="space-y-1.5 amount-options">
      {{amountOptionsHTML}}
    </div>
    <p class="text-xs text-gray-500">※上記はあくまで目安です。全体のバランスや他の保障との組み合わせで変動します。</p>
  </div>
  
  <style>
    .content-section { background-color: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom:12px; }
    .section-title { font-size: 0.95rem; font-weight: 600; color: #374151; margin-bottom: 8px; display: flex; align-items: center; }
    .section-text { font-size: 0.8rem; color: #4b5563; line-height: 1.6; }
    .amount-options label { display: block; background-color: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #d1d5db; cursor: pointer; transition: all 0.2s ease-in-out; }
    .amount-options label:hover { border-color: #60a5fa; background-color: #eff6ff; }
    .amount-options input[type="radio"] { display: none; }
    .amount-options input[type="radio"]:checked + label { background-color: #3b82f6; border-color: #2563eb; color: white; font-weight: 500; }
    .amount-options input[type="radio"]:checked + label .option-premium { color: #e0f2fe; }
    .option-value { font-weight: 600; }
    .option-premium { font-size: 0.7rem; color: #059669; margin-left: 8px; }
    .custom-list { list-style: none; padding-left: 0; }
    .custom-list li { display: flex; align-items: flex-start; margin-bottom: 4px; }
    .custom-list li i { margin-right: 8px; color: #10b981; /* Emerald 500 */ margin-top: 3px; }
  </style>
</div>
`;