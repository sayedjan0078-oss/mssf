import React from 'react';

function Hero() {
  return (
    <section 
      className="hero-section d-flex align-items-center"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <div 
        className="container hero-content text-white" 
        dir="rtl" // راست‌چین کردن برای زبان دری
      >
        <div className="row justify-content-center text-center">
          <div className="col-lg-8 col-md-10">
            
            {/* عنوان اصلی */}
            <h1 className="display-4 fw-bold lh-base mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              مجمع علمی علوم مدیریت (MSSF) <br />
              <span className="text-warning">بستری برای رشد و رهبری</span>
            </h1>

            {/* متن توضیحات */}
            <p className="lead lh-lg mb-5" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)', fontSize: '1.2rem' }}>
              ما جمعی از محصلین پویا و آینده‌نگر هستیم که با برگزاری سمینارهای تخصصی و برنامه‌های علمی، دانش نوین مدیریت را به اشتراک می‌گذاریم. هدف ما ارتقای ظرفیت‌های مسلکی و ساختن مدیران موفق برای فردا است.
            </p>

            {/* دکمه‌ها */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-warning btn-lg px-5 fw-bold rounded-pill shadow">
                اشتراک در سمینارها
              </button>
              <button className="btn btn-outline-light btn-lg px-5 fw-bold rounded-pill">
                بیشتر بدانید
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;