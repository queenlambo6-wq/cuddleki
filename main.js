function initApp() {
  // Menú móvil
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Filtros de la página de gatitos
  const grid = document.getElementById('kgrid');
  if (grid) {
    const state = { breed: 'all', sex: 'all' };
    const apply = () => {
      let n = 0;
      grid.querySelectorAll('.kmini').forEach(card => {
        const show = (state.breed === 'all' || card.dataset.breed === state.breed) &&
                     (state.sex === 'all' || card.dataset.sex === state.sex);
        card.hidden = !show;
        if (show) n++;
      });
      const countEl = document.getElementById('kcount');
      if (countEl) countEl.textContent = String(n);
    };
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = 'breed' in chip.dataset ? 'breed' : 'sex';
        chip.parentElement?.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state[key] = chip.dataset[key];
        apply();
      });
    });
    const pre = new URLSearchParams(location.search).get('raza');
    if (pre) document.querySelector(`.chip[data-breed="${pre}"]`)?.click();
  }

  // Ampliar fotos
  const lb = document.querySelector('.lightbox');
  if (lb) {
    document.querySelectorAll('img[data-zoom]').forEach(img => {
      img.addEventListener('click', () => {
        const lbImg = lb.querySelector('img');
        if (lbImg) {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
        }
        lb.hidden = false;
      });
    });
    lb.addEventListener('click', e => { 
      if (e.target !== lb.querySelector('img')) lb.hidden = true; 
    });
    document.addEventListener('keydown', e => { 
      if (e.key === 'Escape' && lb) lb.hidden = true; 
    });
  }

  // Formulario de contacto → WhatsApp o email (sitio estático, sin servidor)
  const form = document.getElementById('contact-form');
  if (form && window.SITE_CONTACT) {
    const C = window.SITE_CONTACT;
    const q = new URLSearchParams(location.search);
    if (q.get('gatito') && form.gatito) form.gatito.value = q.get('gatito');
    if (q.get('raza') && form.raza) form.raza.value = q.get('raza');
    if (q.get('adoptar') && form.mensaje) form.mensaje.value = 'Me gustaría adoptar a este gatito. ¿Cuáles son los siguientes pasos?';
    if (q.get('gatito')) setTimeout(() => document.getElementById('contacto')?.scrollIntoView(), 50);

    let via = 'wa';
    form.querySelectorAll('button[type=submit]').forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const required = ['nombre', 'apellidos', 'email', 'telefono'];
      let ok = true;
      required.forEach(n => {
        const el = form[n];
        if (!el) return;
        const bad = !el.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
        el.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      const errorEl = form.querySelector('.form-error');
      if (errorEl) errorEl.hidden = ok;
      if (!ok) return;

      const f = n => form[n] ? form[n].value.trim() : '';
      const lines = [
        `Hola ${C.name}, quiero hacer una consulta:`,
        `Nombre: ${f('nombre')} ${f('apellidos')}`,
        `Email: ${f('email')}`,
        `Teléfono: ${f('telefono')}`,
        f('ciudad') && `Ciudad: ${f('ciudad')}`,
        f('raza') && `Raza de interés: ${C.breeds?.[f('raza')] || 'No estoy seguro'}`,
        f('gatito') && `Gatito: ${f('gatito')}`,
        f('mensaje') && `Mensaje: ${f('mensaje')}`,
      ].filter(Boolean).join('\n');

      if (via === 'mail') {
        location.href = `mailto:${C.email}?subject=${encodeURIComponent('Consulta de adopción - ' + f('nombre'))}&body=${encodeURIComponent(lines)}`;
      } else {
        const link = document.createElement('a');
        link.href = `https://wa.me/${C.wa}?text=${encodeURIComponent(lines)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }

  // Filtros de testimonios
  const tfilters = document.getElementById('tfilters');
  if (tfilters) {
    const tcards = document.querySelectorAll('.tcard[data-breed]');
    const tcount = document.getElementById('tcount');
    tfilters.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        tfilters.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const b = btn.dataset.tbreed;
        let count = 0;
        tcards.forEach(card => {
          const match = b === 'all' || card.dataset.breed === b;
          card.style.display = match ? '' : 'none';
          if (match) count++;
        });
        if (tcount) tcount.textContent = String(count);
      });
    });
  }

  // Formulario de opiniones → WhatsApp o email
  const review = document.getElementById('review-form');
  if (review && window.SITE_CONTACT) {
    const C = window.SITE_CONTACT;
    let via = 'wa';
    review.querySelectorAll('button[type=submit]').forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
    review.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      ['nombre', 'gatito', 'opinion'].forEach(n => {
        const el = review[n];
        if (!el) return;
        const bad = !el.value.trim();
        el.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      const errEl = review.querySelector('.form-error');
      if (errEl) errEl.hidden = ok;
      if (!ok) return;

      const f = n => review[n] ? review[n].value.trim() : '';
      const text = [
        `Hola ${C.name}, quiero dejar mi opinión:`,
        `Nombre: ${f('nombre')}`,
        f('ciudad') && `Ciudad: ${f('ciudad')}`,
        `Gatito: ${f('gatito')}`,
        `Valoración: ${'★'.repeat(+f('estrellas') || 5)}`,
        `Opinión: ${f('opinion')}`,
        'Autorizo a publicar esta opinión en la web.',
      ].filter(Boolean).join('\n');

      // Prepend review into testimonials list for instant feedback
      const tgrid = document.querySelector('.tgrid');
      if (tgrid) {
        const starsNum = +f('estrellas') || 5;
        const newCard = document.createElement('article');
        newCard.className = 'tcard';
        newCard.dataset.breed = 'all';
        newCard.innerHTML = `
          <div class="tcard-rating-row">
            <span class="stars">${'★'.repeat(starsNum)}</span>
            <span class="tcard-date">Hace unos momentos</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <span class="badge-verified"><svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg> Adopción Verificada</span>
          </div>
          <h3 class="tcard-title">«${f('opinion').slice(0, 42)}${f('opinion').length > 42 ? '...' : ''}»</h3>
          <p class="tcard-text">${f('opinion')}</p>
          <div class="tcard-footer">
            <div class="tcard-adopter">
              <div class="tcard-avatar">${f('nombre').charAt(0).toUpperCase()}</div>
              <div class="tcard-adopter-info">
                <strong>${f('nombre')}</strong>
                <span>${f('ciudad') ? f('ciudad') + ' · ' : ''}Familia Gatitoselite</span>
              </div>
            </div>
            <span class="tcard-kitten-pill">Gatito: ${f('gatito')}</span>
          </div>
        `;
        tgrid.prepend(newCard);
      }

      const successNotice = document.createElement('div');
      successNotice.style.cssText = 'background:var(--green-soft); color:var(--green); padding:16px 20px; border-radius:12px; font-weight:600; margin-top:16px; border:1px solid #c2d8c9;';
      successNotice.innerHTML = '¡Muchísimas gracias por tu opinión! Se ha enviado correctamente y publicado en la sección.';
      review.appendChild(successNotice);
      setTimeout(() => successNotice.remove(), 7000);

      if (via === 'mail') {
        location.href = `mailto:${C.email}?subject=${encodeURIComponent('Opinión de ' + f('nombre'))}&body=${encodeURIComponent(text)}`;
      } else {
        const link = document.createElement('a');
        link.href = `https://wa.me/${C.wa}?text=${encodeURIComponent(text)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
