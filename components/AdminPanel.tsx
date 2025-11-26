import React, { useState } from 'react';
import { AppSettings, DEFAULT_SETTINGS, Period, NewsItem, MediaItem, StrategicGoal } from '../types';
import { useNavigate } from 'react-router-dom';

interface AdminPanelProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onSave }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'schedule' | 'news' | 'media' | 'goals'>('general');

  const handleChange = (field: keyof AppSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const handleReset = () => {
    if(confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟')) {
      setFormData(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم شاشة المدرسة</h1>
            <p className="text-slate-400 text-sm">إدارة المحتوى والجداول الزمنية</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold transition">
               شاشة العرض
             </button>
             <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold transition shadow-lg">
               حفظ التعديلات
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'general', label: 'عام والرؤية' },
            { id: 'schedule', label: 'الجداول الزمنية' },
            { id: 'news', label: 'شريط الأخبار' },
            { id: 'media', label: 'معرض الوسائط' },
            { id: 'goals', label: 'الأهداف الاستراتيجية' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-bold text-lg transition ${activeTab === tab.id ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8">
          
          {/* --- GENERAL TAB --- */}
          {activeTab === 'general' && (
            <div className="grid gap-6">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">اسم المدرسة</label>
                    <input 
                      type="text" 
                      value={formData.schoolName}
                      onChange={e => handleChange('schoolName', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">مطور النظام</label>
                    <input 
                      type="text" 
                      value={formData.developerName}
                      onChange={e => handleChange('developerName', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold mb-2">رابط الشعار (URL)</label>
                 <input 
                    type="text" 
                    value={formData.schoolLogo}
                    onChange={e => handleChange('schoolLogo', e.target.value)}
                    className="w-full border p-2 rounded ltr"
                  />
                  <img src={formData.schoolLogo} alt="Preview" className="h-20 w-20 mt-2 object-contain border" />
               </div>

               <div>
                 <label className="block text-sm font-bold mb-2">رؤية المدرسة</label>
                 <textarea 
                    value={formData.vision}
                    onChange={e => handleChange('vision', e.target.value)}
                    className="w-full border p-2 rounded h-24"
                  />
               </div>

               <div>
                 <label className="block text-sm font-bold mb-2">رسالة المدرسة</label>
                 <textarea 
                    value={formData.mission}
                    onChange={e => handleChange('mission', e.target.value)}
                    className="w-full border p-2 rounded h-32"
                  />
               </div>
            </div>
          )}

          {/* --- SCHEDULE TAB --- */}
          {activeTab === 'schedule' && (
            <div className="space-y-8">
               <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                  <h3 className="font-bold text-lg mb-2">إعدادات أيام النشاط</h3>
                  <div className="flex gap-4 flex-wrap">
                    {[0,1,2,3,4,5,6].map(day => {
                       const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                       const isSelected = formData.activityDays.includes(day);
                       return (
                         <button
                           key={day}
                           onClick={() => {
                             const newDays = isSelected 
                               ? formData.activityDays.filter(d => d !== day)
                               : [...formData.activityDays, day];
                             handleChange('activityDays', newDays);
                           }}
                           className={`px-4 py-2 rounded border ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'}`}
                         >
                           {days[day]}
                         </button>
                       )
                    })}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  {/* Normal Schedule */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-blue-800 border-b pb-2">الجدول العادي</h3>
                    {formData.schedule.normal.map((p, idx) => (
                      <div key={p.id} className="flex gap-2 mb-2 items-center text-sm">
                        <span className="w-24 font-bold">{p.name}</span>
                        <input type="time" value={p.start} onChange={e => {
                           const newSched = [...formData.schedule.normal];
                           newSched[idx].start = e.target.value;
                           handleChange('schedule', { ...formData.schedule, normal: newSched });
                        }} className="border p-1 rounded" />
                        <span>إلى</span>
                        <input type="time" value={p.end} onChange={e => {
                           const newSched = [...formData.schedule.normal];
                           newSched[idx].end = e.target.value;
                           handleChange('schedule', { ...formData.schedule, normal: newSched });
                        }} className="border p-1 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Activity Schedule */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-green-800 border-b pb-2">جدول النشاط</h3>
                    {formData.schedule.activity.map((p, idx) => (
                      <div key={p.id} className="flex gap-2 mb-2 items-center text-sm">
                        <span className="w-24 font-bold">{p.name}</span>
                        <input type="time" value={p.start} onChange={e => {
                           const newSched = [...formData.schedule.activity];
                           newSched[idx].start = e.target.value;
                           handleChange('schedule', { ...formData.schedule, activity: newSched });
                        }} className="border p-1 rounded" />
                        <span>إلى</span>
                        <input type="time" value={p.end} onChange={e => {
                           const newSched = [...formData.schedule.activity];
                           newSched[idx].end = e.target.value;
                           handleChange('schedule', { ...formData.schedule, activity: newSched });
                        }} className="border p-1 rounded" />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* --- NEWS TAB --- */}
          {activeTab === 'news' && (
            <div>
               <div className="mb-4">
                  <label className="font-bold">سرعة الشريط (ثانية)</label>
                  <input type="number" value={formData.newsSpeed} onChange={e => handleChange('newsSpeed', Number(e.target.value))} className="border p-2 rounded w-24 mr-2" />
               </div>
               <div className="space-y-2">
                 {formData.news.map((item, idx) => (
                   <div key={item.id} className="flex gap-2 items-center bg-white p-3 border rounded shadow-sm">
                      <span className="font-bold w-6">{idx + 1}</span>
                      <input 
                        type="text" 
                        value={item.text} 
                        onChange={e => {
                           const newNews = [...formData.news];
                           newNews[idx].text = e.target.value;
                           handleChange('news', newNews);
                        }}
                        className="flex-grow border p-2 rounded"
                      />
                      <label className="flex items-center gap-2 cursor-pointer bg-yellow-50 px-2 py-1 rounded">
                        <input 
                          type="checkbox" 
                          checked={item.isImportant}
                          onChange={e => {
                            const newNews = [...formData.news];
                            newNews[idx].isImportant = e.target.checked;
                            handleChange('news', newNews);
                          }}
                        />
                        <span>هام</span>
                      </label>
                      <button 
                        onClick={() => {
                          const newNews = formData.news.filter((_, i) => i !== idx);
                          handleChange('news', newNews);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >حذف</button>
                   </div>
                 ))}
                 <button 
                    onClick={() => handleChange('news', [...formData.news, { id: Date.now().toString(), text: 'خبر جديد', isImportant: false }])}
                    className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded font-bold w-full border-2 border-dashed border-blue-300 hover:bg-blue-200"
                 >
                   + إضافة خبر
                 </button>
               </div>
            </div>
          )}

          {/* --- MEDIA TAB --- */}
          {activeTab === 'media' && (
            <div>
               <div className="mb-4 bg-blue-50 p-4 rounded text-sm text-blue-800">
                  <p>ضع الفيديوهات والصور في مجلد المشروع <code>/public/media/</code> واستخدم المسار <code>/media/filename.mp4</code> أو استخدم روابط مباشرة.</p>
                  <div className="mt-2">
                    <label className="font-bold ml-2">مدة ظهور الشعار الفاصل (ثانية):</label>
                    <input type="number" value={formData.logoDuration} onChange={e => handleChange('logoDuration', Number(e.target.value))} className="border p-1 w-20 rounded"/>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                 {formData.media.map((item, idx) => (
                   <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-white p-4 border rounded shadow-sm items-start">
                      <div className="w-full md:w-32 h-48 bg-black flex items-center justify-center shrink-0">
                         {item.type === 'video' ? <span className="text-white">Video</span> : <img src={item.url} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-grow grid gap-2 w-full">
                         <div className="flex gap-2">
                           <select 
                              value={item.type}
                              onChange={e => {
                                const newMedia = [...formData.media];
                                newMedia[idx].type = e.target.value as any;
                                handleChange('media', newMedia);
                              }}
                              className="border p-2 rounded"
                           >
                             <option value="image">صورة</option>
                             <option value="video">فيديو</option>
                           </select>
                           <input 
                              type="number" 
                              placeholder="المدة (ث)" 
                              value={item.duration}
                              onChange={e => {
                                const newMedia = [...formData.media];
                                newMedia[idx].duration = Number(e.target.value);
                                handleChange('media', newMedia);
                              }}
                              className="border p-2 rounded w-24"
                           />
                         </div>
                         <input 
                            type="text" 
                            placeholder="الرابط / المسار" 
                            value={item.url}
                            onChange={e => {
                              const newMedia = [...formData.media];
                              newMedia[idx].url = e.target.value;
                              handleChange('media', newMedia);
                            }}
                            className="border p-2 rounded w-full ltr"
                         />
                         <input 
                            type="text" 
                            placeholder="الوصف (يظهر أسفل الشاشة)" 
                            value={item.description}
                            onChange={e => {
                              const newMedia = [...formData.media];
                              newMedia[idx].description = e.target.value;
                              handleChange('media', newMedia);
                            }}
                            className="border p-2 rounded w-full"
                         />
                      </div>
                      <button 
                        onClick={() => {
                          const newMedia = formData.media.filter((_, i) => i !== idx);
                          handleChange('media', newMedia);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                      >حذف</button>
                   </div>
                 ))}
                 <button 
                    onClick={() => handleChange('media', [...formData.media, { id: Date.now().toString(), type: 'image', url: 'https://picsum.photos/1080/1920', duration: 10, description: 'وصف جديد' }])}
                    className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded font-bold w-full border-2 border-dashed border-blue-300 hover:bg-blue-200"
                 >
                   + إضافة وسائط
                 </button>
               </div>
            </div>
          )}

           {/* --- GOALS TAB --- */}
           {activeTab === 'goals' && (
            <div>
               <div className="mb-4">
                  <label className="font-bold">مدة عرض كل شريحة (ثانية)</label>
                  <input type="number" value={formData.goalsDuration} onChange={e => handleChange('goalsDuration', Number(e.target.value))} className="border p-2 rounded w-24 mr-2" />
               </div>
               <div className="space-y-2">
                 {formData.goals.map((item, idx) => (
                   <div key={item.id} className="flex gap-2 items-center bg-white p-3 border rounded shadow-sm">
                      <span className="font-bold w-6">{idx + 1}</span>
                      <textarea 
                        value={item.text} 
                        onChange={e => {
                           const newGoals = [...formData.goals];
                           newGoals[idx].text = e.target.value;
                           handleChange('goals', newGoals);
                        }}
                        className="flex-grow border p-2 rounded h-20"
                      />
                      <button 
                        onClick={() => {
                          const newGoals = formData.goals.filter((_, i) => i !== idx);
                          handleChange('goals', newGoals);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded self-start"
                      >حذف</button>
                   </div>
                 ))}
                 <button 
                    onClick={() => handleChange('goals', [...formData.goals, { id: Date.now().toString(), text: 'هدف استراتيجي جديد' }])}
                    className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded font-bold w-full border-2 border-dashed border-blue-300 hover:bg-blue-200"
                 >
                   + إضافة هدف
                 </button>
               </div>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center border-t">
           <button onClick={handleReset} className="text-red-500 text-sm hover:underline">استعادة الإعدادات الافتراضية</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
