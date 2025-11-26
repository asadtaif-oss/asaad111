import { Period } from './types';

// Check if today is an activity day (0=Sunday, ... 6=Saturday)
export const isActivityDay = (activityDays: number[]): boolean => {
  const today = new Date().getDay();
  // Adjust JS getDay() where 0 is Sunday.
  return activityDays.includes(today);
};

export const parseTime = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getCurrentPeriod = (periods: Period[]): { current: Period | null, next: Period | null, timeLeft: number } => {
  const now = new Date();
  let current: Period | null = null;
  let next: Period | null = null;
  let timeLeft = 0;

  for (let i = 0; i < periods.length; i++) {
    const p = periods[i];
    const start = parseTime(p.start);
    const end = parseTime(p.end);

    if (now >= start && now < end) {
      current = p;
      timeLeft = Math.floor((end.getTime() - now.getTime()) / 1000);
      next = periods[i + 1] || null;
      break;
    }
    
    // Check if we are in a break before this period
    if (now < start) {
       // We are before this period, so this is the "next" one
       next = p;
       break;
    }
  }

  return { current, next, timeLeft };
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getOmanTime = (): string => {
  return new Date().toLocaleTimeString('ar-OM', {
    timeZone: 'Asia/Muscat',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const getOmanDate = (): string => {
  return new Date().toLocaleDateString('ar-OM', {
    timeZone: 'Asia/Muscat',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
