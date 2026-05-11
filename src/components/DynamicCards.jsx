import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DynamicCards({ isSecretAdmin, selectedCard, setSelectedCard }) {
  // === استیت مقالات ===
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('akademi_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  // === استیت ویدیوهای یوتیوب ===
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('akademi_videos');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState(isSecretAdmin ? 'login' : 'public');
  
  const [formData, setFormData] = useState({ id: '', title: '', image: '', shortDesc: '', fullDesc: '', hasDownload: false, downloadLink: '', direction: 'rtl' });
  const [videoData, setVideoData] = useState({ id: '', title: '', link: '' });

  useEffect(() => { localStorage.setItem('akademi_data', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('akademi_videos', JSON.stringify(videos)); }, [videos]);

  useEffect(() => {
    if (selectedCard) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCard]);

  const handleGoBack = () => {
    const previousCardId = selectedCard.id;
    setSelectedCard(null);
    setTimeout(() => {
      const cardElement = document.getElementById(`card-${previousCardId}`);
      if (cardElement) cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getYouTubeThumbnail = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://via.placeholder.com/600x400?text=Video';
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, [field]: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (formData.id) setItems(items.map(i => i.id === formData.id ? formData : i));
    else setItems([{ ...formData, id: Date.now().toString() }, ...items]);
    setFormData({ id: '', title: '', image: '', shortDesc: '', fullDesc: '', hasDownload: false, downloadLink: '', direction: 'rtl' });
  };

  const handleSaveVideo = (e) => {
    e.preventDefault();
    if (videoData.id) setVideos(videos.map(v => v.id === videoData.id ? videoData : v));
    else setVideos([{ ...videoData, id: Date.now().toString() }, ...videos]);
    setVideoData({ id: '', title: '', link: '' });
  };

  const deleteItem = (id, type) => {
    if(window.confirm('آیا از حذف این مورد مطمئن هستید؟')) {
      if (type === 'article') setItems(items.filter(i => i.id !== id));
      if (type === 'video') setVideos(videos.filter(v => v.id !== id));
    }
  };

  const renderDetailPage = () => (
    <div className="container py-5" dir={selectedCard.direction || 'rtl'}>
      <button onClick={handleGoBack} className="btn btn-outline-dark px-4 py-2 mb-4 fw-bold rounded-pill shadow-sm">
        {selectedCard.direction === 'ltr' ? '← Back to Home' : '← بازگشت به صفحه اصلی'}
      </button>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4 p-md-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="fw-bold text-dark mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.4' }}>{selectedCard.title}</h1>
            {selectedCard.hasDownload && selectedCard.downloadLink && (
              <a href={selectedCard.downloadLink} download={`${selectedCard.title}_file`} target="_blank" rel="noreferrer" className="btn btn-primary px-4 py-3 rounded-pill shadow-sm fw-bold fs-5 mt-3">
                📥 {selectedCard.direction === 'ltr' ? 'Download Attached File' : 'دانلود فایل ضمیمه شده'}
              </a>
            )}
          </div>
          <div className="col-lg-6 text-center">
            <img src={selectedCard.image} alt={selectedCard.title} className="img-fluid rounded-4 shadow" style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }} />
          </div>
        </div>
        <div className="border-top pt-5">
          <h4 className="fw-bold mb-4">{selectedCard.direction === 'ltr' ? 'Description' : 'توضیحات کامل'}</h4>
          <p className="text-secondary lh-lg fs-5" style={{ textAlign: selectedCard.direction === 'ltr' ? 'left' : 'justify', whiteSpace: 'pre-wrap' }}>{selectedCard.fullDesc}</p>
        </div>
      </div>
    </div>
  );

  const renderPublicCards = () => (
    <>
      {/* بخش مقالات (اضافه شدن id="articles") */}
      <section className="container py-5" id="articles">
        <h2 className="fw-bold text-dark text-center mb-5">کتابخانه و مقالات مجمع</h2>
        <div className="row g-4" dir="rtl">
          {items.length === 0 ? (
            <p className="text-center text-muted fs-5">تا هنوز مطلبی نشر نشده است.</p>
          ) : (
            items.map((item) => (
              <div className="col-md-4" key={item.id} id={`card-${item.id}`}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => setSelectedCard && setSelectedCard(item)} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.classList.add('shadow-lg'); }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow-lg'); }}>
                  <img src={item.image || 'https://via.placeholder.com/600x400'} className="card-img-top" alt={item.title} style={{ height: '240px', objectFit: 'cover' }} />
                  <div className="card-body p-4 bg-white" dir={item.direction || 'rtl'}>
                    <h5 className="card-title fw-bold text-dark mb-3" style={{ lineHeight: '1.4' }}>{item.title}</h5>
                    <p className="card-text text-secondary mb-4" style={{ textAlign: item.direction === 'ltr' ? 'left' : 'justify' }}>{truncateText(item.shortDesc, 60)}</p>
                    <button className="btn btn-light text-primary fw-bold w-100 rounded-pill">{item.direction === 'ltr' ? 'Read More' : 'بیشتر بخوانید'}</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* بخش ویدیوهای یوتیوب (اضافه شدن id="videos") */}
      <section className="container py-5 border-top" id="videos">
        <h2 className="fw-bold text-dark text-center mb-5">ویدیوهای آموزشی MSSF</h2>
        <div className="row g-4" dir="rtl">
          {videos.length === 0 ? (
            <p className="text-center text-muted fs-5">تا هنوز ویدیویی نشر نشده است.</p>
          ) : (
            videos.map((video) => (
              <div className="col-md-4" key={video.id}>
                <a href={video.link} target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.classList.add('shadow-lg'); }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow-lg'); }}>
                    <div className="position-relative">
                      <img src={getYouTubeThumbnail(video.link)} className="card-img-top" alt="Thumbnail" style={{ height: '220px', objectFit: 'cover' }} />
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center shadow" style={{ width: '60px', height: '60px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '4px' }}>
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4 text-center bg-white">
                      <h6 className="fw-bold text-dark m-0 lh-base">{video.title}</h6>
                    </div>
                  </div>
                </a>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );

  const renderLogin = () => (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" dir="rtl">
      <div className="card border-0 shadow rounded-4 p-5 bg-white" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="fw-bold mb-4 text-center">ورود به پنل مدیریت</h3>
        <input type="text" id="username" className="form-control form-control-lg mb-3" placeholder="نام کاربری (@mssf_admin)" dir="ltr" />
        <input type="password" id="password" className="form-control form-control-lg mb-4" placeholder="رمز عبور" dir="ltr" />
        <button className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" onClick={() => {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user === '@mssf_admin' && pass === '@fssm_boss') setView('admin');
            else alert('رمز عبور یا نام کاربری اشتباه است!');
          }}>ورود</button>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="container py-5" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 className="fw-bold text-dark">داشبورد مدیریت MSSF</h2>
      </div>
      <div className="row g-5">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h4 className="fw-bold mb-4 text-primary">مدیریت مقالات و کتاب‌ها</h4>
            <form onSubmit={handleSaveArticle}>
              <div className="d-flex gap-3 mb-3">
                <div className="form-check"><input className="form-check-input" type="radio" name="direction" id="dirRtl" value="rtl" checked={formData.direction === 'rtl'} onChange={e => setFormData({...formData, direction: e.target.value})} /><label className="form-check-label fw-medium" htmlFor="dirRtl">فارسی</label></div>
                <div className="form-check"><input className="form-check-input" type="radio" name="direction" id="dirLtr" value="ltr" checked={formData.direction === 'ltr'} onChange={e => setFormData({...formData, direction: e.target.value})} /><label className="form-check-label fw-medium" htmlFor="dirLtr">انگلیسی</label></div>
              </div>
              <input type="text" className="form-control mb-3" placeholder="عنوان مقاله" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} dir={formData.direction} required />
              <input type="file" accept="image/*" className="form-control mb-3" onChange={(e) => handleFileChange(e, 'image')} required={!formData.image} />
              <textarea className="form-control mb-3" placeholder="توضیح کوتاه" maxLength="100" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} dir={formData.direction} required />
              <textarea className="form-control mb-3" placeholder="توضیحات کامل" rows="4" value={formData.fullDesc} onChange={e => setFormData({...formData, fullDesc: e.target.value})} dir={formData.direction} required />
              <div className="form-check form-switch mb-3"><input className="form-check-input" type="checkbox" checked={formData.hasDownload} onChange={e => setFormData({...formData, hasDownload: e.target.checked})} id="downloadSwitch" /><label className="form-check-label fw-bold" htmlFor="downloadSwitch">ضمیمه فایل</label></div>
              {formData.hasDownload && <input type="file" accept=".pdf,.doc,.docx" className="form-control mb-4" onChange={(e) => handleFileChange(e, 'downloadLink')} required={!formData.downloadLink} />}
              <button type="submit" className="btn btn-primary w-100 fw-bold">{formData.id ? 'بروزرسانی مقاله' : 'نشر مقاله'}</button>
            </form>
          </div>
          <div className="list-group">
            {items.map(item => (
              <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center p-3 border rounded-3 mb-2">
                <span className="fw-bold">{item.title}</span>
                <div className="btn-group" dir="ltr">
                  <button className="btn btn-outline-primary btn-sm px-3" onClick={() => setFormData(item)}>ویرایش</button>
                  <button className="btn btn-danger btn-sm px-3" onClick={() => deleteItem(item.id, 'article')}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-6 border-start">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-light mb-4">
            <h4 className="fw-bold mb-4 text-danger">افزودن ویدیوی یوتیوب</h4>
            <form onSubmit={handleSaveVideo}>
              <input type="text" className="form-control mb-3" placeholder="عنوان ویدیو" value={videoData.title} onChange={e => setVideoData({...videoData, title: e.target.value})} required />
              <input type="url" className="form-control mb-4" placeholder="لینک یوتیوب (https://youtube.com/...)" value={videoData.link} onChange={e => setVideoData({...videoData, link: e.target.value})} dir="ltr" required />
              <button type="submit" className="btn btn-danger w-100 fw-bold">{videoData.id ? 'بروزرسانی ویدیو' : 'نشر ویدیو'}</button>
            </form>
          </div>
          <div className="list-group">
            {videos.map(video => (
              <div key={video.id} className="list-group-item d-flex justify-content-between align-items-center p-3 border rounded-3 mb-2">
                <span className="fw-bold">{video.title}</span>
                <div className="btn-group" dir="ltr">
                  <button className="btn btn-outline-danger btn-sm px-3" onClick={() => setVideoData(video)}>ویرایش</button>
                  <button className="btn btn-danger btn-sm px-3" onClick={() => deleteItem(video.id, 'video')}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'login') return renderLogin();
  if (view === 'admin') return renderAdmin();
  
  return selectedCard ? renderDetailPage() : renderPublicCards();
}