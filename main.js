/*
  main.js - UPDATED for Lucide Icons & Enhanced Functionality
  
  MAJOR CHANGES:
  1. Updated hamburger menu to work with SVG icons instead of text emojis
  2. Enhanced theme toggle to switch between moon and sun SVG icons
  3. Added icon animation support and intersection observers
  4. Updated all emoji-based selectors to work with new icon system
  5. Added keyboard navigation enhancements for SVG icons
  6. Improved accessibility features for icon-based interactions
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

    // ========================================
    // UPDATED: MOBILE NAVIGATION WITH SVG ICONS
    // Now handles SVG icon switching instead of emoji text
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('navOverlay');
    const hamburgerIcon = hamburger ? hamburger.querySelector('.icon') : null;
    let isMenuOpen = false;

    // SVG path constants for menu icons
    const MENU_ICON_PATHS = `
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    `;
    
    const CLOSE_ICON_PATHS = `
      <path d="m18 6-12 12"/>
      <path d="m6 6 12 12"/>
    `;

    if (hamburger && navOverlay && hamburgerIcon) {
      hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navOverlay.classList.toggle('active', isMenuOpen);
        
        // UPDATED: Switch SVG paths instead of text content
        hamburgerIcon.innerHTML = isMenuOpen ? CLOSE_ICON_PATHS : MENU_ICON_PATHS;
        hamburger.setAttribute('aria-expanded', String(isMenuOpen));
        
        // Add visual feedback with animation
        hamburgerIcon.style.transform = 'rotate(180deg)';
        setTimeout(() => {
          hamburgerIcon.style.transform = 'rotate(0deg)';
        }, 300);
      });
    }

    // ---------- Page overlay open/close helpers ----------
    function openPage(pageId) {
      const el = document.getElementById(pageId);
      if (!el) return;
      el.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus management for accessibility
      const firstFocusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    function closePage(pageId) {
      const el = document.getElementById(pageId);
      if (!el) return;
      el.classList.remove('active');
      document.body.style.overflow = 'auto';
      
      // Return focus to trigger element if available
      const triggerElement = document.querySelector(`[data-opens="${pageId}"]`);
      if (triggerElement) {
        triggerElement.focus();
      }
    }

    // ---------- Media and Chef links (open overlays) ----------
    const mediaLink = document.getElementById('mediaLink');
    const chefLink = document.getElementById('chefLink');

    if (mediaLink) {
      mediaLink.setAttribute('data-opens', 'mediaPage'); // For focus management
      mediaLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPage('mediaPage');
        // Close hamburger menu if open
        isMenuOpen = false;
        navOverlay && navOverlay.classList.remove('active');
        if (hamburgerIcon) hamburgerIcon.innerHTML = MENU_ICON_PATHS;
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
      });
    }

    if (chefLink) {
      chefLink.setAttribute('data-opens', 'chefPage'); // For focus management
      chefLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPage('chefPage');
        isMenuOpen = false;
        navOverlay && navOverlay.classList.remove('active');
        if (hamburgerIcon) hamburgerIcon.innerHTML = MENU_ICON_PATHS;
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
      });
    }

    // ---------- Close buttons for overlays (delegated) ----------
    document.querySelectorAll('.close-btn').forEach(btn => {
      const pageId = btn.getAttribute('data-close');
      if (!pageId) return;
      btn.addEventListener('click', () => closePage(pageId));
      
      // Enhanced keyboard support for close buttons
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closePage(pageId);
        }
      });
    });

    // ---------- Close menu when clicking on nav links (except the special ones) ----------
    if (navOverlay) {
      navOverlay.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && !e.target.id.includes('Link')) {
          isMenuOpen = false;
          navOverlay.classList.remove('active');
          if (hamburgerIcon) hamburgerIcon.innerHTML = MENU_ICON_PATHS;
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

        // Close other items with smooth animation
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

    // ========================================
    // UPDATED: ADVANCED THEME TOGGLE WITH SVG ICONS
    // Now properly switches between moon and sun SVG icons
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // Get theme icon elements
    const moonIcon = themeToggle ? themeToggle.querySelector('.moon-icon') : null;
    const sunIcon = themeToggle ? themeToggle.querySelector('.sun-icon') : null;

    // Initialize theme based on saved preference or system preference
    function initializeTheme() {
      let savedTheme;
      try {
        savedTheme = localStorage?.getItem('theme');
      } catch (err) {
        console.warn('localStorage not available, using system preference');
        savedTheme = null;
      }

      // If no saved theme, check system preference
      if (!savedTheme) {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = systemPrefersDark ? 'dark' : 'light';
      }

      // Apply theme
      htmlEl.setAttribute('data-theme', savedTheme);
      updateThemeIcons(savedTheme);
      
      // Add smooth transition after initial load
      setTimeout(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      }, 100);
    }

    // Update theme icon visibility and aria-label
    function updateThemeIcons(theme) {
      if (!moonIcon || !sunIcon || !themeToggle) return;
      
      if (theme === 'dark') {
        // Dark mode: show sun icon (to switch to light)
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      } else {
        // Light mode: show moon icon (to switch to dark)
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }

    // Theme toggle click handler
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        htmlEl.setAttribute('data-theme', newTheme);
        updateThemeIcons(newTheme);
        
        // Save preference
        try { 
          localStorage.setItem('theme', newTheme); 
        } catch (e) { 
          console.warn('Could not save theme preference:', e);
        }
        
        // Add rotation animation to theme toggle
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
        
        // Announce theme change to screen readers
        const announcement = newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
        announceToScreenReader(announcement);
      });
      
      // Keyboard support for theme toggle
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          themeToggle.click();
        }
      });
    }

    // Initialize theme on load
    initializeTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if user hasn't manually set a preference
      try {
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          htmlEl.setAttribute('data-theme', newTheme);
          updateThemeIcons(newTheme);
        }
      } catch (err) {
        // localStorage not available, ignore
      }
    });

    // ========================================
    // UPDATED: PLATFORM ICON INTERACTIONS
    // Enhanced keyboard and hover support for new SVG icons
    // ========================================
    document.querySelectorAll('.platform-icon').forEach(icon => {
      // Enhanced keyboard navigation
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          icon.click();
        }
      });
      
      // Add ripple effect on click for better feedback
      icon.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(59, 130, 246, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        ripple.style.pointerEvents = 'none';
        
        const iconRect = icon.getBoundingClientRect();
        icon.style.position = 'relative';
        icon.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      
      // Add hover sound effect (optional - only if audio is enabled)
      icon.addEventListener('mouseenter', () => {
        // Could add subtle sound effect here if desired
        icon.style.transform = 'scale(1.05)';
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
      });
    });

    // ---------- Escape to close overlays ----------
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open overlays
        document.querySelectorAll('.page-overlay.active').forEach(page => {
          const pageId = page.id;
          closePage(pageId);
        });
        
        // Close mobile menu if open
        if (isMenuOpen) {
          isMenuOpen = false;
          navOverlay && navOverlay.classList.remove('active');
          if (hamburgerIcon) hamburgerIcon.innerHTML = MENU_ICON_PATHS;
          hamburger && hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // ---------- Smooth scrolling for internal anchors ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth' 
        });
        
        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
        setTimeout(() => target.removeAttribute('tabindex'), 1000);
      });
    });

    // ========================================
    // ENHANCED: INTERSECTION OBSERVER FOR ANIMATIONS
    // Now includes icon-specific animations
    // ========================================
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observerOptions = { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            
            // Add special icon animations when elements come into view
            const icons = entry.target.querySelectorAll('.icon');
            icons.forEach((icon, index) => {
              setTimeout(() => {
                icon.style.animation = 'iconFadeIn 0.5s ease forwards';
              }, index * 100);
            });
          }
        });
      }, observerOptions);

      // Observe animated elements
      document.querySelectorAll('.audience-card, .reason, .testimonial').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      });
      
      // Observe platform icons for entrance animations
      document.querySelectorAll('.platform-icon').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }

    // ========================================
    // ENHANCED: EXTERNAL LINK SECURITY
    // Updated to work with new icon-based links
    // ========================================
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.setAttribute('rel', 'noopener noreferrer');

      link.addEventListener('click', (e) => {
        try {
          const allowedDomains = [
            'chrome.google.com',
            'microsoftedge.microsoft.com',
            'addons.opera.com',
            'linkedin.com',
            'youtube.com',
            'youtu.be'
          ];
          const url = new URL(link.href);
          if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
            e.preventDefault();
            console.warn('Blocked potentially unsafe external link:', link.href);
            
            // Show user-friendly message
            announceToScreenReader('Link blocked for security reasons');
            return false;
          }
        } catch (error) {
          console.warn('Could not validate external link:', error);
          e.preventDefault();
          return false;
        }
      });
    });

    // ========================================
    // NEW: UTILITY FUNCTIONS
    // ========================================
    
    // Announce messages to screen readers
    function announceToScreenReader(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }

    // Sanitize HTML (defense-in-depth)
    function sanitizeHTML(str) {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    }

    // Check storage availability
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

    // ========================================
    // NEW: ICON ANIMATIONS KEYFRAMES (injected via JS)
    // ========================================
    function injectIconAnimations() {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes iconFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        
        /* Icon hover effects */
        .audience-icon:hover .icon {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
        
        .platform-icon:hover .icon {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
        
        /* Theme toggle animation */
        .theme-toggle {
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        /* Enhanced focus styles for icons */
        .icon:focus-visible {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    }

    // ========================================
    // ENHANCED: LAZY LOADING WITH ICON SUPPORT
    // ========================================
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

    // YouTube video lazy loading (if implemented)
    function lazyLoadVideos() {
      const videoContainers = document.querySelectorAll('.video-container[data-video-id]');
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const container = entry.target;
            const videoId = container.dataset.videoId;
            if (videoId && videoId !== 'YOUR_VIDEO_ID') {
              const iframe = container.querySelector('iframe');
              if (iframe && iframe.src.includes('YOUR_VIDEO_ID')) {
                iframe.src = iframe.src.replace('YOUR_VIDEO_ID', videoId);
              }
            }
            videoObserver.unobserve(container);
          }
        });
      });
      videoContainers.forEach(container => videoObserver.observe(container));
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    // Inject icon animations
    injectIconAnimations();
    
    // Initialize lazy loading
    if (document.querySelectorAll('img[data-src]').length > 0) {
      lazyLoadImages();
    }
    
    // Initialize video lazy loading
    lazyLoadVideos();
    
    // Final security and storage check
    secureStorageCheck();
    
    // Log successful initialization (remove in production)
    console.log('LockedIn site initialized with Lucide icons support');

  }); // DOMContentLoaded

})();