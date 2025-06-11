import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; // ScrollToPlugin をインポート
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarCheck, faBookOpen, faClipboardQuestion, faCalculator, faFilePrescription, faComments, faLightbulb, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(ScrollToPlugin); // ScrollToPlugin を登録

// Helper function to get Font Awesome icon class based on event ID
// イベントIDに基づいて Font Awesome アイコンクラスを取得するヘルパー関数
function getIconClassForEvent(eventId, events) {
  return events[eventId]?.icon || 'fas fa-question-circle'; // Fallback icon
}

// EventDetailCard Component
const EventDetailCard = ({ eventData, onClose }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const summaryRef = useRef(null); 

  useEffect(() => {
    if (!eventData || !cardRef.current) return;

    // GSAP Animations reinstated and adjusted for richness
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } }); // Changed default ease

    // Card fade-in and subtle scale
    tl.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.5 }
    );

    // Image animation (if exists)
    if (imageRef.current) {
        tl.fromTo(imageRef.current, 
            { opacity: 0, scale: 0.8, rotation: -3 }, 
            { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(1.4)' }, 
            '-=0.25' // Overlap slightly
        );
    }
    
    // Summary container (dialogue blocks container) animation
    if (summaryRef.current) {
        tl.fromTo(summaryRef.current, 
            { opacity: 0, x: -15 }, 
            { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 
            '-=0.2'
        );
        
        // Dialogue blocks animation (staggered)
        const dialogueBlocks = summaryRef.current.querySelectorAll('.dialogue-block');
        if (dialogueBlocks.length > 0) {
            tl.fromTo(dialogueBlocks, 
                { opacity: 0, y: 15, scale:0.95 }, 
                { 
                  opacity: 1, 
                  y: 0, 
                  scale:1, 
                  stagger: {
                    each: 0.25, // Time between each block animation
                    from: "start" // Animate from the first block
                  },
                  duration: 0.45, 
                  ease: 'circ.out' // Smoother ease for dialogue blocks
                }, 
                '-=0.15' 
            );
        }

        // Keyword Wappens animation (staggered, after dialogue blocks)
        const keywordWappens = summaryRef.current.querySelectorAll('.keyword-wappen');
        if (keywordWappens.length > 0) {
            // Initial state set via CSS (opacity: 0 initially)
            tl.to(keywordWappens, { 
                opacity: 1, 
                scale: 1, 
                rotation: 0,
                // y:0, // If they are absolutely positioned and need y adjustment
                stagger: 0.15, 
                duration: 0.4, 
                ease: 'elastic.out(1, 0.6)', // More playful wappen animation
            }, dialogueBlocks.length > 0 ? ">-0.3" : ">0.1"); // Start during/after dialogue blocks finish
        }
        
        // Inline Keywords animation (staggered, subtle highlight)
        const inlineKeywords = summaryRef.current.querySelectorAll('.keyword-inline');
        if (inlineKeywords.length > 0) {
            // Set initial state for more controlled animation if not handled by CSS
            gsap.set(inlineKeywords, { opacity: 0, y: 3 });
            tl.to(inlineKeywords, {
                opacity: 1, 
                y: 0,
                duration: 0.3, 
                stagger: 0.1,
                ease: 'power2.out',
            }, keywordWappens.length > 0 ? ">-0.25" : (dialogueBlocks.length > 0 ? ">-0.2" : ">0.1")
            );
        }
    }

  }, [eventData]);

  if (!eventData) return null;

  const { title, date, summary, image, themeColorClass } = eventData;
  const tc = themeColorClass || { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-300', accentBg: 'bg-gray-100', iconContainerBg: 'bg-gray-200' };

  return (
    <div 
        ref={cardRef} 
        className={`event-detail-card relative p-4 md:p-5 rounded-xl shadow-xl border-2 ${tc.border} ${tc.accentBg} overflow-y-auto max-h-[70vh] opacity-0`} 
        style={{borderColor: tc.border || 'transparent'}} 
    >
      <button 
        onClick={onClose} 
        className={`sticky top-0 right-0 z-20 float-right text-xl ${tc.text} opacity-80 hover:opacity-100 transition-opacity p-1 rounded-full hover:${tc.iconContainerBg}`}
        title="閉じる"
      >
        <i className="fas fa-times-circle"></i>
      </button>

      <div className="flex flex-col md:flex-row gap-4 items-start mt-2">
        {image && (
          <div ref={imageRef} className={`w-full md:w-1/3 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border ${tc.border} p-1 ${tc.iconContainerBg}`}> 
            <img src={image} alt={title} className="w-full h-auto object-cover rounded-md min-h-[100px] bg-gray-200" />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h3 className={`text-xl font-bold ${tc.text} mb-1`}>{title}</h3>
          <p className={`text-xs ${tc.text} opacity-70 mb-3`}>{date}</p>
          {summary && (
            <div
              ref={summaryRef} 
              className={`text-sm ${tc.text} leading-relaxed mb-3 dialogue-summary-content`}
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
        </div>
      </div>
    </div>
  );
};


// Timeline Component: Displays the customer interaction timeline
// Timeline コンポーネント: 顧客とのやり取りのタイムラインを表示します
function Timeline({ timelineEvents, activeEventId, onEventClick }) {
  console.log('[Timeline Render] Start. Props:', { timelineEvents, activeEventId });

  const containerRef = useRef(null);
  console.log('[Timeline Hook] 1. useRef (containerRef)');
  const [sortedEventIds, setSortedEventIds] = useState([]);
  console.log('[Timeline Hook] 2. useState (sortedEventIds)', sortedEventIds);
  const eventRefs = useRef({}); // 各イベント要素の参照を保持
  console.log('[Timeline Hook] 3. useRef (eventRefs)');
  const [currentDetailEvent, setCurrentDetailEvent] = useState(null);
  console.log('[Timeline Hook] 4. useState (currentDetailEvent)', currentDetailEvent);

  // Sort event IDs numerically when timelineEvents changes
  // timelineEvents が変更されたときにイベントIDを数値でソートします
  useEffect(() => {
    console.log('[Timeline Effect 1] Sort event IDs. Deps:', { timelineEvents });
    if (timelineEvents) {
      const ids = Object.keys(timelineEvents)
        .map(Number) // Convert keys to numbers
        .sort((a, b) => a - b); // Sort numerically
      setSortedEventIds(ids);
      // 初期化時にrefオブジェクトも初期化
      eventRefs.current = ids.reduce((acc, id) => {
        acc[id] = React.createRef();
        return acc;
      }, {});
    } else {
      setSortedEventIds([]);
      eventRefs.current = {};
    }
  }, [timelineEvents]);
  console.log('[Timeline Hook] 5. useEffect (Sort event IDs)');

  // Scroll the active event into view when activeEventId changes
  // activeEventId が変更されたときにアクティブなイベントが表示されるようにスクロールします
  useEffect(() => {
    console.log('[Timeline Effect 2] Scroll active event. Deps:', { activeEventId, sortedEventIds });
    let scrollLeftValue = 0;
    if (activeEventId !== null && containerRef.current && eventRefs.current[activeEventId]?.current) {
      const activeElement = eventRefs.current[activeEventId].current;
      const containerWidth = containerRef.current.offsetWidth;
      const elementOffsetLeft = activeElement.offsetLeft;
      const elementWidth = activeElement.offsetWidth;
      scrollLeftValue = elementOffsetLeft - (containerWidth / 2) + (elementWidth / 2);
      gsap.to(containerRef.current, {
        scrollTo: { x: scrollLeftValue },
        duration: 0.8,
        ease: 'power3.inOut'
      });
    } else if (activeEventId === null && containerRef.current) {
      gsap.to(containerRef.current, { scrollTo: { x: 0 }, duration: 0.5, ease: 'power2.out' });
    }
  }, [activeEventId, sortedEventIds]);
  console.log('[Timeline Hook] 6. useEffect (Scroll active event)');

  // GSAP アニメーション: イベントマーカーの初期表示とホバー
  useEffect(() => {
    console.log('[Timeline Effect 3] Event marker animations. Deps:', { sortedEventIds, timelineEvents, activeEventId });
    if (!timelineEvents || sortedEventIds.length === 0) {
        console.log('[Timeline Effect 3] Skipped due to no timelineEvents or sortedEventIds.');
        return;
    }
    sortedEventIds.forEach((id, index) => {
      const el = eventRefs.current[id]?.current;
      const eventData = timelineEvents[id];
      const tc = eventData?.themeColorClass || { accentBg: 'hover:bg-gray-100' };

      if (el) {
        // 初期表示アニメーション
        gsap.fromTo(el, 
          { opacity: 0, y: 30, scale: 0.8 }, 
          { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: index * 0.1 + 0.2, ease: 'back.out(1.4)' }
        );

        // ホバーアニメーション
        const markerIcon = el.querySelector('.timeline-marker-icon');
        const markerOuter = el.querySelector('.timeline-marker-outer');

        const isActive = activeEventId === id; // このuseEffect内でisActiveを定義

        el.addEventListener('mouseenter', () => {
            gsap.to(el, { y: -5, scale: isActive ? 1.03 : 1.01, duration: 0.2, ease: 'power2.out' });
            if (markerIcon) gsap.to(markerIcon, { scale: isActive ? 1.15 : 1.05, rotate: isActive ? 5 : -2, duration: 0.2, ease: 'power2.out' });
            if (markerOuter && isActive) gsap.to(markerOuter, { backgroundColor: tc.accentBg.replace('bg-','').split('-')[0] + '-200', duration:0.2}); 
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { y: 0, scale: 1, duration: 0.2, ease: 'power2.out' });
            if (markerIcon) gsap.to(markerIcon, { scale: 1, rotate: 0, duration: 0.2, ease: 'power2.out' });
            if (markerOuter && isActive) gsap.to(markerOuter, { backgroundColor: 'transparent', duration:0.2});
        });
      }
    });
  }, [sortedEventIds, timelineEvents, activeEventId]);
  console.log('[Timeline Hook] 7. useEffect (Event marker animations)');

  const isActiveEvent = (id) => id === activeEventId;
  const isCompletedEvent = (id) => activeEventId !== null && id < activeEventId;

  // useEffectフック群の後に早期リターンを移動
  if (!timelineEvents || sortedEventIds.length === 0) {
    console.log('[Timeline Render] Early return: No timelineEvents or sortedEventIds.');
    return <div className="p-4 text-center text-gray-500">タイムライン情報がありません。</div>;
  }
  console.log('[Timeline Render] Proceeding to render JSX.');

  const handleEventClickInternal = (eventId) => {
    onEventClick(eventId); // Call original prop for App.js logic
    setCurrentDetailEvent(timelineEvents[eventId] || null);
    const clickedEl = eventRefs.current[eventId]?.current;
    if (clickedEl) {
      gsap.timeline()
        .to(clickedEl, { scale: 0.9, yoyo: true, repeat: 1, duration: 0.15, ease: 'power1.inOut' })
        .to(clickedEl.querySelector('.timeline-marker-icon'), { 
            scale: 1.2, 
            opacity: 0.8, 
            duration: 0.3, 
            yoyo: true, 
            repeat: 1, 
            ease: 'elastic.out(1, 0.5)' 
        }, "<0.1");
    }
  };

  const handleCloseDetailCard = () => {
    setCurrentDetailEvent(null);
    // Optionally, reset activeEventId in App.js if desired, or keep it to maintain scroll position
    // onEventClick(null); // This would also reset AI concierge message, maybe not desired.
  };

  // アクティブイベントのラインをアニメーションさせるuseEffect
  /*
  useEffect(() => {
    console.log('[Timeline Effect 4] Active event line animation. Deps:', { activeEventId, sortedEventIds, timelineEvents });
    if (!timelineEvents || sortedEventIds.length === 0) {
        console.log('[Timeline Effect 4] Skipped due to no timelineEvents or sortedEventIds.');
        return;
    }
    sortedEventIds.forEach((id, index) => {
      const lineEl = document.getElementById(`timeline-line-${id}`);
      if (lineEl) {
        const isActive = isActiveEvent(id) || (activeEventId !== null && id === activeEventId -1 && index < sortedEventIds.length -1);
        const eventData = timelineEvents[id];
        const nextEventData = timelineEvents[activeEventId];
        let targetColor = 'rgb(209, 213, 219)'; // Default gray

        if(isCompletedEvent(id) && id < activeEventId) {
            targetColor = eventData?.themeColorClass?.bg ? gsap.utils.css(document.createElement('div'), eventData.themeColorClass.bg).backgroundColor : 'rgb(5, 150, 105)'; // green
        } 
        if (isActiveEvent(id)) {
            targetColor = nextEventData?.themeColorClass?.bg ? gsap.utils.css(document.createElement('div'), nextEventData.themeColorClass.bg).backgroundColor : 'rgb(2, 132, 199)'; // blue
        }
        
        gsap.to(lineEl, { 
            backgroundColor: targetColor,
            height: isActive ? '10px' : '8px', // アクティブな線は少し太く
            duration: 0.5, 
            ease: 'power2.inOut' 
        });
      }
    });
  }, [activeEventId, sortedEventIds, timelineEvents]);
  console.log('[Timeline Hook] 8. useEffect (Active event line animation) - THIS IS LIKELY THE ONE CAUSING ISSUES IF IT APPEARS CONDITIONALLY');
  */

  return (
    <section className="timeline-log module bg-white border border-gray-200 rounded-lg p-4 shadow-md md:col-span-2 flex flex-col relative overflow-hidden">
      <h2 className="text-xl font-bold text-green-800 mb-4 text-center border-b-2 border-green-800 pb-2 flex items-center justify-center z-10">
        <img src="pentan.png" alt="" className="h-8 w-auto mr-2" />
        これまでの歩みより
      </h2>
      <div
        ref={containerRef}
        className="timeline-container flex items-center gap-1 relative p-4 bg-gradient-to-r from-sky-50 via-cyan-50 to-teal-50 border border-sky-200 rounded-lg overflow-x-auto flex-grow min-h-[160px] shadow-inner z-10" // min-h調整
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#a5f3fc #e0f2f7' }}
      >
        {sortedEventIds.map((eventId, index) => {
          const eventData = timelineEvents[eventId];
          if (!eventData) return null;
          const isActive = isActiveEvent(eventId);
          const isCompleted = isCompletedEvent(eventId);
          const iconClass = getIconClassForEvent(eventId, timelineEvents);
          const tc = eventData.themeColorClass || { bg: 'bg-gray-300', text: 'text-gray-600', border: 'border-gray-400', accentBg: 'bg-gray-100', iconContainerBg: 'bg-gray-200' };
          
          let markerOuterClass = `${tc.border} ${tc.accentBg}`;
          let markerInnerClass = `${tc.iconContainerBg} ${tc.text}`;
          let titleColor = tc.text;
          let dynamicLineColor = 'bg-gray-300'; // Default line color
          let iconOpacityClass = isActive ? 'opacity-100' : 'opacity-60 grayscale'; // 非アクティブ時のスタイル

          if (isCompleted) {
            markerOuterClass = `border-green-500 bg-green-50`;
            markerInnerClass = `bg-green-100 text-green-600`;
            titleColor = 'text-green-700 font-medium';
            dynamicLineColor = eventData.themeColorClass?.bg || 'bg-green-400'; 
            iconOpacityClass = isActive ? 'opacity-100' : 'opacity-70'; // 完了済みは少し濃く
          }          
          if (isActive) {
            markerOuterClass = `${tc.border} ${tc.accentBg} ring-2 ${tc.border.replace('border-','ring-')} ring-offset-1 shadow-lg`;
            markerInnerClass = `${tc.iconContainerBg} ${tc.text} shadow-inner`; 
            titleColor = `${tc.text} font-semibold`;
            iconOpacityClass = 'opacity-100'; // アクティブは完全に表示
          }

          return (
            <React.Fragment key={eventId}>
              <div
                ref={eventRefs.current[eventId]}
                className={`timeline-event flex flex-col items-center text-center relative cursor-pointer w-[120px] min-w-[110px] flex-shrink-0 px-1.5 transition-all duration-300 transform ${isActive ? '' : 'hover:scale-102'}`}
                data-event-id={eventId}
                onClick={() => handleEventClickInternal(eventId)}
                title={eventData.title}
              >
                <div className={`timeline-marker-outer w-16 h-16 rounded-full border-4 flex justify-center items-center mb-1 transition-all duration-300 z-10 relative ${markerOuterClass} shadow-md`}>
                  <div className={`timeline-marker-icon w-12 h-12 rounded-full flex justify-center items-center ${markerInnerClass} transition-all duration-200 ${iconOpacityClass}`}>
                    <i className={`${iconClass} text-2xl`}></i>
                  </div>
                  {isCompleted && !isActive && (
                     <i className="fas fa-check-circle absolute -top-1 -right-1 text-lg text-green-500 bg-white rounded-full shadow"></i>
                  )}
                  {isActive && (
                    <div className={`absolute -bottom-1.5 w-2.5 h-2.5 ${tc.bg} rounded-full animate-pulse_fast`}></div>
                  )}
                </div>
                <div className="timeline-content">
                  <div className={`timeline-title text-[11px] font-medium mb-0.5 leading-tight break-words ${titleColor}`}>
                    {eventData.title}
                  </div>
                  <div className="timeline-date text-[9px] text-gray-500">
                    {eventData.date}
                  </div>
                </div>
              </div>
              {index < sortedEventIds.length - 1 && (
                <div 
                    id={`timeline-line-${eventId}`}
                    className={`timeline-line flex-grow min-w-[50px] h-[6px] self-center relative top-[calc(-2.2rem)] mx-[-4px] z-0 rounded-full transition-all duration-500 ${dynamicLineColor}`}>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div id="event-details-area" className="event-details-area p-1 mt-3 min-h-[150px] flex-grow z-10 overflow-hidden">
        {currentDetailEvent ? (
          <EventDetailCard eventData={currentDetailEvent} onClose={handleCloseDetailCard} />
        ) : (
          <div className="text-center text-gray-500 italic pt-8 flex flex-col items-center justify-center">
            <img src="/pentan_timeline_empty.png" alt="ペンタンおやすみ" className="h-20 w-auto mb-3 opacity-70"/>
            <p>気になるステップをタッチして、<br/>一緒に歩んだ道のりを振り返ってみましょう <i className="far fa-hand-point-up ml-1"></i></p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Timeline;
