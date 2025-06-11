// src/constants/timelineEvents.js

export const timelineEvents = {
    0: {
        id: 0,
        title: '定期訪問・現状確認',
        date: '2023-05-10',
        icon: 'fas fa-calendar-check',
        summary: (
            '<div class="dialogue-container">' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「太郎さん、こんにちは！その後いかがですか？上のお子さんの習い事がピアノにサッカーに…わあ、賑やかですね！週末はご家族でキャンプに行かれたとか。羨ましいです！そんな中で、最近は<span class="keyword-inline">教育費</span>や将来のことが少し気になり始めた、とお伺いしました。」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「そうなんだよ、ペンタン。子供のやりたいことは応援したいし、家族の楽しみも減らしたくない。でも、今の<span class="keyword-inline">備え</span>で本当に十分なのか、ちゃんと見直しておきたくてね。」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="きっかけ">#見直しのきっかけ</span>' +
                '</div>' +
            '</div>'
        ),
        image: 'greeting.png',
        keyPoints: ['教育費の悩み', '家族時間も大切', '備えの再確認'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-sky-500', text: 'text-sky-700', border: 'border-sky-300',
            accentBg: 'bg-sky-50', iconContainerBg: 'bg-sky-100', pentanWave: 'from-sky-400 to-cyan-300'
        },
    },
    1: {
        id: 1,
        title: '既契約分析・見える化',
        date: '2023-05-20',
        icon: 'fas fa-search-dollar',
        summary: (
            '<div class="dialogue-container">' +
                 '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「保険証券、見てもらったけど、やっぱり自分じゃよく分からなくて…。特に<span class="keyword-inline">医療保険</span>、入院5日目からっていうのは、今の時代だとちょっと心配だよね？<span class="keyword-inline">がん</span>以外の重い病気もカバーできてるのかな？」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「太郎さん、ご心配な点を詳しく教えていただきありがとうございます。確かに、医療保険の給付条件は気になるところですね。死亡保障は定期保険で1000万円確保されていますが、目的が少し曖昧な点がもったいないかもしれません。他の重い病気への備えも、これを機にしっかり確認しましょう！まずは<span class="keyword-inline">現状を正確に把握</span>することが大切ですから、今日の分析が第一歩です！」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="現状把握">#現状把握</span>' +
                '</div>' +
            '</div>'
        ),
        image: 'analysis.png',
        keyPoints: ['医療保障の条件不安', 'がん以外の重病は？', '現状を正確に把握'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-teal-500', text: 'text-teal-700', border: 'border-teal-300',
            accentBg: 'bg-teal-50', iconContainerBg: 'bg-teal-100', pentanWave: 'from-teal-400 to-emerald-300'
        },
    },
    2: {
        id: 2,
        title: '詳細ヒアリング',
        date: '2023-06-05',
        icon: 'fas fa-comments-dollar',
        summary: (
            '<div class="dialogue-container">' +
                '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「もし自分に何かあったら、子供たちには迷惑かけたくない。特に<span class="keyword-inline">教育費</span>はしっかり残してあげたいんだ。大学まで行かせてあげたいしね。」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="教育費重視">#教育費重視</span>' +
                '</div>' +
                '<div class="dialogue-block wife">' +
                    '<img src="/icons/wife_avatar.png" class="dialogue-icon" alt="妻">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「そうね、学費はもちろんだけど、日々の<span class="keyword-inline">生活費</span>も心配だわ。住宅ローンもまだ残っているし…。私一人で全部まかなえるか不安よ。」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="生活費も">#生活費も</span>' +
                '</div>' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「太郎さん、花子さん、お子様への深い愛情と、ご家族の将来を真剣に考えていらっしゃる想いがひしひしと伝わってきます。住宅ローンの残高や、理想の保険料など、具体的なお話もありがとうございます。これらの想いを形にするために、次のステップで<span class="keyword-inline">具体的なゴール</span>を一緒に設定しましょう。」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ),
        image: 'hearing.png',
        keyPoints: ['家族への想い', '教育費は聖域', 'ローンと生活費'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-300',
            accentBg: 'bg-amber-50', iconContainerBg: 'bg-amber-100', pentanWave: 'from-amber-400 to-yellow-300'
        },
    },
    3: {
        id: 3,
        title: 'ゴール設定・方向性確認',
        date: '2023-06-15',
        icon: 'fas fa-bullseye',
        summary: (
            '<div class="dialogue-container">' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「先日のヒアリングでお伺いした大切な想いを元に、保険で備えるべき具体的な<span class="keyword-inline">目標額</span>と<span class="keyword-inline">優先順位</span>を整理してみました。太郎さんの『子供たちの教育費と、万一の時の家族の生活費は絶対に守りたい！』というお気持ちを最優先に。医療保障については、短期入院にも対応しやすい<span class="keyword-inline">一時金重視</span>が良いかと。全体の保険料は、現状の負担を大きく超えない範囲で調整する、という方向性でいかがでしょうか？」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「うん、それでお願いしたい。子供たちのことは本当に一番大事だから、そこが手厚くなるのは安心だ。保険料もこのくらいなら、やっていけると思う。」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="方向性合意">#方向性合意</span>' +
                '</div>' +
            '</div>'
        ),
        image: 'setting.png',
        keyPoints: ['最優先：教育費＋生活費', '医療：一時金型へ', '保険料：現状維持'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300',
            accentBg: 'bg-orange-50', iconContainerBg: 'bg-orange-100', pentanWave: 'from-orange-400 to-red-300'
        },
    },
    4: {
        id: 4,
        title: 'プラン作成・比較検討',
        date: '2023-07-01',
        icon: 'fas fa-magic',
        summary: (
            '<div class="dialogue-container">' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「設定したゴールに向けて、具体的なプランを3つ作成してみました。Aプランは保障と保険料の<span class="keyword-inline">バランス型</span>、Bプランは保障を<span class="keyword-inline">手厚く</span>した安心型、Cプランは保険料をぐっと<span class="keyword-inline">抑えた</span>堅実型です。いかがでしょうか？」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「うーん、こうして見ると悩むね…。Bプランの手厚さは魅力的だけど、保険料も結構上がるんだな。Cプランは安いけど、ちょっと心許ない気もするし…。」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="悩む">#比較検討中</span>' +
                '</div>' +
                '<div class="dialogue-block wife">' +
                    '<img src="/icons/wife_avatar.png" class="dialogue-icon" alt="妻">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「そうねぇ…。Aプランが一番現実的かしら？でも、もう少し医療の部分を手厚くできないかしら？私がもし入院したら、家のことが心配で…。」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「かしこまりました！花子さんのご意見、とても大切です。では、Aプランをベースに、医療保障を少し充実させる方向で<span class="keyword-inline">カスタマイズ</span>してみましょう！きっとお二人にピッタリのプランが見つかりますよ！」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="調整開始">#調整開始</span>' +
                '</div>' +
            '</div>'
        ),
        image: 'comparison.png',
        keyPoints: ['悩む', 'カスタマイズ', '調整'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-300',
            accentBg: 'bg-indigo-50', iconContainerBg: 'bg-indigo-100', pentanWave: 'from-indigo-400 to-purple-400'
        },
    },
    5: {
        id: 5,
        title: 'プラン提案・最終確認',
        date: '未定',
        icon: 'fas fa-file-signature',
        summary: (
            '<div class="dialogue-container">' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「太郎さん、花子さん、お待たせいたしました！こちらがAプランをベースに医療保障を調整した<span class="keyword-inline">最終プラン</span>です。万一の際の生活費と教育費、そして花子さんが気にされていた医療一時金もバランス良く備えられたかと思います。いかがでしょうか？」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_happy_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「おお、これいいね！これなら万一の時も子供たちの<span class="keyword-inline">教育費も安心</span>だし、医療も手厚くなった。月々の<span class="keyword-inline">保険料も無理なく</span>続けられそうだ！」' +
                        '</p>' +
                    '</div>' +
                     '<span class="keyword-wappen" data-keyword-anim="納得！">#納得！</span>' +
                '</div>' +
                '<div class="dialogue-block wife">' +
                    '<img src="/icons/wife_avatar.png" class="dialogue-icon" alt="妻">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「ええ、私もこれなら安心できるわ。特に、私たちの家族にあった保険なので心強いです。」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「お二人にそう言っていただけて、私も嬉しいです！では、最終的な保障内容、保険金額、保険料について、もう一度しっかり<span class="keyword-inline">ご確認</span>いただきましょう。ご不明な点は遠慮なくおっしゃってくださいね。」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ),
        image: 'proposal.png',
        keyPoints: ['家族の想い、形に', '月々の負担も納得', '最終チェックOK'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-300',
            accentBg: 'bg-purple-50', iconContainerBg: 'bg-purple-100', pentanWave: 'from-purple-400 to-pink-400'
        },
        guidanceTitle: '最終プランのご確認と今後のステップ',
        guidanceContent: `
            <div class="space-y-3 text-xs">
                <p class="font-semibold text-purple-700">現在、最終プラン内容をご確認いただいている段階です。</p>
                <div>
                    <h5 class="font-bold text-gray-700 mb-1"><i class="fas fa-list-check mr-1.5 text-purple-500"></i>ご確認いただきたいポイント</h5>
                    <ul class="list-disc list-inside pl-3 space-y-0.5 text-gray-600">
                        <li>提案された保障内容は、以前お伺いしたご意向（教育資金、生活費、医療など）を十分にカバーできていますか？</li>
                        <li>保険金額や保険期間は適切ですか？</li>
                        <li>月々の保険料は、家計に無理のない範囲ですか？</li>
                        <li>不明な点や、再度説明を聞きたい箇所はありませんか？</li>
                    </ul>
                </div>
                <div>
                    <h5 class="font-bold text-gray-700 mb-1"><i class="fas fa-arrow-right-long mr-1.5 text-purple-500"></i>今後の流れ（ご意向確認後）</h5>
                    <ol class="list-decimal list-inside pl-3 space-y-0.5 text-gray-600">
                        <li>お申込意思の最終確認</li>
                        <li>お申込書類のご準備・ご記入</li>
                        <li>告知・審査手続き</li>
                        <li>ご契約成立・保険証券のお届け</li>
                    </ol>
                </div>
                <p class="text-gray-500 italic mt-2">ご不明な点がございましたら、お気軽に担当者までお申し付けください。</p>
            </div>
        `
    },
    6: {
        id: 6,
        title: 'プラン決定・申込手続',
        date: '未定',
        icon: 'fas fa-check-double',
        summary: (
            '<div class="dialogue-container">' +
                '<div class="dialogue-block customer">' +
                    '<img src="/icons/customer_avatar.png" class="dialogue-icon" alt="顧客">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「うん、このプランで決まりだ！ありがとう、ペンタン。それで、<span class="keyword-inline">申込</span>って何が必要になるのかな？時間とか結構かかる？」' +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="dialogue-block pentan">' +
                    '<img src="/pentan.png" class="dialogue-icon" alt="ペンタン">' +
                    '<div class="dialogue-content-wrapper">' +
                        '<p class="dialogue-text">' +
                            '「太郎さん、ご決断ありがとうございます！お申込手続きですね。まず、<span class="keyword-inline">重要事項のご説明</span>をさせていただき、その後、申込書類にご記入いただきます。健康状態などの<span class="keyword-inline">告知</span>も必要になりますね。お手続き自体はそれほどお時間はかかりませんよ。必要な書類なども改めてご案内しますのでご安心ください。」' +
                        '</p>' +
                    '</div>' +
                    '<span class="keyword-wappen" data-keyword-anim="契約へ！">#契約へ！</span>' +
                '</div>' +
            '</div>'
        ),
        image: '/images/timeline/timeline_6_application.png',
        keyPoints: ['いよいよ契約へ', '必要書類は？', '手続きスムーズに'],
        pentanComment: '',
        themeColorClass: {
            bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-300',
            accentBg: 'bg-green-50', iconContainerBg: 'bg-green-100', pentanWave: 'from-green-400 to-lime-300'
        },
        guidanceTitle: 'お申込手続きについて',
        guidanceContent: `
            <div class="space-y-3 text-xs">
                <p class="font-semibold text-green-700">プラン内容にご納得いただけましたら、お申込手続きに進みます。</p>
                <div>
                    <h5 class="font-bold text-gray-700 mb-1"><i class="fas fa-file-signature mr-1.5 text-green-500"></i>主な手続きステップ</h5>
                    <ol class="list-decimal list-inside pl-3 space-y-0.5 text-gray-600">
                        <li><strong>重要事項説明：</strong>担当者より、ご契約に関する大切な事柄をご説明します。</li>
                        <li><strong>申込書類のご記入：</strong>必要事項をご記入・ご捺印いただきます。</li>
                        <li><strong>告知：</strong>健康状態などについて正確にお知らせいただきます。</li>
                        <li><strong>保険料のお支払い方法選択：</strong>口座振替またはクレジットカード等をお選びいただきます。</li>
                    </ol>
                </div>
                <div>
                    <h5 class="font-bold text-gray-700 mb-1"><i class="fas fa-shield-alt mr-1.5 text-green-500"></i>ご契約成立までの流れ</h5>
                    <p class="text-gray-600">お申込後、保険会社による審査が行われます。審査が承認されると契約成立となり、後日保険証券をお届けいたします。</p>
                </div>
                 <div>
                    <h5 class="font-bold text-gray-700 mb-1"><i class="fas fa-undo mr-1.5 text-green-500"></i>クーリング・オフ制度</h5>
                    <p class="text-gray-600">ご契約後でも、一定期間内であれば無条件でお申込みの撤回またはご契約の解除ができます。</p>
                </div>
                <p class="text-gray-500 italic mt-2">ご準備いただくものや、お手続きの所要時間など、詳細は担当者よりご案内いたします。</p>
            </div>
        `
    }
};