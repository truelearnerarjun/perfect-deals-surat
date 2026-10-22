/**
 * Perfect Deals Surat — Main Client Script
 * Handles Navigation, Filtering, Modals, Search, Video Reels, and Calculators
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initPreviewCountdown();
  initPropertiesGrid();
  initSearchWidget();
  initVideoModals();
  initContactForm();
  initEmiCalculator();
});

/* ============================================================
   1. NAVBAR CONTROLLER
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================================
   2. MOBILE NAV DRAWER
   ============================================================ */
function initMobileNav() {
  const openBtn = document.getElementById('mobileNavOpen');
  const closeBtn = document.getElementById('mobileNavClose');
  const drawer = document.getElementById('mobileNav');
  const backdrop = document.getElementById('navBackdrop');

  if (!openBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ============================================================
   3. PROPERTY GRID & FILTERING
   ============================================================ */
function initPropertiesGrid() {
  const gridContainer = document.getElementById('propertiesGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!gridContainer || typeof PROPERTIES_DATA === 'undefined') return;

  let currentCategory = 'all';

  function renderProperties(category = 'all', searchQuery = null) {
    let filtered = PROPERTIES_DATA;

    if (category !== 'all') {
      if (category === 'residential') {
        filtered = filtered.filter(p => p.category === 'residential');
      } else if (category === 'luxury') {
        filtered = filtered.filter(p => p.category === 'luxury' || (p.priceMin && p.priceMin >= 15000000));
      } else if (category === 'commercial') {
        filtered = filtered.filter(p => p.category === 'commercial');
      } else if (category === 'plots') {
        filtered = filtered.filter(p => p.category === 'plots');
      } else if (category === 'rent') {
        filtered = filtered.filter(p => p.intent === 'rent');
      }
    }

    if (searchQuery) {
      if (searchQuery.locality && searchQuery.locality !== 'all') {
        filtered = filtered.filter(p => p.locality.toLowerCase().includes(searchQuery.locality.toLowerCase()));
      }
      if (searchQuery.propertyType && searchQuery.propertyType !== 'all') {
        filtered = filtered.filter(p => p.category === searchQuery.propertyType || p.propertyType.toLowerCase().includes(searchQuery.propertyType.toLowerCase()));
      }
      if (searchQuery.budget && searchQuery.budget !== 'all') {
        const maxBudget = parseInt(searchQuery.budget, 10);
        if (maxBudget) {
          filtered = filtered.filter(p => p.priceMin <= maxBudget);
        }
      }
      if (searchQuery.intent && searchQuery.intent !== 'all') {
        filtered = filtered.filter(p => p.intent === searchQuery.intent);
      }
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;" class="glass-panel">
          <p style="font-size: 1.25rem; font-family: var(--font-serif); margin-bottom: 0.5rem; color: #fff;">No properties match your exact criteria.</p>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">We have off-market & newly launched options across Surat.</p>
          <a href="https://wa.me/919979641000?text=Hello%20Harsh%20bhai,%20I%20am%20looking%20for%20a%20property%20matching%20my%20specific%20requirements%20in%20Surat." target="_blank" rel="noopener" class="btn btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            Inquire via WhatsApp Directly
          </a>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(prop => `
      <article class="property-card" data-id="${prop.id}">
        <div class="property-card__thumb">
          <img src="${prop.images[0]}" alt="${prop.title} - ${prop.locality}" class="property-card__img" loading="lazy" />
          <span class="property-card__badge">${prop.badge}</span>
          <span class="property-card__price-tag">${prop.priceDisplay}</span>
        </div>
        <div class="property-card__body">
          <div class="property-card__location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${prop.locality}
          </div>
          <h3 class="property-card__title">
            <a href="property-detail.html?id=${prop.id}">${prop.title}</a>
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${prop.description}
          </p>
          <div class="property-card__specs">
            <div class="spec-item">
              <span class="spec-label">Type / BHK</span>
              <span class="spec-val">${prop.bhk}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Carpet Area</span>
              <span class="spec-val">${prop.carpetArea}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Possession</span>
              <span class="spec-val">${prop.possession.split(' ')[0]}</span>
            </div>
          </div>
          <div class="property-card__footer">
            <button type="button" class="btn btn-secondary quick-view-btn" data-id="${prop.id}" style="padding: 0.6rem 1rem; font-size: 0.74rem;">
              Quick View
            </button>
            <a href="https://wa.me/919979641000?text=${encodeURIComponent(`Hello Harsh bhai, I am interested in "${prop.title}" in ${prop.locality} (${prop.priceDisplay}). Please share more details.`)}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="padding: 0.6rem 1.15rem; font-size: 0.74rem;">
              WhatsApp
            </a>
          </div>
        </div>
      </article>
    `).join('');

    // Attach quick view handlers
    gridContainer.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.dataset.id;
        openPropertyModal(propId);
      });
    });
  }

  // Initial render
  renderProperties();

  // Filter button click handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      renderProperties(currentCategory);
    });
  });

  // Expose global search update
  window.filterPropertiesBySearch = (query) => {
    renderProperties('all', query);
  };
}

