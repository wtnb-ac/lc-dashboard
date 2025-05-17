// src/constants/timelineEvents.js

export const timelineEvents = {
    0: {
        title: "定期訪問", date: "3カ月前",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-calendar-check mr-2 opacity-80"></i>年に一度の定期訪問</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「太郎さん、こんにちは！<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" /> 最近ご様子いかがですか？年に一度の大切な確認です。」</p>
                     <p>ご挨拶からスタート。ご健康そうで何よりです😊</p>
                     <p>お子さまの中学受験を考え始めたとのこと。ライフプランも変わる節目、保険も一緒に見直しませんか？とお声がけしました。</p>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                       <p class="text-orange-800 font-medium"><i class="fas fa-heart mr-1.5 text-red-400"></i>当時の気持ち：<span class="font-normal text-gray-700">「特に変化ないかな…？」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">大切なご家族のため、この機会に見直しましょう！✨ 次は<strong class="text-green-700">現在のご契約</strong>を確認しますね。</span>
                   </div>
                 </div>`,
    },
    1: {
        title: "既契約の確認", date: "2.5ヶ月前",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-book-open mr-2 opacity-80"></i>ご加入中保険の確認</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「お預かりした証券、しっかり確認しました！<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" />🔍」</p>
                     <p class="font-semibold">＜わかったこと＞</p>
                     <ul class="list-disc list-inside space-y-1 pl-2">
                       <li>死亡保障 → 加入済みだけど、今の家族構成には少し足りないかも？</li>
                       <li>就業不能 → もしもの収入減への備え、もう少しあると安心？</li>
                       <li>医療保障 → 短期入院は対象外の可能性 (<strong class="text-red-600">要注意！</strong>)</li>
                     </ul>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                       <p class="text-orange-800 font-medium"><i class="fas fa-lightbulb mr-1.5 text-yellow-500"></i>当時の気づき：<span class="font-normal text-gray-700">「短期入院の保障、手薄だったんだ…」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">現状が分かりましたね！次は太郎さんの<strong class="text-green-700">「心配なこと」</strong>を教えてください。</span>
                   </div>
                 </div>`,
    },
    2: {
        title: "保障の目的確認", date: "2ヶ月前",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-clipboard-question mr-2 opacity-80"></i>どんなリスクに備えたい？</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「もしもの時、一番心配なのはどんなことですか？<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" />」</p>
                     <p>具体的な状況を想像しながら、太郎さんの不安やお考えをじっくりお伺いしました。</p>
                     <p class="font-semibold">＜一番大切なこと＞</p>
                     <p class="pl-2"><strong>『ご家族のため』</strong><i class="fas fa-heart text-red-500 mx-1"></i>。特に、<strong class="text-blue-700">万一の生活費</strong>と<strong class="text-blue-700">働けなくなった時の収入</strong>をしっかり守りたい。</p>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                       <p class="text-orange-800 font-medium"><i class="fas fa-check mr-1.5 text-green-500"></i>当時の決定：<span class="font-normal text-gray-700">「家族の生活を守る保障を優先しよう！」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">大切なお気持ち、しかと受け止めました！💪 次は<strong class="text-green-700">必要な保障額</strong>を計算しましょう。</span>
                   </div>
                 </div>`,
    },
    3: {
        title: "必要保障額の試算", date: "1.5ヶ月前",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-calculator mr-2 opacity-80"></i>必要保障額シミュレーション</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「先ほどのお気持ちを形にすると、どれくらいの備えが必要になるか計算してみますね<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" />」</p>
                     <p>シミュレーションの結果…万一の場合、必要額は <strong class="text-lg">約4,500万円</strong>。</p>
                     <p>現在の備えが約1,000万円なので、不足分 <strong class="text-red-600 text-lg">約3,500万円</strong> が新しい目標ですね！</p>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                       <p class="text-orange-800 font-medium"><i class="fas fa-bullseye mr-1.5 text-blue-500"></i>当時の目標：<span class="font-normal text-gray-700">「3,500万円をどう準備するか考えよう。」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">具体的な目標が見えました！🎯 これをカバーする<strong class="text-green-700">最初のプラン</strong>をご提案します。</span>
                   </div>
                 </div>`,
    },
    4: {
        title: "初回プラン提案とFB", date: "1ヶ月前",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-file-prescription mr-2 opacity-80"></i>初回プランのご提案</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「目標額3,500万円をカバーするため、死亡・就業不能中心のプランを作成しました！<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" />」</p>
                     <div class="customer-feedback-box mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                       <p class="font-semibold mb-1"><i class="fa-solid fa-comment mr-1 text-blue-600"></i> 太郎さん：「必要性は分かったけど、保険料が予算オーバーだな…。少し抑えたい。」</p>
                     </div>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                       <p class="text-orange-800 font-medium"><i class="fas fa-wallet mr-1.5 text-orange-500"></i>当時の悩み：<span class="font-normal text-gray-700">「保障は大事だけど、毎月の支払いが…」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">ご予算、大事ですよね！承知しました👍 次回は<strong class="text-green-700">調整したプラン</strong>を奥様もご一緩に！</span>
                   </div>
                 </div>`,
    },
    5: {
        title: "第2回提案(奥様同席)", date: "2週間前",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-comments mr-2 opacity-80"></i>第2回プラン提案 (奥様と)</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「ご予算に合わせて、医療保障などを調整したプランです。いかがでしょうか？<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" />」</p>
                     <p class="text-gray-600 text-[10px] pl-2">（死亡・就業不能は維持しつつ、医療・重病は基本レベルに調整）</p>
                     <div class="customer-feedback-box mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                       <p class="font-semibold mb-1"><i class="fa-solid fa-user-group mr-1 text-blue-600"></i> お二人：「この方向でいいね！<strong>学資準備</strong>も考えたい。」</p>
                     </div>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                       <p class="text-orange-800 font-medium"><i class="fas fa-graduation-cap mr-1.5 text-purple-500"></i>当時の希望：<span class="font-normal text-gray-700">「教育費もしっかり準備したい！」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">ご納得いただけて嬉しいです！学資も大切ですね✍️ これで<strong class="text-green-700">最終確認</strong>に進みましょう！</span>
                   </div>
                 </div>`,
    },
    6: {
        title: "プラン最終確認中", date: "現在",
        details: `<div class="step-detail-wrapper p-2">
                   <h4 class="text-base font-semibold text-orange-700 mb-2"><i class="fa-solid fa-lightbulb mr-2 opacity-80"></i>プラン最終確認中</h4>
                   <div class="space-y-2 text-xs">
                     <p class="agent-talk bg-green-50 p-2 rounded border border-green-100">「作成したプラン内容について、最終確認をお願いしています。<img src="pentan.png" alt="" class="inline-block h-4 align-middle mx-0.5" />」</p>
                     <p class="font-semibold">＜現在のプラン概要＞</p>
                     <ul class="list-disc list-inside space-y-1 pl-2">
                       <li>ご意向に沿った<strong class="text-blue-700">死亡・就業不能保障</strong></li>
                       <li>バランスを考慮した<strong class="text-blue-700">医療・重病保障</strong></li>
                       <li>将来に向けた<strong class="text-blue-700">学資準備</strong>の積立</li>
                     </ul>
                     <div class="reflection-prompt mt-3 border-t pt-2 border-orange-200">
                        <p class="text-orange-800 font-medium"><i class="fas fa-tasks mr-1.5 text-teal-500"></i>今考えていること：<span class="font-normal text-gray-700">「内容に納得。最終決定しようかな。」</span></p>
                     </div>
                   </div>
                   <div class="ai-comment-bubble mt-3 bg-orange-50 rounded p-2">
                     <img src="pentan.png" alt="" class="inline-block h-5 align-middle mr-1" />
                     <span class="text-xs font-medium text-orange-900">ここまで一緩に考えてくださり感謝です😌 ご不明点があればいつでもお声がけください！</span>
                   </div>
                 </div>`,
    }
};