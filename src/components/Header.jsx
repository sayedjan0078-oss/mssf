import React from 'react';

function Header() {
  
  // تابع حرفه‌ای برای بستن منوی موبایل و رفتن به بخش مربوطه
  const handleMobileLinkClick = () => {
    const closeBtn = document.querySelector('#mobileMenu .btn-close');
    if (closeBtn) {
      closeBtn.click(); // منو را به صورت استاندارد می‌بندد تا لینک کار کند
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top px-4 py-3" dir="rtl">
        <div className="container-fluid">
          
          {/* LOGO */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img 
              src="/logo.png" 
              alt="Logo" 
              width="45" 
              height="45" 
              className="ms-2" 
              style={{ objectFit: 'contain' }}
            />
            <span className="fw-bold fs-4 text-dark">MSSF</span>
          </a>

          {/* MOBILE BUTTON */}
          <button
            className="navbar-toggler border-0 shadow-none bg-light p-2 rounded-3"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* DESKTOP MENU */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto gap-4">
              <li className="nav-item">
                <a className="nav-link text-dark fw-bold" href="#">
                  صفحه اصلی
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-bold" href="#articles">
                  مقالات
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-bold" href="#videos">
                  ویدیوهای آموزشی
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-bold" href="#about">
                  درباره ما
                </a>
              </li>
            </ul>
          </div>

        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className="offcanvas offcanvas-start bg-white shadow"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
        dir="rtl"
      >
        {/* HEADER */}
        <div className="offcanvas-header border-bottom py-4 px-4 bg-light">
          <div className="d-flex align-items-center">
            <img src="/logo.png" alt="Logo" width="35" height="35" className="ms-2" />
            <h5 className="offcanvas-title fw-bold text-primary mb-0" id="mobileMenuLabel">
              فهرست مجمع
            </h5>
          </div>
          <button
            type="button"
            className="btn-close shadow-none m-0"
            data-bs-dismiss="offcanvas"
            aria-label="بستن"
          ></button>
        </div>

        {/* BODY */}
        <div className="offcanvas-body px-4 pt-4">
          <ul className="navbar-nav fs-5 gap-2">
            <li className="nav-item">
              <a
                className="nav-link text-dark fw-bold p-3 rounded-3"
                style={{ backgroundColor: '#f8f9fa' }}
                href="#"
                onClick={handleMobileLinkClick}
              >
                🏠 صفحه اصلی
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-dark fw-bold p-3 rounded-3 mt-2"
                style={{ backgroundColor: '#f8f9fa' }}
                href="#articles"
                onClick={handleMobileLinkClick}
              >
                📚 مقالات
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-dark fw-bold p-3 rounded-3 mt-2"
                style={{ backgroundColor: '#f8f9fa' }}
                href="#videos"
                onClick={handleMobileLinkClick}
              >
                ▶️ ویدیوهای آموزشی
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-dark fw-bold p-3 rounded-3 mt-2"
                style={{ backgroundColor: '#f8f9fa' }}
                href="#about"
                onClick={handleMobileLinkClick}
              >
                ℹ️ درباره ما
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;