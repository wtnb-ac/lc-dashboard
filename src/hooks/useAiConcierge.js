import { useState, useCallback } from 'react';
import { otherContractGuideHtml, coverageDetailGuideHtmlTemplate } from '../constants/aiContent'; // 新しいHTMLをインポート

// テンプレートエンジン的な簡易置換関数
const simpleTemplateRender = (template, data) => {
  let rendered = template;
  for (const key in data) {
    const regex = new RegExp(`{{\s*#if ${key}\s*}}([\s\S]*?){{\s*\/${key}\s*}}`, 'g');
    rendered = rendered.replace(regex, (match, p1) => data[key] ? p1 : '');
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
  }
  // 残りの {{#if ...}} ... {{/if}} ブロックを空文字で除去 (該当キーがデータにない場合)
  rendered = rendered.replace(/{{\s*#if \w+\s*}}([\s\S]*?){{\s*\/\w+\s*}}/g, '');
  return rendered;
};

// 各保障アイテムの補足情報 (アイコンクラス、説明、アドバイス)
const coverageItemDetails = {
  '死亡保険': {
    iconClass: 'fa-solid fa-umbrella',
    description: '万が一の時、のこされたご家族の生活費やお子様の教育費など、経済的な負担を軽減するための大切な備えです。',
    tips: 'ライフステージの変化（結婚、出産、住宅購入など）に合わせて保障額を見直すことが重要です。'
  },
  '死亡年金': {
    iconClass: 'fa-solid fa-hourglass-half',
    description: '万が一の時、のこされたご家族に毎月または毎年一定額の年金をお支払いし、長期的な生活をサポートします。',
    tips: '一時金と組み合わせることで、より手厚い保障を準備できます。'
  },
  '就業不能一時金': {
    iconClass: 'fa-solid fa-user-shield',
    description: '病気やケガで長期間働けなくなった場合に、まとまった一時金をお支払いし、当面の生活費や治療費をカバーします。',
    tips: '住宅ローンや教育費など、固定費の大きい方は特に検討をおすすめします。'
  },
  '就業不能月額': {
    iconClass: 'fa-solid fa-calendar-check',
    description: '病気やケガで働けない間の収入減少を補うため、毎月一定額をお支払いします。',
    tips: '公的保障（傷病手当金など）で不足する分を補う形で考えると効果的です。'
  },
  '入院日額': {
    iconClass: 'fa-solid fa-briefcase-medical',
    description: '病気やケガによる入院時の医療費自己負担分や差額ベッド代、諸雑費などをカバーするため、入院1日あたりで給付金をお支払いします。',
    tips: '短期入院にも対応できるタイプや、女性特有の疾病に手厚いタイプなど、ニーズに合わせて選びましょう。'
  },
  '手術一時金': {
    iconClass: 'fa-solid fa-band-aid',
    description: '入院中または外来での手術を受けた際に、手術の種類に応じて一時金をお支払いします。',
    tips: '入院給付金とセットで備えることで、手術費用への備えがより手厚くなります。'
  },
  'がん一時金': {
    iconClass: 'fa-solid fa-heart-pulse', // FontAwesome 6 Freeのアイコンに合わせる
    description: 'がんと診断された際にまとまった一時金をお支払いし、治療費や当面の生活費に充てることができます。',
    tips: '複数回支払われるタイプや、先進医療特約を付加できるタイプも検討しましょう。'
  },
  'じぶんの積立': {
    iconClass: 'fa-solid fa-piggy-bank',
    description: '将来のための資金（教育資金、老後資金など）を計画的に準備するための積立タイプの保険です。',
    tips: '目標額や積立期間に合わせて、無理のない保険料設定を心がけましょう。'
  },
  // 他の保障項目も同様に追加可能
  default: {
    iconClass: 'fa-solid fa-shield-halved',
    description: 'お客さまの生活をサポートするための保障です。',
    tips: 'より詳しい情報や、ご自身に合ったプランについては、お気軽にご相談ください。'
  }
};

export const useAiConcierge = (initialMessage = '') => {
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState(initialMessage);

  const toggleAiConcierge = useCallback(() => {
    setIsAiConciergeOpen(prev => !prev);
  }, []);

  const handleCloseAiConcierge = useCallback(() => {
    setIsAiConciergeOpen(false);
  }, []);

  const updateAiMessage = useCallback((newMessage) => {
    setAiMessage(newMessage);
    if (newMessage) { // メッセージが空でない場合のみ開く
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

  return {
    isAiConciergeOpen,
    aiMessage,
    toggleAiConcierge,
    handleCloseAiConcierge,
    updateAiMessage,
    showOtherContractGuide, // 新しいハンドラをエクスポート
    showCoverageDetailGuide, // 新しいハンドラをエクスポート
  };
}; 