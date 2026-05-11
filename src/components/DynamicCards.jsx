import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DynamicCards({ isSecretAdmin, selectedCard, setSelectedCard }) {
  const [items, setItems] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState(isSecretAdmin ? 'login' : 'public');
  const [adminTab, setAdminTab] = useState('articles'); // 'articles' or 'videos'
  
  const [formData, setFormData] = useState({ 
    id: '', title: '', image_url: '', short_description: '', full_description: '', 
    has_download: false, download_url: '', direction: 'rtl' 
  });
  const [videoData, setVideoData] = useState({ id: '', title: '', video_url: '' });

  // دریافت اطلاعات
  const fetchData = async () => {
    setLoading(true);
    const { data: articlesData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    const { data: videosData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    
    if (articlesData) setItems(articlesData);
    if (videosData) setVideos(videosData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // هندل کردن اسکرول هنگام باز شدن کارت
  useEffect(() => {
    if (selectedCard) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCard]);

  const handleGoBack = () => {
    const prevId = selectedCard.id;
    setSelectedCard(null);
    setTimeout(() => {
      document.getElementById(`card-${prevId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  // آپلود فایل در Storage
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('mssf-files').upload(filePath, file);

    if (uploadError) {
      alert('خطا در آپلود: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('mssf-files').getPublicUrl(filePath);
    setFormData(prev => ({ ...prev, [field]: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title, image_url: formData.image_url,
      short_description: formData.short_description, full_description: formData.full_description,
      has_download: formData.has_download, download_url: formData.download_url, direction: formData.direction
    };

    if (formData.id) {
      await supabase.from('articles').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('articles').insert([payload]);
    }
    fetchData();
    resetArticleForm();
    alert('مقاله با موفقیت ذخیره شد.');
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (videoData.id) {
      await supabase.from('videos').update({ title: videoData.title, video_url: videoData.video_url }).eq('id', videoData.id);
    } else {
      await supabase.from('videos').insert([{ title: videoData.title, video_url: videoData.video_url }]);
    }
    fetchData();
    setVideoData({ id: '', title: '', video_url: '' });
    alert('ویدیو با موفقیت ذخیره شد.');
  };

  const handleDelete = async (id, table) => {
    if(window.confirm('آیا از حذف این مورد مطمئن هستید؟')) {
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  };

  const resetArticleForm = () => setFormData({ id: '', title: '', image_url: '', short_description: '', full_description: '', has_download: false, download_url: '', direction: 'rtl' });

  const getYouTubeThumbnail = (url) => {
    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/))([^#&?]*)/)?.[1];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  // ==========================================
  // ۱. رندر صفحه جزئیات کامل
  // ==========================================
  const renderDetailPage = () => (
    <div className="container py-5 mt-5" dir={selectedCard.direction}>
      <button onClick={handleGoBack} className="btn btn-outline-dark px-4 py-2 mb-5 fw-bold rounded-pill shadow-sm">
        {selectedCard.direction === 'ltr' ? '← Back' : '← بازگشت'}
      </button>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4 p-md-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 order-2 order-lg-1">
            <h1 className="fw-bold text-dark mb-4 display-5">{selectedCard.title}</h1>
            {selectedCard.has_download && selectedCard.download_url && (
              <a href={selectedCard.download_url} download className="btn btn-primary px-5 py-3 rounded-pill shadow fw-bold fs-5 mt-3">
                📥 {selectedCard.direction === 'ltr' ? 'Download Resources' : 'دانلود فایل ضمیمه'}
              </a>
            )}
          </div>
          <div className="col-lg-6 order-1 order-lg-2 text-center mb-4 mb-lg-0">
            <img src={selectedCard.image_url} alt="" className="img-fluid rounded-4 shadow-sm w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="border-top pt-5">
          <p className="text-secondary lh-lg fs-5" style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{selectedCard.full_description}</p>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // ۲. رندر بخش عمومی (کارت‌ها و ویدیوها)
  // ==========================================
  const renderPublic = () => (
    <>
      <section className="container py-5" id="articles">
        <h2 className="text-center fw-bold mb-5">مقالات و کتابخانه تخصصی</h2>
        <div className="row g-4" dir="rtl">
          {items.map((item) => (
            <div className="col-md-4" key={item.id} id={`card-${item.id}`}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-card" onClick={() => setSelectedCard(item)} style={{ cursor: 'pointer' }}>
                <img src={item.image_url} className="card-img-top" style={{ height: '240px', objectFit: 'cover' }} alt={item.title} />
                <div className="card-body p-4 bg-white" dir={item.direction}>
                  <h5 className="fw-bold text-dark">{item.title}</h5>
                  <p className="text-muted small mb-4">{item.short_description}</p>
                  <button className="btn btn-light text-primary fw-bold w-100 rounded-pill">بیشتر بخوانید</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5 border-top" id="videos">
        <h2 className="text-center fw-bold mb-5">ویدیوهای آموزشی</h2>
        <div className="row g-4" dir="rtl">
          {videos.map((video) => (
            <div className="col-md-4" key={video.id}>
              <a href={video.video_url} target="_blank" rel="noreferrer" className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-card">
                  <div className="position-relative">
                    <img src={getYouTubeThumbnail(video.video_url)} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} alt="" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-danger text-white rounded-circle d-flex justify-content-center align-items-center shadow" style={{ width: '60px', height: '60px' }}>
                      <svg width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                    </div>
                  </div>
                  <div className="card-body p-4 text-center bg-white"><h6 className="fw-bold text-dark m-0">{video.title}</h6></div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  // ==========================================
  // ۳. پنل ادمین حرفه‌ای (تب‌بندی شده)
  // ==========================================
  const renderAdmin = () => (
    <div className="container py-5" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 className="fw-bold">داشبورد مدیریت محتوا</h2>
        <button className="btn btn-dark px-4 rounded-pill" onClick={() => window.location.reload()}>خروج</button>
      </div>

      {/* ناوبری تب‌ها */}
      <div className="d-flex gap-3 mb-4">
        <button className={`btn btn-lg rounded-pill px-4 ${adminTab === 'articles' ? 'btn-primary' : 'btn-light'}`} onClick={() => setAdminTab('articles')}>📦 مدیریت مقالات</button>
        <button className={`btn btn-lg rounded-pill px-4 ${adminTab === 'videos' ? 'btn-danger' : 'btn-light'}`} onClick={() => setAdminTab('videos')}>🎥 مدیریت ویدیوها</button>
      </div>

      <div className="row">
        {adminTab === 'articles' ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-5">
              <h4 className="fw-bold mb-4 text-primary">{formData.id ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</h4>
              <form onSubmit={handleSaveArticle}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">عنوان مقاله</label>
                    <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">جهت متن</label>
                    <select className="form-select" value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})}>
                      <option value="rtl">راست‌چین (فارسی)</option>
                      <option value="ltr">چپ‌چین (English)</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">تصویر اصلی</label>
                    <input type="file" className="form-control" onChange={e => handleFileUpload(e, 'image_url')} />
                    {uploading && <small className="text-primary">در حال آپلود فایل در سرور...</small>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-check form-switch mt-4">
                      <input className="form-check-input" type="checkbox" checked={formData.has_download} onChange={e => setFormData({...formData, has_download: e.target.checked})} />
                      <label className="ms-2 fw-bold">ضمیمه فایل PDF</label>
                    </div>
                    {formData.has_download && <input type="file" className="form-control mt-2" onChange={e => handleFileUpload(e, 'download_url')} />}
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">توضیح کوتاه (خلاصه)</label>
                    <input type="text" className="form-control" maxLength="100" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} />
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label fw-bold">متن کامل مقاله</label>
                    <textarea className="form-control" rows="8" value={formData.full_description} onChange={e => setFormData({...formData, full_description: e.target.value})}></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill shadow" disabled={uploading}>{formData.id ? 'بروزرسانی مقاله' : 'انتشار مقاله'}</button>
                {formData.id && <button onClick={resetArticleForm} className="btn btn-link text-secondary">انصراف</button>}
              </form>
            </div>
            
            <h5 className="fw-bold mb-3">لیست مقالات اخیر</h5>
            <div className="list-group shadow-sm rounded-4">
              {items.map(i => (
                <div key={i.id} className="list-group-item d-flex justify-content-between align-items-center p-3 bg-white border-0 border-bottom">
                  <div><img src={i.image_url} width="40" height="40" className="rounded-2 me-3" style={{objectFit:'cover'}} /> <strong>{i.title}</strong></div>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setFormData(i)}>ویرایش</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i.id, 'articles')}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-5">
              <h4 className="fw-bold mb-4 text-danger">افزودن ویدیوی یوتیوب</h4>
              <form onSubmit={handleSaveVideo}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control form-control-lg" placeholder="عنوان ویدیو" value={videoData.title} onChange={e => setVideoData({...videoData, title: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="url" className="form-control form-control-lg" placeholder="لینک مستقیم یوتیوب" value={videoData.video_url} onChange={e => setVideoData({...videoData, video_url: e.target.value})} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-danger btn-lg px-5 rounded-pill shadow">نشر ویدیو</button>
              </form>
            </div>

            <h5 className="fw-bold mb-3">لیست ویدیوهای اخیر</h5>
            <div className="row g-3">
              {videos.map(v => (
                <div key={v.id} className="col-md-6">
                  <div className="card border-0 shadow-sm p-3 rounded-4 d-flex flex-row justify-content-between align-items-center bg-white">
                    <div className="d-flex align-items-center">
                      <img src={getYouTubeThumbnail(v.video_url)} width="60" className="rounded-2 me-3" />
                      <span className="fw-bold">{v.title}</span>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v.id, 'videos')}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // === منطق نهایی نمایش ===
  if (view === 'login') return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" dir="rtl">
      <div className="card p-5 shadow-lg border-0 rounded-4 w-100 bg-white" style={{maxWidth: '450px'}}>
        <h3 className="text-center fw-bold mb-4 text-primary">ورود به پنل ادمین</h3>
        <input type="text" id="user" className="form-control form-control-lg mb-3" placeholder="نام کاربری (@mssf_admin)" dir="ltr" />
        <input type="password" id="pass" className="form-control form-control-lg mb-4" placeholder="رمز عبور" dir="ltr" />
        <button className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow" onClick={() => {
          if (document.getElementById('user').value === '@mssf_admin' && document.getElementById('pass').value === '@fssm_boss') setView('admin');
          else alert('نام کاربری یا رمز عبور اشتباه است!');
        }}>ورود به پنل مدیریت</button>
      </div>
    </div>
  );

  if (view === 'admin') return renderAdmin();
  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div><p className="mt-2 fw-bold">در حال بارگذاری اطلاعات...</p></div>;
  
  // رفع مشکل نمایش جزئیات: اگر کارتی انتخاب شده بود، صفحه جزئیات را نشان بده، در غیر این صورت صفحه اصلی
  return selectedCard ? renderDetailPage() : renderPublic();
}