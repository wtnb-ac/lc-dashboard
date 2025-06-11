import { useState, useCallback } from 'react';
import { otherContractGuideHtml, coverageDetailGuideHtmlTemplate, richBenefitDetailGuideHtmlTemplate } from '../constants/aiContent'; // 新しいHTMLをインポート

// テンプレートエンジン的な簡易置換関数
const simpleTemplateRender = (template, data) => {
  let rendered = template;
  for (const key in data) {
    const regexIf = new RegExp(`{{\s*#if ${key}\s*}}([\s\S]*?){{\s*\/${key}\s*}}`, 'g');
    rendered = rendered.replace(regexIf, (match, p1) => data[key] ? p1 : '');
    // HTMLを許可するキーの置換 (例: rationaleTextGeneralHtml)
    if (key.endsWith('Html')) {
        rendered = rendered.replace(new RegExp(`{{{${key}}}}`, 'g'), data[key] || '');
    } else {
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
    }
  }
  rendered = rendered.replace(/{{\s*#if \w+\s*}}([\s\S]*?){{\s*\/\w+\s*}}/g, '');
  return rendered;
};

// 各保障アイテムの補足情報 (アイコンクラス、説明、アドバイス)
const coverageItemDetails = {
  '死亡一時金': {
    iconClass: 'fa-solid fa-umbrella',
    description: '万が一の時、のこされたご家族の経済的負担を軽減する一時金です。',
    tips: 'ライフステージの変化に合わせて保障額を見直しましょう。',
    necessityText: '遺された家族の生活を守るための重要な一時金です。特に家計の主たる収入源の方は優先的に検討しましょう。',
    rationaleTextGeneralHtml: `
      <ul class="custom-list">
        <li><i class="fas fa-check"></i>末子の独立までの生活費</li>
        <li><i class="fas fa-check"></i>配偶者の生活費</li>
        <li><i class="fas fa-check"></i>住居関連費（ローンなど）</li>
        <li><i class="fas fa-check"></i>お子様の教育費</li>
        <li><i class="fas fa-check"></i>葬儀費用・その他緊急資金</li>
      </ul>
      <p class="mt-1 text-xs text-gray-500"><i class="fas fa-info-circle mr-1"></i>公的保障（遺族年金等）で不足する分を補うのが基本です。</p>
    `,
    annuityLumpsumRoleText: '葬儀費用や当面の生活費、ローン返済などに充てられます。年金タイプと組み合わせると、より柔軟な備えが可能です。',
    getIndividualPremiumApproximation: (value) => Math.max(500, Math.round(value * 0.03 * 100))
  },
  '死亡年金': {
    iconClass: 'fa-solid fa-hourglass-half',
    description: '万が一の時、のこされたご家族に毎月または毎年一定額の年金をお支払いし、長期的な生活をサポートします。',
    tips: '一時金と組み合わせることで、より手厚い保障を準備できます。',
    necessityText: '遺された家族の毎月の生活費を安定的に確保するための保障です。',
    rationaleTextGeneralHtml: `
      <ul class="custom-list">
        <li><i class="fas fa-chart-line"></i>毎月の必要生活費</li>
        <li><i class="fas fa-minus-circle"></i>遺族年金・配偶者収入等</li>
        <li><i class="fas fa-equals"></i>不足額 (→ これを年金でカバー)</li>
      </ul>
    `,
    annuityLumpsumRoleText: '死亡一時金が当面の大きな出費に対応するのに対し、死亡年金は長期的な収入確保を目的とします。',
    getIndividualPremiumApproximation: (value) => Math.max(300, Math.round(value * 1.5 * 100))
  },
  '就業不能一時金': {
    iconClass: 'fa-solid fa-user-shield',
    description: '病気やケガで長期間働けなくなった場合に、まとまった一時金をお支払いします。',
    tips: '住宅ローン等の固定費が大きい方は特に検討をおすすめします。',
    necessityText: '長期間収入が途絶えた場合の経済的困難（治療費、生活費減）を乗り越えるための一時金です。',
    rationaleTextGeneralHtml: `
      <ul class="custom-list">
        <li><i class="fas fa-file-invoice-dollar"></i>当面の生活費 (3ヶ月～1年分)</li>
        <li><i class="fas fa-home"></i>住宅ローンボーナス返済分</li>
        <li><i class="fas fa-hospital"></i>医療費自己負担・療養環境整備費</li>
      </ul>
    `,
    annuityLumpsumRoleText: '療養開始直後の大きな出費や、収入回復までのつなぎ資金として役立ちます。月額給付型との組み合わせが理想的です。',
    getIndividualPremiumApproximation: (value) => Math.max(400, Math.round(value * 0.025 * 100))
  },
  '就業不能月額': {
    iconClass: 'fa-solid fa-calendar-check',
    description: '病気やケガで働けない間の収入減少を補うため、毎月一定額をお支払いします。',
    tips: '公的保障（傷病手当金など）で不足する分を補う形で考えましょう。',
    necessityText: '長期間の収入減をカバーし、安定した生活を維持するための保障です。特に働き盛りの方に重要。',
    rationaleTextGeneralHtml: `
      <ul class="custom-list">
        <li><i class="fas fa-wallet"></i>毎月の手取り収入</li>
        <li><i class="fas fa-landmark"></i>公的給付 (傷病手当金等)</li>
        <li><i class="fas fa-equals"></i>不足額 (→ これを月額給付でカバー)</li>
      </ul>
    `,
    annuityLumpsumRoleText: '毎月の生活費を直接補填します。一時金タイプと組み合わせることで、初期費用と継続的生活費の両方に備えられます。',
    getIndividualPremiumApproximation: (value) => Math.max(250, Math.round(value * 2.0 * 100))
  },
  '入院日額': {
    iconClass: 'fa-solid fa-briefcase-medical',
    description: '病気やケガによる入院時の諸費用（自己負担医療費、差額ベッド代等）をカバーします。',
    tips: '短期入院や女性特有疾病に手厚いタイプも検討しましょう。',
    necessityText: '入院時の直接治療費以外の諸経費（差額ベッド代、食事代、交通費等）に備える基本保障です。',
    rationaleTextGeneralHtml: `
      <p class="text-xs"><i class="fas fa-bed mr-1"></i>差額ベッド代の平均額や、<i class="fas fa-shopping-cart mr-1"></i>入院中の雑費などを考慮し、5,000円～15,000円/日で設定するのが一般的です。</p>
    `,
    getIndividualPremiumApproximation: (value) => Math.max(100, Math.round(value * 0.2))
  },
  '手術一時金': {
    iconClass: 'fa-solid fa-band-aid',
    description: '入院中または外来での手術を受けた際に、手術の種類に応じて一時金をお支払いします。',
    tips: '入院給付金とセットで備えると、手術費用への備えがより手厚くなります。',
    necessityText: '手術には高額な費用がかかる場合があり、その経済的負担を軽減します。入院給付金と合わせて検討しましょう。',
    rationaleTextGeneralHtml: `
      <p class="text-xs"><i class="fas fa-stethoscope mr-1"></i>手術の種類（入院/外来）や内容で給付倍率が異なるのが一般的です。</p>
    `,
    getIndividualPremiumApproximation: (value) => Math.max(200, Math.round(value * 0.05 * 100))
  },
  'がん一時金': {
    iconClass: 'fa-solid fa-disease',
    description: 'がんと診断された際にまとまった一時金をお支払いし、治療費や当面の生活費に充てることができます。',
    tips: '複数回支払われるタイプや、先進医療特約を付加できるタイプも検討しましょう。',
    necessityText: 'がん治療は長期化しやすく、高額な治療法を選択する可能性も。診断時の一時金は治療専念に繋がります。',
    rationaleTextGeneralHtml: `
      <p class="text-xs"><i class="fas fa-pills mr-1"></i>治療費の平均、<i class="fas fa-chart-line mr-1"></i>収入減少期間の生活費などを考慮し、100万円～300万円程度で設定する方が多いです。</p>
    `,
    getIndividualPremiumApproximation: (value) => Math.max(300, Math.round(value * 0.04 * 100))
  },
  'じぶんの積立': {
    iconClass: 'fa-solid fa-piggy-bank',
    description: '将来のための資金（教育資金、老後資金など）を計画的に準備するための積立タイプの保険です。',
    tips: '目標額や積立期間に合わせて、無理のない保険料設定を心がけましょう。他の投資商品とのバランスも考慮すると良いでしょう。',
    necessityText: 'お子様の教育資金やご自身の老後資金など、将来必要となるまとまった資金を計画的に準備するために役立ちます。',
    rationaleTextGeneral: '目標とする金額から逆算し、積立期間と予定利率を考慮して毎月の積立額を設定します。インフレリスクも考慮に入れるとより安心です。',
    relatedRidersText: '個人年金保険料税制適格特約などを付加することで、税制上のメリットを受けられる場合があります。',
    getIndividualPremiumApproximation: (value) => Math.max(0, Math.round(value * 0.95))
  },
  '循環器等一時金': {
    iconClass: 'fa-solid fa-heart-crack',
    description: '心筋梗塞や脳卒中など、重篤な循環器疾患と診断された際に一時金をお支払いします。',
    tips: 'がん保障と同様に重要。三大疾病保障としてセットで提供されることも多いです。',
    necessityText: '循環器疾患は突然発症し、長期療養やリハビリが必要になることも。経済的負担を軽減します。',
    rationaleTextGeneralHtml: `
      <p class="text-xs"><i class="fas fa-procedures mr-1"></i>治療費、<i class="fas fa-running mr-1"></i>リハビリ費用、<i class="fas fa-money-bill-wave mr-1"></i>収入減少などを考慮し、がん一時金と同程度かやや抑えた金額で設定します。</p>
    `,
    getIndividualPremiumApproximation: (value) => Math.max(280, Math.round(value * 0.035 * 100))
  },
  '積立額': {
    iconClass: 'fa-solid fa-piggy-bank',
    description: '将来のための資金（教育資金、老後資金など）を計画的に準備するための積立です。',
    tips: '目標額や期間に合わせ、無理のない保険料設定を。他の投資商品とのバランスも考慮しましょう。',
    necessityText: 'お子様の教育資金やご自身の老後資金など、将来必要となるまとまった資金を計画的に準備します。',
    rationaleTextGeneralHtml: `
      <p class="text-xs"><i class="fas fa-calculator mr-1"></i>目標額から逆算し、積立期間と予定利率を考慮して毎月の積立額を設定します。インフレリスクも考慮に入れるとより安心です。</p>
    `,
    getIndividualPremiumApproximation: (value) => Math.max(0, Math.round(value * 0.95))
  },
  '入院治療費補填': {
    iconClass: 'fa-solid fa-receipt',
    description: '入院中の治療にかかる実費（保険診療の自己負担分）を補填します。',
    tips: '高額療養費制度との関連も確認しましょう。',
    necessityText: '実際の治療費の自己負担分をカバーし、安心して治療に専念できるようにします。',
    rationaleTextGeneralHtml: '<p class="text-xs"><i class="fas fa-shield-alt mr-1"></i>実費補填なので、自己負担した分が支払われます。</p>',
    isOnOffType: true
  },
  '退院後通院補填': {
    iconClass: 'fa-solid fa-person-walking-arrow-right',
    description: '退院後の通院治療にかかる実費（保険診療の自己負担分）を補填します。',
    tips: '通院が長期化するケースに備えられます。',
    necessityText: '退院後の継続的な通院治療の経済的負担を軽減します。',
    rationaleTextGeneralHtml: '<p class="text-xs"><i class="fas fa-notes-medical mr-1"></i>実費補填で、通院費用をサポートします。</p>',
    isOnOffType: true
  },
  '先進医療保障': {
    iconClass: 'fa-solid fa-star-of-life',
    description: '先進医療にかかる高額な技術料実費を保障します。',
    tips: '少額の保険料で大きな安心を得られる場合があります。',
    necessityText: '高額な先進医療を受ける際の経済的バリアをなくし、治療の選択肢を広げます。',
    rationaleTextGeneralHtml: '<p class="text-xs"><i class="fas fa-microscope mr-1"></i>先進医療の技術料は公的医療保険の対象外。この保障で備えられます。</p>',
    isOnOffType: true
  },
  default: {
    iconClass: 'fa-solid fa-shield-halved',
    description: 'お客さまの生活をサポートするための保障です。',
    tips: 'より詳しい情報や、ご自身に合ったプランについては、お気軽にご相談ください。',
    necessityText: 'この保障は、お客さまのライフプランにおける様々なリスクに備えるための一つの選択肢です。',
    rationaleTextGeneralHtml: '<p class="text-xs"><i class="fas fa-users-cog mr-1"></i>お客さまの状況に合わせて最適な保障を決定することが重要です。</p>',
    getIndividualPremiumApproximation: (value) => 0
  }
};

export const useAiConcierge = (initialMessage = '') => {
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState(initialMessage);
  const [currentGuide, setCurrentGuide] = useState(null);

  const toggleAiConcierge = useCallback(() => {
    setIsAiConciergeOpen(prev => !prev);
  }, []);

  const handleCloseAiConcierge = useCallback(() => {
    setIsAiConciergeOpen(false);
  }, []);

  const updateAiMessage = useCallback((newMessage) => {
    setAiMessage(newMessage);
    if (newMessage) {
        setIsAiConciergeOpen(true);
    }
  }, []);

  const showOtherContractGuide = useCallback(() => {
    updateAiMessage(otherContractGuideHtml);
  }, [updateAiMessage]);

  const showCoverageDetailGuide = useCallback((item) => {
    const details = coverageItemDetails[item.label] || coverageItemDetails.default;
    const templateData = {
      itemName: item.label,
      itemValueString: item.value > 0 ? `${item.value.toLocaleString()}${item.unit || ''}` : null,
      iconClass: details.iconClass,
      itemDescription: details.description,
      itemTips: details.tips
    };
    updateAiMessage(simpleTemplateRender(coverageDetailGuideHtmlTemplate, templateData));
  }, [updateAiMessage]);

  const showRichBenefitDetailGuide = useCallback((benefitInfo, planData, currentPlanContext, currentPlanName) => {
    const itemLabel = benefitInfo?.label || '不明な保障';
    const itemValue = benefitInfo?.value;
    const itemUnit = benefitInfo?.unit || '';
    const itemKey = benefitInfo?.key || '';

    const details = coverageItemDetails[itemLabel] || coverageItemDetails.default;

    let currentValueString = 'N/A';
    if (typeof itemValue === 'number') {
      currentValueString = `${itemValue.toLocaleString()}${itemUnit}`;
    } else if (typeof itemValue === 'string') {
      currentValueString = itemValue;
    }

    let amountOptionsHTML = '';
    const currentValueNumeric = typeof itemValue === 'number' ? itemValue : 0;
    const showAmountAdjustment = !details.isOnOffType;

    if (showAmountAdjustment) {
        const adjustmentSteps = {
            '死亡一時金': { stepValue: 2000000, numSteps: 2, unit: '万円' },
            '就業不能一時金': { stepValue: 2000000, numSteps: 2, unit: '万円' },
            '死亡年金': { stepValue: 25000, numSteps: 2, unit: '万円' },
            '就業不能月額': { stepValue: 25000, numSteps: 2, unit: '万円' },
            '入院日額': { stepValue: 1000, numSteps: 2, unit: '円' },
            'がん一時金': { stepValue: 500000, numSteps: 2, unit: '万円' },
            '循環器等一時金': { stepValue: 500000, numSteps: 2, unit: '万円' },
            '手術一時金': { stepValue: 50000, numSteps: 2, unit: '万円' },
            '積立額': { stepValue: 10000, numSteps: 2, unit: '円' }
        };

        const config = adjustmentSteps[itemLabel] || {
            stepValue: (itemUnit === '円' ? 1000 : (itemUnit === '万円' && (itemLabel.includes('年金') || itemLabel.includes('月額')) ? 10000 : 500000)),
            numSteps: 2,
            unit: itemUnit
        };

        for (let i = -config.numSteps; i <= config.numSteps; i++) {
            let optionValue = currentValueNumeric + (i * config.stepValue);
            if (itemUnit === '万円' && !(itemLabel.includes('年金') || itemLabel.includes('月額'))) {
                 optionValue = currentValueNumeric + (i * config.stepValue / 10000);
            }
            optionValue = Math.max(0, optionValue);
            if (config.unit === '円') {
                optionValue = Math.round(optionValue / 1000) * 1000;
            }
            if (config.unit === '万円' && (itemLabel.includes('年金') || itemLabel.includes('月額'))) {
                optionValue = Math.round(optionValue / 0.5) * 0.5;
            }
            if (config.unit === '万円' && !(itemLabel.includes('年金') || itemLabel.includes('月額'))) {
                 optionValue = Math.round(optionValue / 10) * 10;
            }

            if (itemLabel === '死亡一時金' || itemLabel === '就業不能一時金') {
                optionValue = currentValueNumeric + (i * config.stepValue / 10000);
                optionValue = Math.max(0, Math.round(optionValue / 10) * 10);
            }
            if (itemLabel === '死亡年金' || itemLabel === '就業不能月額') {
                optionValue = currentValueNumeric + (i * config.stepValue / 10000);
                optionValue = Math.max(0, Math.round(optionValue * 2) / 2);
            }

            let displayValue = `${optionValue.toLocaleString()}${config.unit}`;
            if (i === 0) displayValue += ' (現在値)';

            const estimatedOptionPremium = details.getIndividualPremiumApproximation ? details.getIndividualPremiumApproximation(optionValue * (config.unit === '万円' && !itemLabel.includes('年金') && !itemLabel.includes('月額') ? 10000 : 1)) : 0;
            amountOptionsHTML += `
              <div>
                <input type="radio" id="amount_opt_adj_${i}" name="amount_option_adj" value="${optionValue}" ${i === 0 ? 'checked' : ''}>
                <label for="amount_opt_adj_${i}">
                  <span class="option-value">${displayValue}</span>
                  <span class="option-premium">月額目安: ${estimatedOptionPremium.toLocaleString()}円</span>
                </label>
              </div>
            `;
        }
    }

    let rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-user-check mr-1"></i>お客さまのニーズとご予算全体のバランスを考慮して設定されています。</p>`;
    if (currentPlanName === '推奨プラン') {
      rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-balance-scale-right mr-1"></i>「推奨プラン」では、<strong class="text-emerald-600">${itemLabel}</strong>について標準的な必要額を満たしつつ、全体の保険料負担を抑えるバランスを重視しています。</p>`;
    } else if (currentPlanName === 'プレミアプラン') {
      rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-shield-alt mr-1"></i>「プレミアプラン」では、<strong class="text-emerald-600">${itemLabel}</strong>を手厚く確保し、万全の備えを目指しています。将来の安心感を最優先する方向けです。</p>`;
    } else if (currentPlanName === '医療重視プラン') {
      if (itemKey.toLowerCase().includes('medical') || itemKey.toLowerCase().includes('cancer') || itemKey.toLowerCase().includes('circulatory') || itemLabel.includes('医療') || itemLabel.includes('がん') || itemLabel.includes('循環器')) {
        rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-stethoscope mr-1"></i>「医療重視プラン」では、<strong class="text-emerald-600">${itemLabel}</strong>をしっかり確保し、病気やケガへの備えを強化しています。</p>`;
      } else {
        rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-notes-medical mr-1"></i>「医療重視プラン」では、医療関連を手厚くするため、<strong class="text-emerald-600">${itemLabel}</strong>は基本的な水準に抑えています。</p>`;
      }
    } else if (currentPlanName === '生活保障重視プラン') {
      if (itemKey.toLowerCase().includes('death') || itemKey.toLowerCase().includes('disability') || itemLabel.includes('死亡') || itemLabel.includes('就業')) {
        rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-home mr-1"></i>「生活保障重視プラン」では、<strong class="text-emerald-600">${itemLabel}</strong>を優先的に確保し、万一の際の生活基盤を守ることを重視しています。</p>`;
      } else {
        rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-heartbeat mr-1"></i>「生活保障重視プラン」では、生活保障を最優先とするため、<strong class="text-emerald-600">${itemLabel}</strong>は基本的な水準に留めています。</p>`;
      }
    } else if (currentPlanName === 'カスタムプラン') {
         rationaleTextPlanSpecificHtml = `<p class="text-xs"><i class="fas fa-sliders-h mr-1"></i>「カスタムプラン」では、お客さまが調整された<strong class="text-emerald-600">${itemLabel}</strong>の設定が反映されています。</p>`;
    }

    const templateData = {
      benefitName: itemLabel,
      benefitIconClass: details.iconClass,
      currentPlanName: currentPlanName || '現在のプラン',
      currentValueString: currentValueString,
      currentSubValueString: benefitInfo.subValueString || null,
      necessityText: details.necessityText || '個別の状況に応じて専門家にご相談ください。',
      rationaleTextGeneralHtml: details.rationaleTextGeneralHtml || '<p class="text-xs">専門家にご相談ください。</p>',
      rationaleTextPlanSpecificHtml: rationaleTextPlanSpecificHtml,
      annuityLumpsumRoleText: details.annuityLumpsumRoleText || null,
      showAmountAdjustmentSection: showAmountAdjustment,
      amountOptionsHTML: amountOptionsHTML,
      individualPremiumString: details.getIndividualPremiumApproximation ? details.getIndividualPremiumApproximation(currentValueNumeric * (itemUnit === '万円' && !itemLabel.includes('年金') && !itemLabel.includes('月額') ? 10000 : 1)).toLocaleString() : '-'
    };

    updateAiMessage(simpleTemplateRender(richBenefitDetailGuideHtmlTemplate, templateData));
  }, [updateAiMessage]);

  return {
    isAiConciergeOpen,
    aiMessage,
    toggleAiConcierge,
    handleCloseAiConcierge,
    updateAiMessage,
    showOtherContractGuide,
    showCoverageDetailGuide,
    showRichBenefitDetailGuide
  };
}; 