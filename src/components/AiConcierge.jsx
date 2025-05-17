import React, { useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';
// import pentanIcon from './pentan.png'; // アイコンパス

// AiConcierge Component: Renders the AI assistant window
// AiConcierge コンポーネント: AIアシスタントウィンドウを描画します
function AiConcierge({ isOpen, onClose, messageContent, onNotificationCardClick, onBackToList }) {
  const messageAreaRef = useRef(null);

  // Scroll to bottom when message content changes and window is open
  // ウィンドウが開いていてメッセージ内容が変更されたときに最下部にスクロールします
  useEffect(() => {
    if (isOpen && messageAreaRef.current) {
      // Scroll to top when showing lists, otherwise scroll to bottom
      // Slight delay might be needed for DOM update after state change
      setTimeout(() => {
        if (messageContent && messageContent.includes('notification-card')) {
          messageAreaRef.current.scrollTop = 0;
        } else {
           messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
      }, 50); // 50ms delay as an example
    }
  }, [messageContent, isOpen]);

  // Return null if the window is not open
  // ウィンドウが開いていない場合は何もレンダリングしません
  if (!isOpen) {
    return null;
  }

  // Handle clicks on potential buttons/elements within the message area
  // メッセージエリア内の潜在的なボタン/要素のクリックを処理します
  const handleContentClick = (event) => {
    const target = event.target;

    // Find closest clickable parent if the direct target isn't it
    const notificationCard = target.closest('.notification-card');
    const backButton = target.closest('.back-to-notifications');
    const closeButton = target.closest('.close-concierge-button');
    const uploadButton = target.closest('.ai-upload-button');
    const submitButton = target.closest('.ai-submit-button');

    if (notificationCard && onNotificationCardClick) {
      const notificationId = notificationCard.getAttribute('data-notification-id');
      if (notificationId) {
        console.log('Notification card clicked:', notificationId);
        onNotificationCardClick(notificationId);
      }
    } else if (backButton && onBackToList) {
      console.log('Back to notifications clicked');
      onBackToList();
    } else if (closeButton && onClose) {
        console.log('Close button inside content clicked');
        onClose(); // Close the concierge
    } else if (uploadButton) {
        console.log('Upload button clicked inside AI Concierge');
        // Implement file upload logic or trigger file input
    } else if (submitButton) {
        console.log('Submit button clicked inside AI Concierge');
        const textarea = messageAreaRef.current?.querySelector('.ai-textarea');
        if (textarea) {
            console.log('Textarea value:', textarea.value);
            // Process the value...
        }
    } else {
      // Handle other potential clicks if needed
      // console.log('Clicked inside content area:', target);
    }
  };


  return (
    // AI Window Container - Apply fixed positioning and transition
    // AIウィンドウコンテナ - 固定配置とトランジションを適用
    <div
      id="ai-concierge-window"
      // Fixed positioning classes
      className={`fixed bottom-5 right-5 w-[380px] max-h-[calc(100vh-100px)] \
                  bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xl z-[1000] \
                  flex flex-col overflow-hidden transition-all duration-300 ease-in-out \
                  ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
      style={{ transformOrigin: 'bottom right' }} // Adjust transform origin for bottom-right scaling
    >
      {/* Header with Close Button */}
      {/* 閉じるボタン付きヘッダー */}
      <div className="ai-header flex justify-between items-center p-2.5 px-4 bg-green-800 text-white rounded-t-xl flex-shrink-0">
        <h2 className="m-0 text-base font-bold flex items-center gap-2">
          {/* <img src={pentanIcon} alt="ペンタン" className="pentan-icon header-icon h-5 w-auto" /> */}
          <img src="pentan.png" alt="ペンタン" className="pentan-icon header-icon h-5 w-auto" /> {/* 代替 */}
          サポート案内
        </h2>
        <button
          id="close-ai-window"
          onClick={onClose} // Use the passed onClose handler
          title="閉じる"
          className="bg-transparent border-none text-xl cursor-pointer text-gray-300 hover:text-white p-1 leading-none focus:outline-none"
        >
          {/* <FontAwesomeIcon icon={faXmark} /> */}
          <i className="fas fa-times"></i> {/* Alternative icon */}
        </button>
      </div>

      {/* Message Area */}
      {/* メッセージエリア */}
      <div
        id="ai-message-area"
        ref={messageAreaRef} // Ref for scrolling
        onClick={handleContentClick} // Delegate clicks within the content
        className="ai-message-area flex-grow p-3 pt-1.5 overflow-y-auto text-xs leading-snug text-gray-800"
        // Render HTML content safely
        // HTMLコンテンツを安全にレンダリング
        dangerouslySetInnerHTML={{ __html: messageContent || '<p>読み込み中...</p>' }}
      >
      </div>

       {/* Speech bubble tail (using pseudo-elements for simplicity) */}
       {/* 吹き出しのしっぽ（簡略化のため疑似要素を使用） */}
       {/* Note: Pseudo-elements need to be defined in a CSS file or using a library like styled-components */}
       {/* 注意: 疑似要素はCSSファイルで定義するか、styled-componentsのようなライブラリを使用する必要があります */}
       {/* <div className="ai-window-tail"></div> */}
       {/* Example CSS for tail (add to your global CSS or component-specific CSS):
           .ai-window::after {
               content: ''; position: absolute; bottom: -10px; left: 30px; width: 0; height: 0;
               border: 10px solid transparent; border-top-color: var(--ai-window-bg, #e6ffed); border-bottom: 0;
               filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
           }
           .ai-window::before {
               content: ''; position: absolute; bottom: -12px; left: 28px; width: 0; height: 0;
               border: 12px solid transparent; border-top-color: var(--ai-border-color, #a3d9a5); border-bottom: 0; z-index: -1;
           }
       */}
    </div>
  );
}

export default AiConcierge;
