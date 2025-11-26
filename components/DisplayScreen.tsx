import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, Period } from '../types';
import { getCurrentPeriod, isActivityDay, formatTime, getOmanTime, getOmanDate } from '../utils';
import { useNavigate } from 'react-router-dom';

interface DisplayScreenProps {
  settings: AppSettings;
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({ settings }) => {
  const navigate = useNavigate();
  
  // -- State for Clock & Date --
  const [currentTime, setCurrentTime] = useState(getOmanTime());
  const [currentDate, setCurrentDate] = useState(getOmanDate());

  // -- State for Schedule --
  const [periodInfo, setPeriodInfo] = useState<{ current: Period | null, timeLeft: number }>({ current: null, timeLeft: 0 });

  // -- State for Media (Card 3) --
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isShowingLogo, setIsShowingLogo] = useState(false);

  // -- State for Goals (Card 2) --
  const [goalIndex, setGoalIndex] = useState(0);

  // -- Refs for intervals --
  // Fix: Use ReturnType<typeof setTimeout> for browser compatibility instead of NodeJS.Timeout
  const mediaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Clock & Schedule Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getOmanTime());
      setCurrentDate(getOmanDate());

      // Determine schedule type
      const isActivity = isActivityDay(settings.activityDays);
      const todaySchedule = isActivity ? settings.schedule.activity : settings.schedule.normal;
      const { current, timeLeft } = getCurrentPeriod(todaySchedule);
      
      setPeriodInfo({ current, timeLeft });

    }, 1000);

    return () => clearInterval(timer);
  }, [settings.schedule, settings.activityDays]);

  // 2. Media Rotator Logic
  useEffect(() => {
    const handleMediaCycle = () => {
      if (settings.media.length === 0) return;

      if (isShowingLogo) {
        // We were showing logo, now switch to NEXT media
        const nextIndex = (mediaIndex + 1) % settings.media.length;
        setMediaIndex(nextIndex);
        setIsShowingLogo(false);
      } else {
        // We were showing media, now switch to Logo
        setIsShowingLogo(true);
      }
    };

    const currentMedia = settings.media[mediaIndex];
    // If showing logo, wait logoDuration. If showing media, wait media.duration
    const duration = isShowingLogo 
      ? settings.logoDuration * 1000 
      : (currentMedia ? currentMedia.duration * 1000 : 5000);

    mediaTimeoutRef.current = setTimeout(handleMediaCycle, duration);

    return () => {
      if (mediaTimeoutRef.current) clearTimeout(mediaTimeoutRef.current);
    };
  }, [isShowingLogo, mediaIndex, settings.media, settings.logoDuration]);

  // 3. Goals Rotator Logic (Show 2 goals at a time)
  useEffect(() => {
    if (settings.goals.length === 0) return;
    const interval = setInterval(() => {
        setGoalIndex((prev) => (prev + 2) % settings.goals.length);
    }, settings.goalsDuration * 1000);
    return () => clearInterval(interval);
  }, [settings.goals, settings.goalsDuration]);


  // Helper to render Goal items
  const currentGoals = [
    settings.goals[goalIndex],
    settings.goals[(goalIndex + 1) % settings.goals.length] // Wrap around if odd number
  ].filter(Boolean); // remove undefined if list is empty

  const activeMedia = settings.media[mediaIndex];

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100 overflow-hidden text-slate-900 select-none">
      
      {/* --- Main Grid Content (93% Height) --- */}
      <div className="flex flex-row w-full h-[93%] p-2 gap-2">
        
        {/* RIGHT COLUMN (31%) */}
        <div className="w-[31%] flex flex-col gap-2 h-full">
          
          {/* Card 1: Current Period (20% Height) */}
          <div className="h-[20%] bg-white rounded-2xl shadow-lg border-2 border-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
             {/* Hidden Admin Button - Top Right Corner */}
            <div 
              className="absolute top-0 right-0 w-8 h-8 z-50 cursor-default opacity-0 hover:opacity-100 bg-red-500/10" 
              onClick={() => navigate('/admin')}
              title="لوحة التحكم"
            ></div>

            <h2 className="text-2xl font-bold text-slate-600 mb-1">
              {periodInfo.current ? periodInfo.current.name : 'لا توجد حصة حالياً'}
            </h2>
            {periodInfo.current && (
               <div className="flex flex-col items-center animate-pulse">
                 <span className="text-sm text-slate-400">المتبقي</span>
                 <div className="flex items-center gap-2" dir="ltr">
                    <span className="text-5xl font-black text-blue-700 tabular-nums">
                      {formatTime(periodInfo.timeLeft)}
                    </span>
                 </div>
                 <span className="text-xs text-slate-400 mt-1">دقيقة</span>
               </div>
            )}
             {!periodInfo.current && (
                <div className="text-slate-400">خارج وقت الدوام</div>
             )}
          </div>

          {/* Card 2: Strategic Goals (80% Height) */}
          <div className="h-[80%] bg-white rounded-2xl shadow-lg border-2 border-slate-200 flex flex-col p-6 relative overflow-hidden">
             <div className="flex-grow flex flex-col justify-center gap-8">
                <h3 className="text-xl font-bold text-blue-800 border-b-2 border-blue-100 pb-2 mb-2">الأهداف الاستراتيجية</h3>
                {currentGoals.map((g, idx) => (
                  <div key={idx} className="bg-blue-50 p-6 rounded-xl border-r-4 border-blue-600 shadow-sm transition-all duration-500 transform translate-x-0 opacity-100">
                    <p className="text-2xl font-semibold leading-relaxed text-slate-800">
                      {g?.text}
                    </p>
                  </div>
                ))}
             </div>
             
             {/* Developer Footer in Card 2 */}
             <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
                <img src={settings.schoolLogo} alt="Logo" className="h-16 w-16 object-contain" />
                <p className="text-sm font-bold text-slate-400">مطور النظام: {settings.developerName}</p>
             </div>
          </div>
        </div>

        {/* CENTER COLUMN (38%) */}
        {/* Card 3: Media Gallery (100% Height) */}
        <div className="w-[38%] h-full bg-black rounded-2xl shadow-2xl overflow-hidden relative border-4 border-slate-800">
          {/* If showing logo */}
          {isShowingLogo && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-20 animate-fade-in">
              <img src={settings.schoolLogo} alt="School Logo" className="w-[60%] h-auto object-contain animate-bounce-slow" />
            </div>
          )}

          {/* Media Content */}
          {!isShowingLogo && activeMedia && (
            <div className="w-full h-full relative">
              {activeMedia.type === 'video' ? (
                 <video 
                  src={activeMedia.url} 
                  autoPlay 
                  muted 
                  loop 
                  className="absolute inset-0 w-full h-full object-cover" 
                 />
              ) : (
                 <img 
                  src={activeMedia.url} 
                  alt="Gallery" 
                  className="absolute inset-0 w-full h-full object-cover"
                 />
              )}
              
              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-6 text-white text-center backdrop-blur-sm">
                <p className="text-2xl font-bold">{activeMedia.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* LEFT COLUMN (31%) */}
        <div className="w-[31%] flex flex-col gap-2 h-full">
          
          {/* Card 4: Mission (70% Height) */}
          <div className="h-[70%] bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
             </div>
             <h3 className="text-3xl font-black text-blue-900 mb-6 border-r-8 border-blue-600 pr-4">رسالة المدرسة</h3>
             <p className="text-2xl leading-[1.8] font-semibold text-slate-700 text-justify">
               {settings.mission}
             </p>
          </div>

          {/* Card 5: Vision (30% Height) */}
          <div className="h-[30%] bg-blue-900 rounded-2xl shadow-lg p-6 flex flex-col justify-center text-white relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-800 rounded-full blur-2xl"></div>
             <h3 className="text-2xl font-bold text-blue-200 mb-4 flex items-center gap-2">
               <span className="w-2 h-8 bg-yellow-400 block rounded-full"></span>
               رؤية المدرسة
             </h3>
             <p className="text-2xl leading-relaxed font-bold text-center drop-shadow-md">
               {settings.vision}
             </p>
          </div>

        </div>

      </div>

      {/* --- Footer News Ticker (7% Height) --- */}
      <div className="h-[7%] w-full bg-blue-900 text-white flex items-center shadow-inner relative z-10">
        
        {/* Date Section (Right) */}
        <div className="h-full px-6 bg-blue-800 flex items-center justify-center font-bold text-xl min-w-fit shadow-lg z-20">
           {currentDate} م
        </div>

        {/* Scrolling News */}
        <div className="flex-grow overflow-hidden relative h-full flex items-center bg-blue-900">
          <div 
             className="whitespace-nowrap absolute flex gap-16"
             style={{ 
               animation: `ticker ${settings.newsSpeed}s linear infinite`,
               right: '-100%' // Start from off-screen right
             }}
          >
             {/* Duplicate news items to ensure there is enough content for a loop effect, though simple CSS ticker always has a gap */}
             {[...settings.news, ...settings.news].map((item, idx) => (
               <span key={idx} className={`text-2xl font-semibold flex items-center gap-2 ${item.isImportant ? 'text-yellow-300' : 'text-white'}`}>
                  {item.isImportant && <span className="text-yellow-400">⚠</span>}
                  {item.text}
                  <span className="text-blue-500 mx-4">✦</span>
               </span>
             ))}
          </div>
        </div>

        {/* Clock Section (Left) */}
        <div className="h-full px-6 bg-slate-800 flex items-center justify-center font-black text-3xl min-w-fit shadow-lg z-20 text-yellow-400 tracking-widest font-mono">
           {currentTime}
        </div>

      </div>

    </div>
  );
};

export default DisplayScreen;