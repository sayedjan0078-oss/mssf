import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DynamicCards({ isSecretAdmin, selectedCard, setSelectedCard }) {
  const [items, setItems] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState(isSecretAdmin ? 'login' : 'public');
  
  const [formData, setFormData] = useState({ 
    id: '', title: '', image_url: '', short_description: '', full_description: '', 
    has_download: false, download_url: '', direction: 'rtl' 
  });
  const [videoData, setVideoData] = useState({ id: '', title: '', video_url: '' });

  // === ۱. دریافت اطلاعات از Supabase ===
  const fetchData = async () => {
    setLoading(true);
    const { data: articlesData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    const { data: videosData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    
    if (articlesData) setItems(articlesData);
    if (videosData) setVideos(videosData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // === ۲. تابع هوشمند آپلود فایل در Storage ===
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // آپلود به باکت mssf-files
    const { error: uploadError } = await supabase.storage
      .from('mssf-files')
      .upload(filePath, file);

    if (uploadError) {
      alert('خطا در آپلود: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // دریافت لینک مستقیم
    const { data: urlData } = supabase.storage.from('mssf-files').getPublicUrl(filePath);
    setFormData(prev => ({ ...prev, [field]: urlData.publicUrl }));
    setUploading(false);
  };

  // === ۳. ذخیره مقاله ===
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      image_url: formData.image_url,
      short_description: formData.short_description,
      full_description: formData.full_description,
      has_download: formData.has_download,
      download_url: formData.download_url,
      direction: formData.direction
    };

    if (formData.id) {
      await supabase.from('articles').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('articles').insert([payload]);
    }
    fetchData();
    resetForm();
    alert('با موفقیت ثبت شد');
  };

  // === ۴. مدیریت ویدیوها ===
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    await supabase.from('videos').insert([{ title: videoData.title, video_url: videoData.video_url }]);
    fetchData();
    setVideoData({ id: '', title: '', video_url: '' });
  };

  const handleDelete = async (id, table) => {
    if(window.confirm('آیا مطمئن هستید؟')) {
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  };

  const resetForm = () => setFormData({ id: '', title: '', image_url: '', short_description: '', full_description: '', has_download: false, download_url: '', direction: 'rtl' });

  // === کمک‌کننده‌ها ===
  const getYouTubeThumbnail = (url) => {
    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/))([^#&?]*)/)?.[1];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  // ==========================================
  // بخش رندر (Public & Admin)
  // ==========================================

  const renderPublic = () => (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">کتابخانه و مقالات</h2>
      <div className="row g-4" dir="rtl">
        {items.map((item) => (
          <div className="col-md-4" key={item.id}>
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" onClick={() => setSelectedCard(item)} style={{ cursor: 'pointer' }}>
              <img src={item.image_url} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} alt={item.title} />
              <div className="card-body p-4 bg-white" dir={item.direction}>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted small">{item.short_description}</p>
                <button className="btn btn-light w-100 rounded-pill">بیشتر بخوانید</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="container py-5" dir="rtl">
      <div className="card border-0 shadow-sm p-4 bg-white mb-5 rounded-4">
        <h4 className="fw-bold mb-4">مدیریت محتوا</h4>
        <form onSubmit={handleSaveArticle}>
          <input type="text" className="form-control mb-3" placeholder="عنوان مقاله" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <div className="mb-3">
            <label className="small text-muted mb-1">تصویر شاخص:</label>
            <input type="file" className="form-control" onChange={e => handleFileUpload(e, 'image_url')} />
            {uploading && <small className="text-primary">در حال آپلود...</small>}
          </div>
          <textarea className="form-control mb-3" placeholder="توضیح کوتاه" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} />
          <textarea className="form-control mb-3" placeholder="متن کامل" rows="6" value={formData.full_description} onChange={e => setFormData({...formData, full_description: e.target.value})} />
          
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" checked={formData.has_download} onChange={e => setFormData({...formData, has_download: e.target.checked})} />
            <label className="ms-2">دارای فایل ضمیمه (PDF)</label>
          </div>
          {formData.has_download && <input type="file" className="form-control mb-3" onChange={e => handleFileUpload(e, 'download_url')} />}
          
          <button type="submit" className="btn btn-primary px-5 py-2 fw-bold" disabled={uploading}>
            {formData.id ? 'بروزرسانی' : 'انتشار'}
          </button>
        </form>
      </div>

      <div className="list-group">
        {items.map(i => (
          <div key={i.id} className="list-group-item d-flex justify-content-between align-items-center">
            {i.title}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i.id, 'articles')}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'login') return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" dir="rtl">
      <div className="card p-5 shadow-lg border-0 rounded-4 w-100" style={{maxWidth: '400px'}}>
        <h3 className="text-center mb-4">پنل ادمین</h3>
        <input type="text" id="user" className="form-control mb-3" placeholder="نام کاربری" />
        <input type="password" id="pass" className="form-control mb-4" placeholder="رمز عبور" />
        <button className="btn btn-primary w-100 py-2" onClick={() => {
          if (document.getElementById('user').value === '@mssf_admin' && document.getElementById('pass').value === '@fssm_boss') setView('admin');
          else alert('نامعتبر');
        }}>ورود</button>
      </div>
    </div>
  );

  return view === 'admin' ? renderAdmin() : (selectedCard ? null : renderPublic());
}