/* ============================================================
   4. SEARCH WIDGET CONTROLLER
   ============================================================ */
function initSearchWidget() {
  const form = document.getElementById('searchWidgetForm');
  const tabs = document.querySelectorAll('.search-widget__tab');
  let currentIntent = 'buy';

  if (!form) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentIntent = tab.dataset.intent;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const locality = form.elements['locality']?.value || 'all';
    const propertyType = form.elements['propertyType']?.value || 'all';
    const budget = form.elements['budget']?.value || 'all';

    const query = {
      intent: currentIntent,
      locality,
      propertyType,
      budget
    };

    // If on homepage with properties grid
    if (typeof window.filterPropertiesBySearch === 'function') {
      window.filterPropertiesBySearch(query);
      const targetSection = document.getElementById('featured-properties');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Redirect to buy.html with search parameters
      window.location.href = `buy.html?locality=${encodeURIComponent(locality)}&type=${encodeURIComponent(propertyType)}&budget=${encodeURIComponent(budget)}&intent=${encodeURIComponent(currentIntent)}`;
    }
  });
}

/* ============================================================
   5. PROPERTY QUICK VIEW MODAL
   ============================================================ */
function openPropertyModal(propId) {
  if (typeof PROPERTIES_DATA === 'undefined') return;
  const prop = PROPERTIES_DATA.find(p => p.id === propId);
  if (!prop) return;

  let modal = document.getElementById('propertyModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'propertyModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-container">
      <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">&times;</button>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2.25rem;">
        <div>
          <div style="aspect-ratio: 4 / 3; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1rem; border: 1px solid var(--border-medium);">
            <img id="modalMainImg" src="${prop.images[0]}" alt="${prop.title}" />
          </div>
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
            ${prop.images.map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i+1}" style="width: 70px; height: 50px; border-radius: 4px; cursor: pointer; border: 1px solid var(--border-light);" onclick="document.getElementById('modalMainImg').src='${img}'" />
            `).join('')}
          </div>
        </div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-size: 0.74rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--brand-gold-light); margin-bottom: 0.25rem;">
            ${prop.locality}
          </span>
          <h2 style="font-size: 1.85rem; color: #fff; margin-bottom: 0.5rem;">${prop.title}</h2>
          <div style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: var(--brand-crimson-light); margin-bottom: 1rem;">
            ${prop.priceDisplay}
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            ${prop.description}
          </p>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
            <p style="font-size: 0.78rem; color: var(--brand-gold); font-weight: 600; text-transform: uppercase; margin-bottom: 0.4rem;">Key Highlights:</p>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.35rem;">
              ${prop.highlights.slice(0, 4).map(h => `<li>• ${h}</li>`).join('')}
            </ul>
          </div>
          <div style="display: flex; gap: 0.75rem; margin-top: auto; flex-wrap: wrap;">
            <a href="property-detail.html?id=${prop.id}" class="btn btn-secondary" style="flex: 1;">Full Details</a>
            <a href="https://wa.me/919979641000?text=${encodeURIComponent(`Hello Harsh bhai, I am inquiring about "${prop.title}" in ${prop.locality} (${prop.priceDisplay}). Please share the brochure and arrange a site visit.`)}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="flex: 1.3;">
              Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modal.querySelector('#modalCloseBtn').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

/* ============================================================
   6. VIDEO REELS & MODAL PLAYER
   ============================================================ */
function initVideoModals() {
  const reelCards = document.querySelectorAll('.reel-card');
  if (reelCards.length === 0) return;

  let videoModal = document.getElementById('videoModal');
  if (!videoModal) {
    videoModal = document.createElement('div');
    videoModal.id = 'videoModal';
    videoModal.className = 'modal-overlay';
    videoModal.innerHTML = `
      <div class="modal-container" style="max-width: 650px; background: #000; border: 1px solid var(--border-gold); padding: 0;">
        <button class="modal-close-btn" id="videoModalCloseBtn" aria-label="Close video">&times;</button>
        <video id="modalVideoElement" controls playsinline autoplay style="width: 100%; max-height: 80vh; border-radius: var(--radius-lg);"></video>
        <div id="videoModalCaption" style="padding: 1rem 1.5rem; font-size: 0.95rem; color: #fff;"></div>
      </div>
    `;
    document.body.appendChild(videoModal);
  }

  const videoElement = document.getElementById('modalVideoElement');
  const captionElement = document.getElementById('videoModalCaption');
  const closeBtn = document.getElementById('videoModalCloseBtn');

  const closeVideo = () => {
    videoElement.pause();
    videoElement.src = '';
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
  });

  reelCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.videoSrc;
      const caption = card.dataset.caption || '';
      if (!src) return;

      videoElement.src = src;
      captionElement.textContent = caption;
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      videoElement.play().catch(() => {});
    });
  });
}

/* ============================================================
   7. CONTACT FORM CONTROLLER
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('leadGenForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value?.trim();
    const phone = form.elements['phone']?.value?.trim();
    const requirement = form.elements['requirement']?.value || 'Property Inquiry';
    const locality = form.elements['locality']?.value || 'Surat';
    const budget = form.elements['budget']?.value || 'Flexible';
    const message = form.elements['message']?.value?.trim() || '';

    // Validation
    if (!name || !phone) {
      showToast('Please provide your name and valid phone number.', 'error');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }

    // Compose formatted WhatsApp payload
    const text = `*New Real Estate Inquiry for Perfect Deals Surat*
━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📱 *Phone:* ${phone}
🏠 *Requirement:* ${requirement}
📍 *Preferred Locality:* ${locality}
💰 *Budget:* ${budget}
${message ? `📝 *Notes:* ${message}\n` : ''}━━━━━━━━━━━━━━━━━━━━
_Submitted via perfectdealssurat.com portal_`;

    const waUrl = `https://wa.me/919979641000?text=${encodeURIComponent(text)}`;

    showToast('Redirecting you to WhatsApp with your property details...', 'success');

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
    }, 800);
  });
}

