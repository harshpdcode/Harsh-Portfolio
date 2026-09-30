/* =============================================
   HARSH PORTFOLIO - MAIN JAVASCRIPT
   jQuery + Vanilla JS | Animations & Interactions
   EmailJS Integration for Contact Form
   ============================================= */

$(document).ready(function () {

  // ============================================================
  // ❗ EMAILJS CONFIG — Replace with your actual keys from emailjs.com
  //    Steps:
  //    1. Go to https://www.emailjs.com and create a free account
  //    2. Add an Email Service (Gmail) → copy Service ID below
  //    3. Create an Email Template   → copy Template ID below
  //    4. Go to Account → API Keys  → copy Public Key below
  // ============================================================
  const EMAILJS_SERVICE_ID  = 'service_ynj3qkp';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'template_552pnkv';  // e.g. 'template_xyz456'
  const EMAILJS_PUBLIC_KEY  = 'V5ummltgAak0_vUUt';   // e.g. 'AbCdEfGhIjKlMnOp'

  // Initialize EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);

  // ---- AOS INIT ----
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  // ---- PRELOADER ----
  setTimeout(function () {
    $('#preloader').addClass('hidden');
    setTimeout(() => $('#preloader').remove(), 700);
  }, 2400);

  // ---- CUSTOM CURSOR ----
  const cursorDot     = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  if (cursorDot && cursorOutline) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    function animateCursorOutline() {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top  = outlineY + 'px';
      requestAnimationFrame(animateCursorOutline);
    }
    animateCursorOutline();

    $('a, button, .project-card, .tech-icon-item, .filter-btn').on('mouseenter', function () {
      cursorOutline.classList.add('hovered');
    }).on('mouseleave', function () {
      cursorOutline.classList.remove('hovered');
    });
  }

  // ---- PARTICLE CANVAS ----
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 0.5;
      const colors = ['rgba(124,58,237,CCC)', 'rgba(6,182,212,CCC)', 'rgba(245,158,11,CCC)'];
      this.color = colors[Math.floor(Math.random() * colors.length)].replace('CCC', (Math.random() * 0.4 + 0.1).toFixed(2));
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 110) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ---- NAVBAR SCROLL ----
  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    if (scrollTop > 60) {
      $('#mainNav').addClass('scrolled');
    } else {
      $('#mainNav').removeClass('scrolled');
    }

    // Active nav link
    const sections = ['home', 'about', 'services', 'skills', 'projects', 'achievements', 'experience', 'contact'];
    sections.forEach(id => {
      const sec = $('#' + id);
      if (sec.length) {
        const top    = sec.offset().top - 100;
        const bottom = top + sec.outerHeight();
        if (scrollTop >= top && scrollTop < bottom) {
          $('.nav-link').removeClass('active');
          $('#nav-' + id).addClass('active');
        }
      }
    });

    // Back to top
    if (scrollTop > 400) {
      $('#backToTop').addClass('visible');
    } else {
      $('#backToTop').removeClass('visible');
    }
  });

  // ---- BACK TO TOP ----
  $('#backToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 700, 'swing');
  });

  // ---- TYPED TEXT EFFECT ----
  const typedEl    = document.getElementById('typedText');
  const phrases    = [
    'Freelance Web Developer',
    'Full Stack Developer',
    'E-Commerce Specialist',
    'UI/UX Designer',
    'AI Creative Developer',
    'Problem Solver',
  ];
  let phraseIdx    = 0;
  let charIdx      = 0;
  let isDeleting   = false;
  let typingDelay  = 100;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = current.slice(0, charIdx--);
      typingDelay = 55;
    } else {
      typedEl.textContent = current.slice(0, charIdx++);
      typingDelay = 110;
    }
    if (!isDeleting && charIdx > current.length) {
      typingDelay = 1800;
      isDeleting  = true;
    } else if (isDeleting && charIdx < 0) {
      isDeleting  = false;
      phraseIdx   = (phraseIdx + 1) % phrases.length;
      typingDelay = 450;
    }
    setTimeout(type, typingDelay);
  }
  setTimeout(type, 2600);

  // ---- COUNTER ANIMATION ----
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'));
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer    = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(animateCounter);
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // ---- SKILL BAR ANIMATION ----
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-category-card').forEach(card => skillObserver.observe(card));

  // ---- PROJECT FILTER ----
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    $('.project-item').each(function () {
      const category = $(this).data('category');
      if (filter === 'all' || category === filter) {
        $(this).removeClass('hidden').fadeIn(350);
      } else {
        $(this).addClass('hidden').fadeOut(350);
      }
    });
  });

  // ---- SMOOTH SCROLL FOR NAV LINKS ----
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 76 }, 750, 'swing');
      // Close mobile menu
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navCollapse).hide();
      }
    }
  });

  // ============================================================
  // ---- CONTACT FORM — Netlify Forms + EmailJS Integration ----
  // ============================================================
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    const name    = $('#contactName').val().trim();
    const email   = $('#contactEmail').val().trim();
    const subject = $('#contactSubject').val().trim();
    const message = $('#contactMessage').val().trim();

    // Basic validation
    let hasError = false;
    $(this).find('.form-control-custom').each(function () {
      if (!$(this).val().trim()) {
        $(this).addClass('field-error');
        setTimeout(() => $(this).removeClass('field-error'), 1000);
        hasError = true;
      }
    });
    if (hasError) return;

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $('#contactEmail').addClass('field-error');
      setTimeout(() => $('#contactEmail').removeClass('field-error'), 1000);
      showFormError('Please enter a valid email address.');
      return;
    }

    // Button loading state
    const btn = $('#sendMsgBtn');
    btn.html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...').prop('disabled', true);
    $('#formSuccessMsg, #formErrorMsg').hide();

    // Prepare Netlify FormData
    const formElement = document.getElementById('contactForm');
    const formData = new FormData(formElement);
    const urlEncodedData = new URLSearchParams(formData).toString();

    // Primary Submission: Netlify Forms AJAX
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: urlEncodedData
    })
    .then(function (response) {
      if (response.ok) {
        handleSuccess();
      } else {
        // Fallback to EmailJS if Netlify form is not active or during local development
        sendWithEmailJS();
      }
    })
    .catch(function () {
      // Fallback to EmailJS on network/server error
      sendWithEmailJS();
    });

    function handleSuccess() {
      btn.html('<span class="btn-text">Send Message</span><i class="fas fa-paper-plane ms-2"></i>').prop('disabled', false);
      formElement.reset();
      $('#formSuccessMsg').css('display', 'flex').hide().fadeIn(400);
      setTimeout(() => $('#formSuccessMsg').fadeOut(400), 6000);
    }

    function sendWithEmailJS() {
      const now = new Date();
      const sentTime = now.toLocaleString('en-IN', {
        timeZone:  'Asia/Kolkata',
        weekday:   'long',
        year:      'numeric',
        month:     'long',
        day:       'numeric',
        hour:      '2-digit',
        minute:    '2-digit',
      });

      const templateParams = {
        from_name:  name,
        from_email: email,
        reply_to:   email,
        subject:    subject,
        message:    message,
        to_name:    'Harsh Pandya',
        sent_time:  sentTime,
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function () {
          handleSuccess();
        })
        .catch(function (err) {
          console.error('EmailJS Fallback FAILED:', err);
          btn.html('<span class="btn-text">Send Message</span><i class="fas fa-paper-plane ms-2"></i>').prop('disabled', false);
          showFormError('Message could not be sent automatically. Please reach out directly at pandyaharsh528@gmail.com or via WhatsApp.');
        });
    }
  });

  function showFormError(msg) {
    // Update the <span> inside the error div so the icon is preserved
    $('#formErrorMsg span').text(msg);
    $('#formErrorMsg').css('display', 'flex').hide().fadeIn(400);
    setTimeout(() => $('#formErrorMsg').fadeOut(500), 8000);
  }

  // ---- CURRENT YEAR ----
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // ---- PARALLAX on Hero ----
  $(window).on('scroll', function () {
    const scrolled = $(window).scrollTop();
    $('.hero-bg-img').css('transform', `translateY(${scrolled * 0.3}px)`);
  });

  // ---- TILT EFFECT on Project Cards ----
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      if (window.innerWidth <= 991) return;
      const rect    = this.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  // ---- RIPPLE EFFECT on Buttons ----
  document.querySelectorAll('.btn-primary-glow, .btn-send-msg').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        background:rgba(255,255,255,0.25); pointer-events:none;
        transform:scale(0); animation:rippleAnim 0.6s linear;
        width:80px; height:80px;
        left:${e.clientX - rect.left - 40}px;
        top:${e.clientY - rect.top - 40}px;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // ---- NAVBAR ITEM HOVER GLOW ----
  $('.nav-link').on('mouseenter', function () {
    $(this).css('text-shadow', '0 0 20px rgba(124,58,237,0.4)');
  }).on('mouseleave', function () {
    $(this).css('text-shadow', '');
  });

  // ---- HERO AVATAR MOUSE PARALLAX ----
  $(document).on('mousemove', function (e) {
    const wrapper = $('.hero-avatar-wrapper');
    if (!wrapper.length) return;
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    wrapper.css('transform', `translate(${x}px, ${y}px)`);
  });

  // ---- Ripple & Error Keyframe injection ----
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }
    .field-error {
      border-color: #ef4444 !important;
      animation: fieldShake 0.4s ease;
    }
    @keyframes fieldShake {
      0%, 100% { transform: translateX(0); }
      25%       { transform: translateX(-8px); }
      75%       { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(styleTag);

  // ---- APPLY ADMIN EDITS (if customized via /admin-edit) ----
  function applyAdminEdits() {
    try {
      const raw = localStorage.getItem('harsh_portfolio_data');
      if (!raw) return;
      const data = JSON.parse(raw);

      // Hero
      if (data.heroDescription) $('.hero-description').text(data.heroDescription);
      if (data.monthsPromptEng) {
        const statEl = $('[data-stat="months-prompt-eng"]');
        if (statEl.length) statEl.attr('data-count', data.monthsPromptEng).text(data.monthsPromptEng);
      }

      // Services pricing
      if (data.basicPrice) $('.service-basic-price').text(data.basicPrice);
      if (data.completePrice) $('.service-complete-price').text(data.completePrice);
      if (data.deliveryTime) $('.service-delivery-time').text(data.deliveryTime);
      if (data.revisionCount) $('.service-revision-count').text(data.revisionCount);

      // Contact info
      if (data.whatsappNumber) {
        const waNum = data.whatsappNumber.replace(/[^0-9]/g, '');
        $('.whatsapp-float').attr('href', `https://wa.me/${waNum}?text=Hi%20Harsh%2C%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20website%20project.`);
        $('.btn-plan-basic').attr('href', `https://wa.me/${waNum}?text=Hi%20Harsh%2C%20I%20am%20interested%20in%20the%20Basic%20E-Commerce%20plan.`);
        $('.btn-plan-complete').attr('href', `https://wa.me/${waNum}?text=Hi%20Harsh%2C%20I%20am%20interested%20in%20the%20Complete%20E-Commerce%20plan.`);
      }
      if (data.email) {
        $('#contact-email').text(data.email).attr('href', 'mailto:' + data.email);
        $('[data-contact="email"]').attr('href', 'mailto:' + data.email);
      }
      if (data.phone) {
        $('[data-contact="phone"]').text(data.phone).attr('href', 'tel:' + data.phone.replace(/[^0-9+]/g, ''));
      }
      if (data.instagramUrl && data.instagramUrl.trim()) {
        $('[data-social="instagram"]').attr('href', data.instagramUrl).show();
      }
      if (data.demoStoreUrl && data.demoStoreUrl.trim()) {
        const demoBtn = $('#liveDemoStoreBtn');
        if (demoBtn.length) {
          demoBtn.replaceWith(`<a href="${data.demoStoreUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-glow btn-sm" id="liveDemoStoreBtn"><i class="fas fa-external-link-alt me-2"></i>View Live Demo</a>`);
        }
      }
    } catch (e) {
      console.warn('Could not apply local admin edits:', e);
    }
  }
  applyAdminEdits();

  // ---- INITIAL ACTIVE NAV ----
  $('#nav-home').addClass('active');

  console.log('%c👋 Hey! Welcome to Harsh\'s Portfolio', 'color:#7c3aed;font-size:18px;font-weight:bold;');
  console.log('%cBuilt with ❤️ using HTML, CSS, JavaScript, Bootstrap & jQuery', 'color:#06b6d4;font-size:12px;');
});
