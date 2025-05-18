import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
// Font Awesome アイコンを使用する場合 (プロジェクト設定が必要)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBirthdayCake, faUsers, faCalendarAlt, faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';
// import pentanIcon from './pentan.png'; // アイコンパス (publicフォルダ等に配置)

/**
 * CustomerHeader コンポーネント
 * 顧客情報とAIコンシェルジュを開くボタンを表示します。（改善版）
 *
 * @param {object} props - コンポーネントのプロパティ
 * @param {object} props.customerProfile - 顧客のプロファイル情報を含むオブジェクト
 * @param {string} props.customerProfile.name - 顧客名
 * @param {number} props.customerProfile.age - 年齢
 * @param {string} props.customerProfile.family - 家族構成
 * @param {string} props.customerProfile.lastUpdate - 最終更新日
 * @param {function} props.onToggleAiConcierge - AIコンシェルジュを開閉するボタンのクリックハンドラ
 * @param {function} props.onShowProfileEditor - プロフィール編集画面をAIコンシェルジュに表示するハンドラ
 * @param {function} props.onShowNotifications - 通知画面をAIコンシェルジュに表示するハンドラ
 * @param {number} props.notificationCount - 未読の通知件数 (New)
 */
function CustomerHeader({ customerProfile, onToggleAiConcierge, onShowProfileEditor, onShowNotifications, notificationCount }) {
  const profile = customerProfile || {};
  const name = profile.name || 'お客さま';
  const age = profile.age || 'N/A';
  const family = profile.family || 'N/A';
  const lastUpdate = profile.lastUpdate || 'N/A';

  const headerRef = useRef(null); // ヘッダー全体のアニメーション用
  const welcomeMessageRef = useRef(null);
  const customerNameRef = useRef(null);
  const notificationIconRef = useRef(null);
  const ageRef = useRef(null); // 年齢表示のアニメーション用
  const familyRef = useRef(null); // 家族構成表示のアニメーション用
  const lastUpdateRef = useRef(null); // 最終更新日表示のアニメーション用

  useEffect(() => {
    const headerEl = headerRef.current;
    const welcomeEl = welcomeMessageRef.current;
    const nameEl = customerNameRef.current;
    const ageEl = ageRef.current;
    const familyEl = familyRef.current;
    const lastUpdateEl = lastUpdateRef.current;

    if (headerEl) {
      // ヘッダー全体の初期表示アニメーション
      gsap.fromTo(headerEl,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
    }

    // 歓迎メッセージ (GSAP TextPlugin がない場合は単純な表示遅延)
    if (welcomeEl) {
      const welcomeText = "ようこそ、";
      gsap.set(welcomeEl, { opacity: 0 });
      gsap.to(welcomeEl, {
        duration: 0.5, // 少し時間をかけて表示
        opacity: 1,
        delay: 0.8, // ヘッダー表示後
        onStart: () => { welcomeEl.textContent = welcomeText; } // アニメーション開始時にテキスト設定
      });
    }

    // 顧客名 (GSAP TextPlugin がない場合は1文字ずつのアニメーションは困難なため、遅延表示)
    if (nameEl && name) {
        gsap.set(nameEl, { opacity: 0 });
        gsap.to(nameEl, {
            duration: 0.5,
            opacity: 1,
            delay: 1.1, // 歓迎メッセージ後
            onStart: () => { nameEl.textContent = name; } // 表示時に名前をセット
        });
    }
    
    // 年齢、家族構成、最終更新日のアイコンとテキストにアニメーション
    const infoElements = [ageEl, familyEl, lastUpdateEl].filter(el => el !== null);
    if (infoElements.length > 0) {
        gsap.fromTo(infoElements,
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, delay: 1.4, ease: "power2.out" }
        );
    }

  }, [name]); // name が変更された場合にも顧客名アニメーションが再トリガーされるように

  useEffect(() => {
    const icon = notificationIconRef.current;
    if (icon) {
      if (notificationCount > 0) {
        gsap.killTweensOf(icon);
        gsap.to(icon, {
          scale: 1.25, // 少し大きく
          opacity: 0.6,
          repeat: -1,
          yoyo: true,
          duration: 0.7, // 少し速く
          ease: "power1.inOut"
        });
      } else {
        gsap.killTweensOf(icon);
        gsap.to(icon, { scale: 1, opacity: 1, duration: 0.3 });
      }
    }
    return () => {
      if (icon) {
        gsap.killTweensOf(icon);
      }
    };
  }, [notificationCount]);

  const handleProfileClick = () => {
      if (onShowProfileEditor) {
          onShowProfileEditor();
      }
  };

  const handleNotificationClick = () => {
      if (onShowNotifications) {
          onShowNotifications();
      }
  };

  return (
    <header ref={headerRef} className="bg-emerald-600 text-emerald-50 p-3 px-4 rounded-t-lg flex justify-between items-center shadow-xl flex-wrap gap-y-3 border-b-4 border-emerald-400 opacity-0"> {/* 初期 opacity:0 */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
        <i
          className="fas fa-user-circle text-3xl text-emerald-100 hover:text-white cursor-pointer transition-colors duration-200 transform hover:scale-110"
          title="プロフィール設定"
          onClick={handleProfileClick}
        ></i>
        <div className="flex items-baseline">
          <span ref={welcomeMessageRef} className="text-xl md:text-2xl font-semibold opacity-0"></span>
          {/* 顧客名はuseEffect内で設定される */}
          <h1 ref={customerNameRef} className="text-xl md:text-2xl font-bold flex-shrink-0 m-0 ml-1 opacity-0"></h1>
          <span className="text-xl md:text-2xl font-semibold ml-1">さん</span>
        </div>
        {/* 年齢・家族構成・更新日 (デザイン調整とref追加) */}
        <div className="flex items-center gap-x-5 text-sm md:text-base text-emerald-100 whitespace-nowrap mt-1 md:mt-0">
          <span ref={ageRef} title={`${age}歳`} className="flex items-center opacity-0">
            <i className="fas fa-birthday-cake mr-1.5 text-yellow-300 text-lg"></i>
            <span className="font-medium">{age}歳</span>
          </span>
          <span ref={familyRef} title={family} className="flex items-center opacity-0">
            <i className="fas fa-users mr-1.5 text-sky-300 text-lg"></i>
            <span className="font-medium">{family}</span>
          </span>
          <span ref={lastUpdateRef} title={`最終更新: ${lastUpdate}`} className="flex items-center text-emerald-200 opacity-0">
            <i className="fas fa-history mr-1.5 text-purple-300 text-lg"></i> {/* アイコン変更 */}
            <span className="font-medium text-xs">{lastUpdate}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-4"> {/* gap調整 */}
          <button
            title="お知らせ"
            className="relative text-emerald-100 hover:text-white focus:outline-none transition-colors duration-200 transform hover:scale-110" // hoverエフェクト追加
            onClick={handleNotificationClick}
            ref={notificationIconRef}
          >
              <i className="fas fa-bell text-xl"></i> {/* サイズ調整 */}
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex justify-center items-center h-5 w-5 rounded-full bg-pink-500 text-white text-[11px] font-bold ring-2 ring-emerald-500 shadow-md"> {/*デザイン調整*/}
                  {notificationCount}
                </span>
              )}
          </button>

          <button
            id="open-ai-concierge"
            onClick={onToggleAiConcierge}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-900 font-bold py-1.5 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-2 text-sm md:text-base flex items-center flex-shrink-0 border-2 border-amber-500 hover:border-amber-400" // デザイン調整
            title="ペンタンに質問してみる"
          >
            <img src="/pentan.png" alt="ペンタン" className="h-6 w-auto mr-2 drop-shadow-sm" /> {/* サイズとドロップシャドウ */}
            <span className="tracking-wide">聞いてみる</span>
          </button>
      </div>
    </header>
  );
}

export default CustomerHeader;

