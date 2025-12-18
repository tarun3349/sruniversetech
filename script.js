/* script.js — interaction for SR Universe Tech
   - Mobile nav toggle
   - Smooth anchor scroll
   - Scroll fade-in using IntersectionObserver
*/

document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  navToggle.addEventListener('click', function(){
    siteNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    // update accessibility state
    const expanded = navToggle.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });

  // Close nav when link clicked (mobile)
  siteNav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  // Close nav on outside click (mobile)
  document.addEventListener('click', function(e){
    const target = e.target;
    if(siteNav.classList.contains('open') && !siteNav.contains(target) && !navToggle.contains(target)){
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // Send contact form via WhatsApp (opens WhatsApp Web / App with prefilled message)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const rawPhone = String(contactForm.dataset.whatsapp || '7708042480').trim();
      let fullPhone = rawPhone.replace(/\D/g, '');
      // If the user provided a local 10-digit number, assume India and prepend 91
      if (/^\d{10}$/.test(fullPhone)) fullPhone = '91' + fullPhone;

      // Validate final phone length (WhatsApp expects international digits without +, between 8 and 15 digits)
      if (!/^\d{8,15}$/.test(fullPhone)) {
        alert('Phone number invalid after normalization: ' + fullPhone + '\nPlease check the number in the form configuration.');
        console.error('Invalid normalized phone for WhatsApp:', { rawPhone, fullPhone });
        return;
      }

      const name = (document.getElementById('name')||{}).value || '';
      const email = (document.getElementById('email')||{}).value || '';
      const message = (document.getElementById('message')||{}).value || '';
      if (!name.trim() || !email.trim() || !message.trim()) {
        alert('Please fill Name, Email and Message before sending.');
        return;
      }

      const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
      const encoded = encodeURIComponent(text);

      const urlApi = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encoded}`;
      const urlWeb = `https://web.whatsapp.com/send?phone=${fullPhone}&text=${encoded}`;

      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const urlToOpen = isMobile ? urlApi : urlWeb;

      // Directly open WhatsApp (no alerts/confirm). URL logged for debugging.
      window.open(urlToOpen, '_blank');
      console.log('Opened WhatsApp URL:', urlToOpen);
      contactForm.reset();
    });
  }

  // IntersectionObserver for fade-in with left/right entrance
  const faders = document.querySelectorAll('.fade-in');
  // assign alternating directions for a flowing effect
  faders.forEach((f, i)=>{
    f.dataset.dir = (i % 2 === 0) ? 'left' : 'right';
  });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.12});

  faders.forEach(f=>io.observe(f));
});
