import React, { useState } from "react";
import Header from "./components/Header"
import Hero from "./components/Hero"
import DynamicCards from "./components/DynamicCards"
import Info from "./components/Info"
import Footer from "./components/Footer"

function App() {
  const currentPath = window.location.pathname;
  
  // این استیت بررسی می‌کند که آیا کارتی برای نمایش کامل انتخاب شده است یا خیر
  const [selectedCard, setSelectedCard] = useState(null);

  // ۱. صفحه ورود مخفی ادمین
  if (currentPath === '/am-mssf!') {
    return (
      <div className="bg-light min-vh-100">
        <DynamicCards isSecretAdmin={true} />
      </div>
    );
  }

  // ۲. حالت صفحه جدید (وقتی روی یک کارت کلیک می‌شود)
  // هیرو و اینفو مخفی می‌شوند
  if (selectedCard) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        {/* محتوای اصلی صفحه که کل فضا را می‌گیرد تا فوتر پایین بماند */}
        <main className="flex-grow-1">
          <DynamicCards 
            isSecretAdmin={false} 
            selectedCard={selectedCard} 
            setSelectedCard={setSelectedCard} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  // ۳. حالت صفحه اصلی (وقتی هیچ کارتی انتخاب نشده)
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1">
        <Hero />
        <DynamicCards 
          isSecretAdmin={false} 
          setSelectedCard={setSelectedCard} 
        />
        <Info />
      </main>
      <Footer />
    </div>
  )
}

export default App;