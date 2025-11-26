export interface Period {
  id: number;
  name: string;
  start: string; // HH:mm 24h format
  end: string;   // HH:mm 24h format
}

export type ScheduleType = 'normal' | 'activity';

export interface ScheduleDay {
  normal: Period[];
  activity: Period[];
}

export interface NewsItem {
  id: string;
  text: string;
  isImportant: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string; // URL or Local Path
  duration: number; // Seconds
  description: string;
}

export interface StrategicGoal {
  id: string;
  text: string;
}

export interface AppSettings {
  schoolName: string;
  schoolLogo: string;
  vision: string;
  mission: string;
  developerName: string;
  activityDays: number[]; // 0=Sunday, 1=Monday, etc. (adjusted for JS getDay where 0 is Sunday)
  newsSpeed: number; // Seconds for full cycle
  logoDuration: number; // Seconds to show logo between media
  goalsDuration: number; // Seconds per slide
  
  // Content
  news: NewsItem[];
  media: MediaItem[];
  goals: StrategicGoal[];
  
  // Schedules
  schedule: ScheduleDay;
}

export const DEFAULT_SETTINGS: AppSettings = {
  schoolName: "المدرسة النموذجية",
  schoolLogo: "https://picsum.photos/200/200", // Placeholder
  vision: "جيل ملتزما خلقيا، ومعتزا بوطنيته، ومتمكنا علميا وتكنولوجيا",
  mission: "تسعى المدرسة إلى استثمار كافة الإمكانيات والكادر المبدع والمجتمع الفاعل، لتحفيز الالتزام الخلقي والسلوكي والولاء الوطني وحب التعلم لدى الطلبة وتجويد الأداء من أجل الوصول إلى رعاية شاملة وبناء عقول صاعدة بالوطن تواكب التقانة الحديثة.",
  developerName: "أ.أسعد الذهلي",
  activityDays: [2], // Default Tuesday (2)
  newsSpeed: 25,
  logoDuration: 5,
  goalsDuration: 10,
  news: [
    { id: '1', text: 'أهلاً بكم في مدرستنا العامرة', isImportant: false },
    { id: '2', text: 'يبدأ اختبار منتصف الفصل الأسبوع القادم', isImportant: true }
  ],
  media: [
    { id: '1', type: 'image', url: 'https://picsum.photos/1080/1920', duration: 10, description: 'نشاط الطلاب في المعمل' },
    { id: '2', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 15, description: 'فيديو توعوي' }
  ],
  goals: [
    { id: '1', text: 'الالتزام الوطني المطلق نحو الحفاظ على العهد الأمين في المسؤولية الوطنية نحو التربية الصحيحة للأبناء' },
    { id: '2', text: 'التسامح والمساواة وتأصيل حقوق الطفل (علميا وصحيا) في المجتمع المدرسي والمحلي' },
    { id: '3', text: 'شفافية التعامل وتحفيز حرية التعبير ومد جسور التواصل الهادف في المجتمع المدرسي' },
    { id: '4', text: 'تحفيز بيئة التعليم والتعلم من خلال تسخير الجهود والإمكانيات للمعلمين والطلبة' },
    { id: '5', text: 'العمل بروح الفريق الواحد وغرس ثقافة الولاء والانتماء في المجتمع المدرسي' },
    { id: '6', text: 'الالتزام بنشر ثقافة العمل التطوعي وتأصيله في نفوس الناشئة لتعزيز قيم المواطنة الصالحة' },
    { id: '7', text: 'ضمان وجود مؤشرات مرتفعة لحب التعلم لتكوين قناعات حقيقية بجودة أداء المؤسسة' },
    { id: '8', text: 'ضمان مشاركة فاعلة بين المدرسة والمجتمع المحلي' },
    { id: '9', text: 'الالتزام القيمي لكافة العاملين لتجويد الأداء التربوي' },
    { id: '10', text: 'تعزيز الوعي الصحي لدى الطلبة وكافة العاملين بالمدرسة' }
  ],
  schedule: {
    normal: [
      { id: 1, name: "الطابور", start: "07:10", end: "07:25" },
      { id: 2, name: "الحصة الأولى", start: "07:25", end: "08:05" },
      { id: 3, name: "الحصة الثانية", start: "08:10", end: "08:50" },
      { id: 4, name: "الحصة الثالثة", start: "08:55", end: "09:35" },
      { id: 5, name: "الحصة الرابعة", start: "09:40", end: "10:20" },
      { id: 6, name: "الفسحة", start: "10:20", end: "10:45" },
      { id: 7, name: "الحصة الخامسة", start: "10:45", end: "11:25" },
      { id: 8, name: "الحصة السادسة", start: "11:30", end: "12:10" },
      { id: 9, name: "الحصة السابعة", start: "12:15", end: "12:55" },
      { id: 10, name: "الحصة الثامنة", start: "13:00", end: "13:40" },
    ],
    activity: [
      { id: 1, name: "الطابور", start: "07:10", end: "07:45" },
      { id: 2, name: "الحصة الأولى", start: "07:45", end: "08:25" },
      { id: 3, name: "الحصة الثانية", start: "08:25", end: "09:05" },
      { id: 4, name: "الحصة الثالثة", start: "09:05", end: "09:45" },
      { id: 5, name: "الحصة الرابعة", start: "09:45", end: "10:25" },
      { id: 6, name: "الفسحة", start: "10:25", end: "10:50" },
      { id: 7, name: "الحصة الخامسة", start: "10:50", end: "11:30" },
      { id: 8, name: "الحصة السادسة", start: "11:30", end: "12:10" },
      { id: 9, name: "الحصة السابعة", start: "12:15", end: "12:55" },
      { id: 10, name: "الحصة الثامنة", start: "13:00", end: "13:40" },
    ]
  }
};
