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
    initContactForm();
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

  /* Formulário de contato — validação amigável + envio direto pelo WhatsApp */
  function initContactForm() {
    var form = document.getElementById('contatoForm');
    if (!form) return;

    var whatsInput = document.getElementById('contatoWhats');
    if (whatsInput) {
      whatsInput.addEventListener('input', function () {
        whatsInput.value = maskPhoneBR(whatsInput.value);
      });
    }

    var requiredFields = {
      contatoNome: 'Quero saber como te chamar. Preencha este campo antes de continuar.',
      contatoWhats: 'Preciso de um WhatsApp para poder te responder com carinho.',
      contatoMotivo: 'Me conte um pouco do que te trouxe até aqui.',
      contatoNecessidade: 'Compartilhe comigo o que você sente que mais precisa agora.'
    };

    Object.keys(requiredFields).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('input', function () {
        clearFieldError(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      var firstInvalid = null;

      Object.keys(requiredFields).forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;

        var value = input.value.trim();
        var isPhone = id === 'contatoWhats';
        var phoneDigits = value.replace(/\D/g, '');
        var isEmpty = !value || (isPhone && phoneDigits.length < 10);

        if (isEmpty) {
          isValid = false;
          setFieldError(input, requiredFields[id]);
          if (!firstInvalid) firstInvalid = input;
        } else {
          clearFieldError(input);
        }
      });

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var nome = document.getElementById('contatoNome').value.trim();
      var whatsapp = document.getElementById('contatoWhats').value.trim();
      var motivo = document.getElementById('contatoMotivo').value.trim();
      var necessidade = document.getElementById('contatoNecessidade').value.trim();
      var porqueEl = document.getElementById('contatoPorque');
      var porque = porqueEl ? porqueEl.value.trim() : '';

      var linhas = [
        'Olá, Bárbara! Meu nome é ' + nome + '.',
        '',
        'Meu WhatsApp é: ' + whatsapp,
        '',
        'O que me trouxe até aqui:',
        motivo,
        '',
        'O que sinto que mais preciso neste momento:',
        necessidade
      ];

      if (porque) {
        linhas.push('', 'Por que sinto que esse trabalho pode ser para mim:', porque);
      }

      linhas.push('', 'Gostaria de conversar sobre a Dança Divina Integrativa.');

      var mensagem = linhas.join('\n');
      var numeroWhatsapp = '5511981236416';
      var url = 'https://wa.me/' + numeroWhatsapp + '?text=' + encodeURIComponent(mensagem);

      window.open(url, '_blank', 'noopener');
    });
  }

  function setFieldError(input, message) {
    var wrapper = input.closest('.contato__field');
    if (!wrapper) return;
    wrapper.classList.add('is-invalid');
    var hint = wrapper.querySelector('.contato__hint');
    if (hint) hint.textContent = message;
  }

  function clearFieldError(input) {
    var wrapper = input.closest('.contato__field');
    if (!wrapper) return;
    wrapper.classList.remove('is-invalid');
    var hint = wrapper.querySelector('.contato__hint');
    if (hint) hint.textContent = '';
  }

  /* Máscara de telefone brasileiro: (00) 00000-0000 */
  function maskPhoneBR(value) {
    var digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, '($1');
    if (digits.length <= 6) return digits.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
    if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
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
