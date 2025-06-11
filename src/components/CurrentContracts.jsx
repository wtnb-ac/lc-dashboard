import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// Font Awesome アイコンを使用する場合 (プロジェクト設定が必要)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBuilding, faUniversity, faFileContract } from '@fortawesome/free-solid-svg-icons';

// Helper function to get icon class based on label
const getIconForLabel = (label) => {
  if (label.includes('死亡')) return 'fas fa-umbrella text-indigo-500';
  if (label.includes('就業不能')) return 'fas fa-user-shield text-red-500';
  if (label.includes('入院') || label.includes('医療')) return 'fas fa-briefcase-medical text-sky-500';
  if (label.includes('手術')) return 'fas fa-band-aid text-teal-500';
  if (label.includes('がん') || label.includes('重病') || label.includes('循環器')) return 'fas fa-heart-pulse text-pink-500';
  if (label.includes('積立') || label.includes('貯蓄')) return 'fas fa-piggy-bank text-amber-500';
  return 'fas fa-file-signature text-gray-400'; // Default icon
};

// 新しい ListItem コンポーネント
const ListItem = ({ item, onConditionWarningClick, isMounted, onShowCoverageItemGuide }) => {
  const { key, label, value, unit = '', condition = '', tag = '' } = item;
  const iconClass = getIconForLabel(label);
  const itemRef = useRef(null);
  const warningIconRef = useRef(null);

  useEffect(() => {
    if (itemRef.current && isMounted) {
      gsap.fromTo(itemRef.current, 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: Math.random() * 0.3 } // 個別にランダムな遅延
      );
    }
  }, [isMounted]); // isMounted が true になったら発火

  useEffect(() => {
    if (condition && warningIconRef.current && isMounted) {
        gsap.to(warningIconRef.current, {
            scale: 1.3,
            opacity: 0.7,
            repeat: -1,
            yoyo: true,
            duration: 0.9,
            ease: "power1.inOut",
            delay: 1 + Math.random() * 0.5 // 初期表示のアニメーション後に開始
        });
    }
    return () => {
        if (warningIconRef.current) gsap.killTweensOf(warningIconRef.current);
    }
  }, [condition, isMounted]);

  const handleClick = () => {
    if (onShowCoverageItemGuide) {
      onShowCoverageItemGuide(item);
    }
  };

  return (
    <li 
      ref={itemRef} 
      key={key} 
      className="opacity-0 flex items-center justify-between mb-2 p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50 transform hover:-translate-y-0.5 cursor-pointer"
      onClick={handleClick}
      title={`「${label}」の詳細を見る`}
    >
      <div className="flex-grow flex items-center">
        <i className={`${iconClass} w-6 h-6 text-xl flex items-center justify-center mr-3 p-1 rounded-md bg-opacity-10 ${iconClass.split(' ').find(c => c.startsWith('text-'))?.replace('text-', 'bg-') || 'bg-gray-100'}`}></i>
        <div className="flex-grow">
          {tag && <span className={`block text-xs text-gray-500 mb-0.5 px-1 py-0.5 bg-gray-100 rounded-full w-fit`}>{tag}</span>}
          <span className="text-sm font-medium text-gray-700">
            {label}：
            {condition && (
              <span className="text-xs text-red-600 ml-1.5 font-semibold inline-flex items-center">
                <i ref={warningIconRef} className="fas fa-exclamation-triangle text-yellow-500 mr-1 animate-pulse_slower"></i>
                要確認
                {condition === '(入院5日以上)' && (
                  <i
                    className="fas fa-info-circle text-blue-400 ml-1.5 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                       e.stopPropagation();
                       onConditionWarningClick && onConditionWarningClick({ label, condition });
                    }}
                    title="この条件に関する注意点を見る"
                  ></i>
                )}
              </span>
            )}
          </span>
        </div>
      </div>
      <span className="text-base font-bold text-emerald-600 ml-2 whitespace-nowrap">
        {value.toLocaleString()}{unit}
      </span>
    </li>
  );
};

// 新しい EmptyItem コンポーネント
const EmptyItem = ({ text, iconClass = 'fas fa-plus-circle text-green-500', onClick, isMounted }) => {
  const itemRef = useRef(null);
   useEffect(() => {
    if (itemRef.current && isMounted) {
      gsap.fromTo(itemRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.2 + Math.random() * 0.2 });
    }
  }, [isMounted]);

  return (
  <li ref={itemRef} 
    className={`opacity-0 flex items-center text-sm text-gray-600 italic mb-2 p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-green-50 hover:bg-green-100 transform hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : 'opacity-70'}`}
    onClick={onClick}
    title={onClick ? '詳細を登録する' : ''}
  >
    <i className={`${iconClass} w-6 text-xl mr-3 text-green-500 transition-transform duration-200 ease-in-out ${onClick ? 'group-hover:rotate-90' : ''}`}></i>
    {text}
  </li>
)};

