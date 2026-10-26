// ============================================================
// SHORAKAEI — Premium 3D Interactions
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // ۱. افکت 3D Tilt برای کارت‌های بلاگ و فرم
  const tiltElements = document.querySelectorAll(".blog-card, .blog-card-featured, .oform");
  
  tiltElements.forEach((el) => {
    el.style.transformStyle = "preserve-3d";
    el.style.transition = "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5 degrees
      const rotateY = ((x - centerX) / centerX) * 5;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      el.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });
  });

  // ۲. افکت مغناطیسی برای دکمه‌ها
  const magneticButtons = document.querySelectorAll(".oform-btn--primary, .button-primary, .nav-order-button");
  
  magneticButtons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0) scale(1)";
    });
  });
});