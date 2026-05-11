import React from 'react';

function Info() {
  return (
    <section className="container py-5 my-5" id="about">
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
        <div className="text-center mx-auto" style={{ maxWidth: "800px" }}>
          
          <h2 className="fw-bold text-dark mb-4" dir="rtl">
            درباره ما (MSSF)
          </h2>
          
          <div className="bg-primary mx-auto mb-4 rounded-pill" style={{ width: '60px', height: '4px' }}></div>

          <p className="text-secondary lh-lg fs-5" dir="rtl" style={{ textAlign: 'justify' }}>
            ما در مجمع علمی علوم مدیریت (MSSF) تلاش می‌کنیم تا با استفاده از روش‌های نوین و برگزاری برنامه‌های علمی، بستری مناسب برای رشد، یادگیری و اشتراک دانش محصلین فراهم کنیم. هدف ما ایجاد یک جامعه پویا از مدیران و رهبران آینده افغانستان است که با دانش و مهارت‌های روز دنیا، مسیر پیشرفت را هموار می‌سازند.
          </p>

        </div>
      </div>
    </section>
  );
}

export default Info;