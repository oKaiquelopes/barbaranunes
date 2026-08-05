/* ==========================================================================
   Barbara Nunes — Método Presença
   JavaScript puro — sem dependências
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setYear();
    initHeaderScroll();
    initMobileNav();
    initRevealObserver();
    initAccordion();
    initScrollProgress();
    initHeroThread();
    initSmoothAnchors();
  }

  /* Ano dinâmico no rodapé */
  function setYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* Header muda de estilo ao rolar */
  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* Menu mobile */
  function initMobileNav() {
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Fade-in dos elementos conforme aparecem na tela */
  function initRevealObserver() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = (index % 4) * 90;
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* Accordion do FAQ */
  function initAccordion() {
    var triggers = document.querySelectorAll('.accordion__trigger');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      var panel = trigger.nextElementSibling;
      panel.style.maxHeight = '0px';

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Fecha os outros itens do mesmo grupo
        triggers.forEach(function (other) {
          if (other !== trigger) {
            other.setAttribute('aria-expanded', 'false');
            other.nextElementSibling.style.maxHeight = '0px';
          }
        });

        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
      });
    });

    // Recalcula altura ao redimensionar, caso um painel esteja aberto
    window.addEventListener('resize', function () {
      triggers.forEach(function (trigger) {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          var panel = trigger.nextElementSibling;
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* Barra de progresso de leitura no topo */
  function initScrollProgress() {
    var fill = document.getElementById('progressFill');
    if (!fill) return;

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      fill.style.width = progress + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* Anima o "fio" dourado do hero assim que a página carrega */
  function initHeroThread() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    requestAnimationFrame(function () {
      setTimeout(function () {
        hero.classList.add('is-loaded');
      }, 250);
    });
  }

  /* Scroll suave para links internos (fallback além do CSS scroll-behavior) */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var headerOffset = 90;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }
})();