// CurrentContracts コンポーネント: 現在の保険契約（自社および他社）を表示
function CurrentContracts({
  currentCoverageSelf,
  currentCoverageOther,
  onRegisterContract,
  onContractClick,
  onConditionWarningClick,
  onShowCoverageItemGuide
}) {
  const selfSectionRef = useRef(null);
  const otherSectionRef = useRef(null);
  const totalPremiumRef = useRef(null); // 合計保険料のref
  const selfPremiumRef = useRef(null); // 明治安田の保険料ref
  const otherPremiumRef = useRef(null); // 他社の保険料ref

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const refs = [selfSectionRef.current, otherSectionRef.current];
    const eventListeners = [];
    refs.forEach(sectionEl => {
      if (sectionEl) {
        const onMouseEnter = () => gsap.to(sectionEl, { y: -6, boxShadow: "0 12px 20px -5px rgba(0,0,0,0.12), 0 5px 8px -3px rgba(0,0,0,0.08)", duration: 0.25, ease: "power2.out" });
        const onMouseLeave = () => gsap.to(sectionEl, { y: 0, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", duration: 0.25, ease: "power2.inOut" });
        sectionEl.addEventListener('mouseenter', onMouseEnter);
        sectionEl.addEventListener('mouseleave', onMouseLeave);
        eventListeners.push({ element: sectionEl, type: 'mouseenter', listener: onMouseEnter });
        eventListeners.push({ element: sectionEl, type: 'mouseleave', listener: onMouseLeave });
      }
    });
    return () => {
      eventListeners.forEach(({ element, type, listener }) => element.removeEventListener(type, listener));
      refs.forEach(sectionEl => { if (sectionEl) gsap.killTweensOf(sectionEl); });
    };
  }, []);

  const self = currentCoverageSelf || {};
  const other = currentCoverageOther || {};
  const selfPremium = self.premium || 0;
  const otherPremium = other.premium || 0;
  const totalPremium = selfPremium + otherPremium;

  // 保険料カウントアップアニメーション
  useEffect(() => {
    if (!isMounted) return;
    const animatePremium = (targetRef, endValue) => {
      if (targetRef.current) {
        const target = { val: parseFloat(targetRef.current.textContent.replace(/[^0-9.-]+/g,"")) || 0 }; // 初期値を取得
        gsap.to(target, {
          val: endValue,
          duration: 1.2, 
          ease: 'power3.out',
          onUpdate: () => {
            targetRef.current.textContent = Math.round(target.val).toLocaleString();
          },
          delay: 0.3 // セクション表示後少し遅れて開始
        });
      }
    };
    animatePremium(selfPremiumRef, selfPremium);
    animatePremium(otherPremiumRef, otherPremium);
    animatePremium(totalPremiumRef, totalPremium);
  }, [selfPremium, otherPremium, totalPremium, isMounted]);

  const selfCoverageItems = [
    { key: 'self-deathLumpsum', label: '死亡保険', value: self.deathLumpsum || 0, unit: '万円' },
    { key: 'self-deathAnnuity', label: '死亡年金', value: self.deathAnnuity || 0, unit: '万円/月' },
    { key: 'self-disabilityLumpsum', label: '就業不能一時金', value: self.disabilityLumpsum || 0, unit: '万円' },
    { key: 'self-disabilityMonthly', label: '就業不能月額', value: self.disabilityMonthly || 0, unit: '万円/月' },
    { key: 'self-medicalDaily', label: '入院日額', value: self.medicalDaily || 0, unit: '円' },
    { key: 'self-medicalSurgery', label: '手術一時金', value: self.medicalSurgery || 0, unit: '万円' },
    { key: 'self-criticalCancer', label: 'がん一時金', value: self.criticalCancer || 0, unit: '万円' },
    { key: 'self-savingsMonthly', label: 'じぶんの積立', value: self.savingsMonthly || 0, unit: '円/月' },
  ].filter(item => item.value > 0);

  const otherCoverageItems = [
    { key: 'other-deathLumpsum', label: '死亡一時金', value: other.deathLumpsum || 0, unit: '万円', tag: '××生命' },
    { key: 'other-criticalCancer', label: 'がん一時金', value: other.criticalCancer || 0, unit: '万円', tag: '△△生命' },
    { key: 'other-medicalDaily', label: '入院日額', value: other.medicalDaily || 0, unit: '円', condition: '(入院5日以上)', tag: '△△生命' },
    { key: 'other-disabilityMonthly', label: '他社の就業不能', value: other.disabilityMonthly || 0, unit: '万円/月' },
    { key: 'other-savingsMonthly', label: '他社の積立', value: other.savingsMonthly || 0, unit: '円/月' },
  ].filter(item => item.value > 0);

  let selfItemsElements;
  if (selfCoverageItems.length === 0) {
    selfItemsElements = <EmptyItem text="ご契約情報がありません" iconClass="fas fa-folder-open text-gray-400" isMounted={isMounted} />;
  } else {
    selfItemsElements = selfCoverageItems.map(item => (
      <ListItem key={item.key} item={item} onConditionWarningClick={onConditionWarningClick} isMounted={isMounted} onShowCoverageItemGuide={onShowCoverageItemGuide} />
    ));
  }

  let otherItemsElements;
  if (otherCoverageItems.length === 0) {
    otherItemsElements = <EmptyItem text="他社契約を登録できます" iconClass="fas fa-plus-circle text-green-500" onClick={onRegisterContract} isMounted={isMounted} />;
  } else {
    otherItemsElements = otherCoverageItems.map(item => (
      <ListItem key={item.key} item={item} onConditionWarningClick={onConditionWarningClick} isMounted={isMounted} onShowCoverageItemGuide={onShowCoverageItemGuide} />
    ));
  }

  const handleSectionClick = (type) => {
    if (onContractClick) {
      onContractClick(type);
    }
  };

  return (
    <section className="current-status flex flex-col flex-grow bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-1 text-center flex items-center justify-center">
        <i className="fas fa-shield-alt mr-3 text-green-600"></i>
        ご加入中の保障内容
      </h2>

      <div id="current-contracts-list" className="flex-grow text-sm space-y-6">
        {/* --- Meiji Yasuda Contracts --- */}
        <div ref={selfSectionRef} className="contract-section bg-white border border-green-200 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:border-green-300">
          <h4 className="text-base font-bold text-emerald-700 bg-emerald-50 p-2.5 px-3 flex items-center justify-between border-b-2 border-emerald-200">
            <span className="flex items-center">
              <i className="fas fa-building-shield mr-2 text-emerald-600 text-xl"></i>
              <span className="tracking-wide">〇〇生命</span>
            </span>
            { (selfPremium > 0 || isMounted) && (
              <span className="text-xs font-semibold text-emerald-800 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm">
                月払: <span ref={selfPremiumRef} className="font-extrabold text-sm">{selfPremium > 0 ? selfPremium.toLocaleString() : '0'}</span>円
              </span>
            )}
          </h4>
          <ul className="list-none p-2.5 m-0 space-y-1">
            {selfItemsElements}
          </ul>
        </div>

        {/* --- Other Companies Contracts --- */}
        <div ref={otherSectionRef} className="contract-section bg-white border border-sky-200 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:border-sky-300">
          <h4 className="text-base font-bold text-slate-700 bg-slate-100 p-2.5 px-3 flex items-center justify-between border-b-2 border-slate-200">
            <span className="flex items-center">
              <i className="fas fa-landmark mr-2 text-slate-500 text-xl"></i>
              <span className="tracking-wide">他社保険</span>
            </span>
            { (otherPremium > 0 || isMounted) && (
              <span className="text-xs font-semibold text-slate-800 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm">
                月払: <span ref={otherPremiumRef} className="font-extrabold text-sm">{otherPremium > 0 ? otherPremium.toLocaleString() : '0'}</span>円
              </span>
            )}
          </h4>
          <ul className="list-none p-2.5 m-0 space-y-1">
            {otherItemsElements}
            <li className="mt-4 pt-3 border-t border-sky-200">
                <button
                    id="register-existing-contract"
                    onClick={onRegisterContract}
                    className="w-full group register-button text-base py-2 px-4 border-2 border-yellow-500 bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transform hover:scale-102"
                >
                   <i className="fas fa-pencil-alt mr-1 group-hover:rotate-[-10deg] transition-transform duration-200"></i> 他社の契約を追加 / 編集
                </button>
            </li>
          </ul>
        </div>
      </div>

      <div id="current-total-premium-display" className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 text-right">
        <span className="text-base text-gray-700 mr-2">現在の合計保険料:</span>
        <span ref={totalPremiumRef} className="text-2xl font-extrabold text-emerald-700">{totalPremium > 0 ? totalPremium.toLocaleString() : '0'}</span>
        <span className="text-base font-semibold text-gray-700 ml-1">円</span>
      </div>
    </section>
  );
}

export default CurrentContracts;

