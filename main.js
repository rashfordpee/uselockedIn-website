
/*
  main.js
  Extracted JS from single-file HTML.
  - Uses defensive checks so it won't crash if elements are missing (useful for components or partial rendering)
  - DOMContentLoaded is used to ensure elements are present before we attach listeners
*/

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // ---------- Rotating hero text ----------
    const words = ['wrong', 'dumb', 'outdated', 'uninformed'];
    const rotatingWord = document.getElementById('rotatingWord');
    let currentIndex = 0;

    if (rotatingWord) {
      function rotateWord() {
        currentIndex = (currentIndex + 1) % words.length;
        rotatingWord.textContent = words[currentIndex];
      }
      // rotate every 3s
      setInterval(rotateWord, 3000);
    }

    // ---------- Mobile navigation ----------
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('navOverlay');
    const hamburgerIcon = hamburger ? hamburger.querySelector('span') : null;
    let isMenuOpen = false;

    if (hamburger && navOverlay && hamburgerIcon) {
      hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navOverlay.classList.toggle('active', isMenuOpen);
        hamburgerIcon.textContent = isMenuOpen ? '✕' : '☰';
        hamburger.setAttribute('aria-expanded', String(isMenuOpen));
      });
    }

    // ---------- Page overlay open/close helpers ----------
    function openPage(pageId) {
      const el = document.getElementById(pageId);
      if (!el) return;
      el.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closePage(pageId) {
      const el = document.getElementById(pageId);
      if (!el) return;
      el.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    // ---------- Media and Chef links (open overlays) ----------
    const mediaLink = document.getElementById('mediaLink');
    const chefLink = document.getElementById('chefLink');

    if (mediaLink) {
      mediaLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPage('mediaPage');
        // Close hamburger menu if open
        isMenuOpen = false;
        navOverlay && navOverlay.classList.remove('active');
        if (hamburgerIcon) hamburgerIcon.textContent = '☰';
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
      });
    }

    if (chefLink) {
      chefLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPage('chefPage');
        isMenuOpen = false;
        navOverlay && navOverlay.classList.remove('active');
        if (hamburgerIcon) hamburgerIcon.textContent = '☰';
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
      });
    }

    // ---------- Close buttons for overlays (delegated) ----------
    document.querySelectorAll('.close-btn').forEach(btn => {
      const pageId = btn.getAttribute('data-close');
      if (!pageId) return;
      btn.addEventListener('click', () => closePage(pageId));
    });

    // ---------- Close menu when clicking on nav links (except the special ones) ----------
    if (navOverlay) {
      navOverlay.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && !e.target.id.includes('Link')) {
          isMenuOpen = false;
          navOverlay.classList.remove('active');
          if (hamburgerIcon) hamburgerIcon.textContent = '☰';
          hamburger && hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // ---------- FAQ accordion ----------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQ = otherItem.querySelector('.faq-question');
            otherQ && otherQ.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
        question.setAttribute('aria-expanded', String(!isActive));
      });

      // Keyboard accessibility
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });

    // ---------- Theme toggle ----------
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // Default to saved theme or light
    try {
      const savedTheme = localStorage?.getItem('theme') || 'light';
      htmlEl.setAttribute('data-theme', savedTheme);
      if (themeToggle) themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    } catch (err) {
      // localStorage might be unavailable in some embed contexts
      htmlEl.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        try { localStorage.setItem('theme', newTheme); } catch (e) { /* ignore */ }
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      });
    }

    // ---------- Platform icon keyboard accessibility ----------
    document.querySelectorAll('.platform-icon').forEach(icon => {
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          icon.click();
        }
      });
    });

    // ---------- Escape to close overlays ----------
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.page-overlay.active').forEach(page => {
          page.classList.remove('active');
          document.body.style.overflow = 'auto';
        });
      }
    });

    // ---------- Smooth scrolling for internal anchors ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        // If the link is meant to open our overlay (media/chef), those handlers are already present and called before.
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });

    // ---------- IntersectionObserver for animations (respects prefers-reduced-motion) ----------
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          }
        });
      }, observerOptions);

      document.querySelectorAll('.audience-card, .reason, .testimonial').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      });
    }

    // ---------- External link security hardening ----------
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.setAttribute('rel', 'noopener noreferrer');

      link.addEventListener('click', (e) => {
        try {
          const allowedDomains = [
            'chrome.google.com',
            'microsoftedge.microsoft.com',
            'addons.opera.com',
            'linkedin.com'
          ];
          const url = new URL(link.href);
          if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
            e.preventDefault();
            console.warn('Blocked potentially unsafe external link:', link.href);
            return false;
          }
        } catch (error) {
          console.warn('Could not validate external link:', error);
          e.preventDefault();
          return false;
        }
      });
    });

    // ---------- Utility: sanitizeHTML (defense-in-depth) ----------
    function sanitizeHTML(str) {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    }

    // ---------- Utility: secureStorageCheck ----------
    function secureStorageCheck() {
      try {
        if (typeof Storage === 'undefined') {
          console.warn('Local storage not available - theme preferences will not persist');
          return false;
        }
        return true;
      } catch (error) {
        console.warn('Storage access error:', error);
        return false;
      }
    }

    // ---------- Focus styles injection for accessibility ----------
    (function injectFocusStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .platform-icon:focus, .faq-question:focus, .hamburger:focus, .theme-toggle:focus, .close-btn:focus { outline: 2px solid var(--accent-blue); outline-offset: 2px; }
        .nav-overlay a:focus { outline: 2px solid var(--accent-blue); outline-offset: 4px; }
      `;
      document.head.appendChild(style);
    }());

    // ---------- Lazy-load placeholder images (if any are added later) ----------
    function lazyLoadImages() {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      images.forEach(img => imageObserver.observe(img));
    }

    if (document.querySelectorAll('img[data-src]').length > 0) {
      lazyLoadImages();
    }

    // ---------- Final init ----------
    secureStorageCheck();

  }); // DOMContentLoaded

})();
