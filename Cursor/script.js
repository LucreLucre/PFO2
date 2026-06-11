/**
 * Nova Solutions — Landing Page Scripts
 * Vanilla JS: navegación, scroll, validación de formulario
 */

(function () {
  'use strict';

  /* --- DOM References --- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const currentYearEl = document.getElementById('currentYear');

  /* --- Footer: año actual --- */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ============================================
     HEADER SCROLL EFFECT
     ============================================ */
  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ============================================
     MOBILE NAVIGATION
     ============================================ */
  function toggleNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('nav--open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('nav--open');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('nav--open')) {
      closeNav();
      navToggle.focus();
    }
  });

  /* ============================================
     ACTIVE NAV LINK ON SCROLL
     ============================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.nav__link[href="#' + id + '"]');

      if (link && scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (l) { l.classList.remove('nav__link--active'); });
        link.classList.add('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ============================================
     SMOOTH SCROLL (fallback para anchors)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ============================================
     SCROLL REVEAL ANIMATION
     ============================================ */
  const revealElements = document.querySelectorAll(
    '.about__card, .service-card, .testimonial-card, .section__header, .contact__info, .contact__form'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  /* ============================================
     FORM VALIDATION
     ============================================ */
  const validators = {
    nombre: function (value) {
      if (!value.trim()) return 'El nombre es obligatorio.';
      if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
      return '';
    },
    email: function (value) {
      if (!value.trim()) return 'El correo electrónico es obligatorio.';
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return 'Ingresa un correo electrónico válido.';
      return '';
    },
    empresa: function () {
      return '';
    },
    mensaje: function (value) {
      if (!value.trim()) return 'El mensaje es obligatorio.';
      if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      return '';
    }
  };

  function showFieldError(fieldName, message) {
    var input = document.getElementById(fieldName);
    var errorEl = document.getElementById('error-' + fieldName);

    if (message) {
      input.classList.add('form-input--error');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      input.classList.remove('form-input--error');
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }
  }

  function validateField(fieldName) {
    var input = document.getElementById(fieldName);
    var error = validators[fieldName](input.value);
    showFieldError(fieldName, error);
    return !error;
  }

  Object.keys(validators).forEach(function (fieldName) {
    var input = document.getElementById(fieldName);
    if (!input) return;

    input.addEventListener('blur', function () {
      validateField(fieldName);
    });

    input.addEventListener('input', function () {
      if (input.classList.contains('form-input--error')) {
        validateField(fieldName);
      }
    });
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    formSuccess.hidden = true;

    var isValid = true;
    Object.keys(validators).forEach(function (fieldName) {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });

    if (!isValid) {
      var firstError = contactForm.querySelector('.form-input--error');
      if (firstError) firstError.focus();
      return;
    }

    formSuccess.hidden = false;
    contactForm.reset();

    Object.keys(validators).forEach(function (fieldName) {
      showFieldError(fieldName, '');
    });

    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

})();
