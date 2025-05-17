import React, { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarCheck, faBookOpen, faClipboardQuestion, faCalculator, faFilePrescription, faComments, faLightbulb, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Helper function to get Font Awesome icon class based on event ID
// イベントIDに基づいて Font Awesome アイコンクラスを取得するヘルパー関数
function getIconClassForEvent(eventId) {
  switch (parseInt(eventId)) {
    case 0: return 'fas fa-calendar-check'; // 定期訪問
    case 1: return 'fas fa-book-open';      // 既契約確認
    case 2: return 'fas fa-clipboard-question'; // 保障問診
    case 3: return 'fas fa-calculator';     // 保障額シミュレーション
    case 4: return 'fas fa-file-prescription';// 初回提案
    case 5: return 'fas fa-comments';       // 第2回提案とFB
    case 6: return 'fas fa-lightbulb';      // プラン検討中
    default: return 'fas fa-question-circle'; // デフォルト/不明
  }
}

// Timeline Component: Displays the customer interaction timeline
// Timeline コンポーネント: 顧客とのやり取りのタイムラインを表示します
function Timeline({ timelineEvents, activeEventId, onEventClick, eventDetailsContent }) {
  const containerRef = useRef(null);
  const [sortedEventIds, setSortedEventIds] = useState([]);

  // Sort event IDs numerically when timelineEvents changes
  // timelineEvents が変更されたときにイベントIDを数値でソートします
  useEffect(() => {
    if (timelineEvents) {
      const ids = Object.keys(timelineEvents)
        .map(Number) // Convert keys to numbers
        .sort((a, b) => a - b); // Sort numerically
      setSortedEventIds(ids);
    } else {
      setSortedEventIds([]);
    }
  }, [timelineEvents]);

  // Scroll the active event into view when activeEventId changes
  // activeEventId が変更されたときにアクティブなイベントが表示されるようにスクロールします
  useEffect(() => {
    if (activeEventId !== null && containerRef.current) {
      const activeElement = containerRef.current.querySelector(`.timeline-event[data-event-id="${activeEventId}"]`);
      if (activeElement) {
        // Calculate scroll position to center the active element if possible
        // 可能であればアクティブな要素を中央に配置するようにスクロール位置を計算します
        const containerWidth = containerRef.current.offsetWidth;
        const elementOffsetLeft = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        const scrollLeft = elementOffsetLeft - (containerWidth / 2) + (elementWidth / 2);

        containerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth' // Smooth scrolling
        });
      } else {
        // If active element not found (e.g., on initial load with an ID), scroll to start
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  }, [activeEventId, sortedEventIds]); // Add sortedEventIds dependency

  if (!timelineEvents || sortedEventIds.length === 0) {
    return <div className="p-4 text-center text-gray-500">タイムライン情報がありません。</div>;
  }

  return (
    // --- Styling: White Frame, Colorful Inside --- 
    <section className="timeline-log module bg-white border border-gray-200 rounded-lg p-4 shadow-md md:col-span-2 flex flex-col relative overflow-hidden">
      {/* Removed Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-32 h-32 bg-orange-100 rounded-full opacity-30 -translate-x-1/4 -translate-y-1/4 blur-xl"></div> */}
      {/* <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-100 rounded-full opacity-30 translate-x-1/4 translate-y-1/4 blur-xl"></div> */}

      {/* Title bar consistent with other modules */}
      <h2 className="text-xl font-bold text-green-800 mb-4 text-center border-b-2 border-green-800 pb-2 flex items-center justify-center z-10">
        <i className="fas fa-route mr-2 text-green-600"></i>
        未来へのステップ
      </h2>
      {/* Timeline Container - Colorful and Engaging Background */}
      <div
        ref={containerRef} // Add ref for scrolling
        className="timeline-container flex items-center gap-1 relative p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-orange-100 rounded-lg overflow-x-auto flex-grow min-h-[140px] shadow-inner z-10"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#fdbf8e #fff7ed' }} // Orange-ish scrollbar to match background
      >
        {sortedEventIds.map((eventId, index) => {
          const eventData = timelineEvents[eventId];
          if (!eventData) return null; // Skip if data is missing for an ID
          const isActive = eventId === activeEventId;
          const isCompleted = activeEventId !== null && eventId < activeEventId;
          const iconClass = getIconClassForEvent(eventId);
          // --- Styling reverted to colorful inside --- 
          const markerBorderColor = isActive ? 'border-orange-500' : isCompleted ? 'border-green-500' : 'border-gray-300';
          const markerBgColor = isActive ? 'bg-orange-100 shadow-lg ring-2 ring-orange-300 ring-offset-1' : isCompleted ? 'bg-green-100' : 'bg-white'; // Active uses accent color
          const markerScale = isActive ? 'scale-115' : 'hover:scale-110';
          const iconColor = isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500';
          const titleColor = isActive ? 'text-orange-700 font-semibold' : isCompleted ? 'text-green-700' : 'text-gray-700';
          const lineColor = isCompleted ? 'bg-green-400' : isActive ? 'bg-gradient-to-r from-green-400 to-orange-400' : 'bg-gray-300'; // Use gradient for active line
          const lineStyle = isActive ? 'animate-gradient-x' : ''; // Re-add animation class possibility

          return (
            <React.Fragment key={eventId}>
              {/* Timeline Event */}
              <div
                className={`timeline-event flex flex-col items-center text-center relative cursor-pointer w-[110px] min-w-[100px] flex-shrink-0 px-2 transition-transform duration-300 ${markerScale}`}
                data-event-id={eventId}
                onClick={() => onEventClick(eventId)} // Call prop function on click
                title={eventData.title} // Add tooltip for event title
              >
                {/* Marker and Icon */}
                <div className={`timeline-marker w-14 h-14 rounded-full border-4 flex justify-center items-center mb-2 transition-all duration-300 z-10 relative ${markerBorderColor} ${markerBgColor}`}>
                  <div className={`timeline-icon text-2xl ${iconColor}`}>
                    <i className={iconClass}></i>
                  </div>
                </div>
                {/* Content (Title and Date) */}
                <div className="timeline-content">
                  <div className={`timeline-title text-sm font-medium mb-0.5 leading-tight break-words ${titleColor}`}>
                    {eventData.title}
                  </div>
                  <div className="timeline-date text-[10px] text-gray-500">
                    {eventData.date}
                  </div>
                </div>
              </div>
              {/* Connecting Line (except for the last event) */}
              {index < sortedEventIds.length - 1 && (
                <div className={`timeline-line flex-grow min-w-[40px] h-1.5 self-center relative top-[calc(-1.5rem)] mx-[-3px] z-0 rounded-full transition-colors duration-500 ${lineColor} ${lineStyle}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Event Details Area - Consistent white background, but potentially with colored accents inside based on content */}
      <div id="event-details" className="event-details-area bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg text-sm text-gray-800 min-h-[80px] mt-0 flex-grow shadow-inner z-10">
        {eventDetailsContent || <p className="text-gray-500 italic text-center pt-2">気になるステップをタッチして、当時の気持ちを振り返ってみましょう <i class="far fa-hand-point-up ml-1"></i></p>}
      </div>
    </section>
  );
}

export default Timeline;
