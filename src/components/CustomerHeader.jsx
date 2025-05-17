import React from 'react';
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
  // customerProfile が未定義またはnullの場合のフォールバック
  const profile = customerProfile || {};
  const name = profile.name || 'お客さま'; // デフォルト名を変更
  const age = profile.age || 'N/A';
  const family = profile.family || 'N/A';
  const lastUpdate = profile.lastUpdate || 'N/A';

  const handleProfileClick = () => {
      if (onShowProfileEditor) {
          onShowProfileEditor(); // プロフィール編集ハンドラを呼び出す
      }
  };

  const handleNotificationClick = () => {
      if (onShowNotifications) {
          onShowNotifications(); // 通知表示ハンドラを呼び出す
      }
  };

  return (
    // Tailwind CSS を使用したヘッダースタイリング (パディング、高さを調整)
    <header className="bg-emerald-600 text-emerald-50 p-3 px-4 rounded-t-lg flex justify-between items-center shadow-md flex-wrap gap-y-2 border-b-4 border-emerald-400">
      {/* 顧客情報セクション (アイコン追加、フォントサイズ、レイアウト調整) */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        {/* プロフィールアイコン (onClickハンドラを追加) */}
        <i
          className="fas fa-user-circle text-2xl text-emerald-200 hover:text-white cursor-pointer transition-colors duration-200"
          title="プロフィール設定"
          onClick={handleProfileClick}
        ></i>
        {/* 顧客名 */}
        <h1 className="text-xl md:text-2xl font-semibold flex-shrink-0 m-0">{name} さん</h1>
        {/* 年齢・家族構成・更新日 (アイコン主体に変更) */}
        <div className="flex items-center gap-x-3 text-xs md:text-sm text-emerald-100 whitespace-nowrap">
          <span title={`${age}歳`}>
            <i className="fas fa-birthday-cake mr-1 text-amber-300"></i>
            <span id="customer-age" className="hidden sm:inline">{age}歳</span> {/* Small screen: hide text */}
          </span>
          <span title={family}>
            <i className="fas fa-users mr-1 text-amber-300"></i>
            <span id="customer-family" className="hidden sm:inline">{family}</span> {/* Small screen: hide text */}
          </span>
          <span title={`最終更新: ${lastUpdate}`} className="text-emerald-300">
            <i className="fas fa-calendar-alt mr-1"></i>
            <span id="customer-last-update" className="hidden md:inline">{lastUpdate}</span> {/* Medium screen: hide text */}
          </span>
        </div>
      </div>

      {/* 右側アクションボタンエリア */}
      <div className="flex items-center gap-x-3">
          {/* 通知アイコン (バッジとonClickハンドラを追加) */}
          <button
            title="お知らせ" 
            className="relative text-emerald-200 hover:text-white focus:outline-none transition-colors duration-200"
            onClick={handleNotificationClick} // onClickハンドラを追加
          >
              <i className="fas fa-bell text-lg"></i>
              {/* Notification Badge (Updated logic) */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex justify-center items-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold ring-1 ring-emerald-600">
                  {notificationCount} {/* Display the count from props */}
                </span>
              )}
          </button>

          {/* AIコンシェルジュを開くボタン */}
          <button
            id="open-ai-concierge"
            onClick={onToggleAiConcierge}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-900 font-bold py-1 px-3 md:px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-110 hover:rotate-3 text-sm md:text-base flex items-center flex-shrink-0" // Padding調整
            title="ペンタンに質問してみる"
          >
            <img src="/pentan.png" alt="ペンタン" className="h-5 w-auto mr-1.5 align-middle" />
            聞いてみる
          </button>
      </div>
    </header>
  );
}

// コンポーネントをデフォルトエクスポート
export default CustomerHeader;

