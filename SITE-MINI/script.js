/* ══════════════════════════════════════════════
   Tom Legrand Jardin & Services — Paysagiste
   Scripts (carousel, nav, burger, formulaire, anim)
   ══════════════════════════════════════════════ */

// ── Nav scrolled effect ──
(function() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
      ? 'rgba(15, 61, 7, 0.98)'
      : 'rgba(15, 61, 7, 0.92)';
  }, { passive: true });
})();


// ── Burger menu mobile ──
(function() {
  const burger = document.getElementById('burger');
  const liens  = document.querySelector('.nav-liens');
  if (!burger || !liens) return;

  let open = false;

  burger.addEventListener('click', () => {
    open = !open;
    liens.style.display = open ? 'flex' : 'none';
    if (open) {
      const navH = document.getElementById('nav').offsetHeight;
      liens.style.flexDirection = 'column';
      liens.style.position      = 'fixed';
      liens.style.top           = navH + 'px';
      liens.style.left          = '0';
      liens.style.right         = '0';
      liens.style.background    = 'rgba(15,61,7,0.98)';
      liens.style.padding       = '20px 24px';
      liens.style.gap           = '16px';
      liens.style.backdropFilter = 'blur(12px)';
      liens.style.zIndex         = '99';
    }
  });

  liens.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      liens.style.display = '';
    });
  });
})();


// ── Formulaire de contact → devis-mailer ──
(function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const btn = form.querySelector('.form-submit');
  const TIMEOUT_MS = 60000; // 60s pour laisser le temps au cold start Render

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nom   = form.querySelector('#nom').value.trim();
    const tel   = form.querySelector('#telephone').value.trim();
    const email = form.querySelector('#email').value.trim();
    const msg   = form.querySelector('#message').value.trim();

    if (!nom || !tel || !email || !msg) {
      showMsg('error', 'Merci de remplir les champs obligatoires : Nom, Téléphone, Email et Projet.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-dasharray="60 20"/></svg> Envoi en cours…';
    showMsg('info', '⏳ Envoi en cours, merci de patienter (peut prendre quelques secondes)…');

    const data = {
      nom:       nom,
      prenom:    form.querySelector('#prenom').value.trim(),
      telephone: tel,
      email:     email,
      service:   form.querySelector('#service').value,
      message:   msg,
    };

    const controller = new AbortController();
    const timer = setTimeout(function() { controller.abort(); }, TIMEOUT_MS);

    fetch(form.action, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    })
    .then(function(res) {
      clearTimeout(timer);
      return res.json().then(function(body) {
        if (res.ok && (body.ok || body.success)) {
          showMsg('success', '✓ Merci ' + nom + ' ! Votre demande a bien été envoyée. Tom vous recontactera très prochainement.');
          form.reset();
        } else {
          throw new Error(body.error || 'Erreur lors de l\'envoi');
        }
      });
    })
    .catch(function(err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        showMsg('error', 'Le serveur met trop de temps à répondre. Merci d\'appeler directement Tom au 06 24 79 78 72 ou d\'envoyer un email à tl-jardins-services@outlook.fr');
      } else {
        showMsg('error', 'Une erreur est survenue. Merci de réessayer ou d\'appeler directement le 06 24 79 78 72.');
      }
    })
    .finally(function() {
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg> Envoyer ma demande';
    });
  });

  function showMsg(type, text) {
    let el = form.querySelector('.form-message');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-message';
      form.insertBefore(el, btn);
    }
    el.textContent = text;
    el.style.cssText = 'padding:12px 16px;border-radius:8px;margin:0 0 12px;font-weight:500;font-size:14px;line-height:1.5;';
    if (type === 'success') {
      el.style.background = '#f0fdf4';
      el.style.color      = '#166534';
      el.style.border     = '1px solid #bbf7d0';
    } else if (type === 'info') {
      el.style.background = 'rgba(151,196,89,0.12)';
      el.style.color      = '#c0dd97';
      el.style.border     = '1px solid rgba(151,196,89,0.3)';
    } else {
      el.style.background = '#fef2f2';
      el.style.color      = '#991b1b';
      el.style.border     = '1px solid #fecaca';
    }
  }
})();


// ── Animation entrée au scroll (Intersection Observer) ──
(function() {
  const elements = document.querySelectorAll(
    '.service-carte, .chiffre-carte, .avis-carte, .atout, .galerie-item'
  );
  if (!elements.length) return;

  elements.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 60 * i);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();