/* ============================================================
   8. EMI LOAN CALCULATOR
   ============================================================ */
function initEmiCalculator() {
  const calcForm = document.getElementById('emiCalculatorForm');
  if (!calcForm) return;

  const amountInput = document.getElementById('loanAmount');
  const rateInput = document.getElementById('interestRate');
  const tenureInput = document.getElementById('loanTenure');

  const emiOutput = document.getElementById('emiResult');
  const totalInterestOutput = document.getElementById('totalInterestResult');
  const totalPaymentOutput = document.getElementById('totalPaymentResult');

  function calculate() {
    const p = parseFloat(amountInput.value) || 0;
    const r = (parseFloat(rateInput.value) || 8.5) / (12 * 100);
    const n = (parseFloat(tenureInput.value) || 20) * 12;

    if (p <= 0 || r <= 0 || n <= 0) return;

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    if (emiOutput) emiOutput.textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
    if (totalInterestOutput) totalInterestOutput.textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
    if (totalPaymentOutput) totalPaymentOutput.textContent = '₹' + Math.round(totalPayment).toLocaleString('en-IN');
  }

  [amountInput, rateInput, tenureInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculate);
  });

  calculate();
}

/* ============================================================
   9. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'info') {
  let toast = document.getElementById('antigravityToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'antigravityToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 0.85rem 1.65rem;
      background: var(--bg-glass-heavy);
      border: 1px solid var(--border-gold);
      color: #fff;
      font-size: 0.88rem;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-floating);
      z-index: 4000;
      backdrop-filter: blur(14px);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.borderColor = type === 'error' ? 'var(--brand-crimson)' : 'var(--brand-gold)';
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3500);
}

/* ============================================================
   10. 3-HOUR TEMPORARY LIVE SESSION TIMER
   ============================================================ */
function initPreviewCountdown() {
  const timerDisplay = document.getElementById('previewCountdown');
  if (!timerDisplay) return;

  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
  const RESET_VERSION = 'session_reset_3hours_fresh';

  // Force clean 3-hour reset for the user
  const urlParams = new URLSearchParams(window.location.search);
  if (localStorage.getItem('perfectDealsResetFlag') !== RESET_VERSION || urlParams.has('reset')) {
    localStorage.removeItem('perfectDealsSessionEnd');
    localStorage.setItem('perfectDealsResetFlag', RESET_VERSION);
  }

  let targetTime = localStorage.getItem('perfectDealsSessionEnd');

  if (!targetTime || isNaN(parseInt(targetTime, 10)) || parseInt(targetTime, 10) < Date.now()) {
    targetTime = Date.now() + THREE_HOURS_MS;
    localStorage.setItem('perfectDealsSessionEnd', targetTime.toString());
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function update() {
    const diff = targetTime - Date.now();
    if (diff <= 0) {
      timerDisplay.textContent = 'Session Expired (Refresh)';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);
    timerDisplay.textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s remaining`;
  }

  update();
  setInterval(update, 1000);
}
