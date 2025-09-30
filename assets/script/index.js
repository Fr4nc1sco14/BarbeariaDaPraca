document.addEventListener("DOMContentLoaded", () => {
  // ====== SELECTORS (robustos com fallbacks) ======
  const menuToggle = document.getElementById("menu-toggle") || document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu") || document.querySelector(".mobile_menu") || document.querySelector(".mobile-menu");

  // Desktop language selector: tenta por id, depois por classe
  const desktopSelector = document.getElementById("desktop-lang") || document.querySelector(".navbar .language-selector") || document.querySelector(".language-selector");
  const desktopBtn = desktopSelector ? (desktopSelector.querySelector(".lang-btn") || desktopSelector.querySelector("button")) : null;

  // Mobile language selector dentro do menu móvel
  const mobileSelector = document.getElementById("mobile-lang") || document.querySelector(".mobile-lang");
  const mobileBtn = mobileSelector ? (mobileSelector.querySelector(".lang-btn") || mobileSelector.querySelector("button")) : null;

  // Bandeiras (fallbacks)
  const desktopFlag = document.getElementById("current-flag") || (desktopBtn ? desktopBtn.querySelector("img") : null) || document.querySelector('.language-selector img');
  const mobileFlag = document.getElementById("m-current-flag") || (mobileBtn ? mobileBtn.querySelector("img") : null) || document.querySelector('.mobile-lang img');

  // ====== TRADUÇÕES ======
  const translations = {
    pt: {
      home: "Home",
      services: "Serviços+",
      pricing: "Preços+",
      gallery: "Galeria+",
      book: "Marcar Agora"
    },
    en: {
      home: "Home",
      services: "Services+",
      pricing: "Pricing+",
      gallery: "Gallery+",
      book: "Book Now"
    }
  };

  // Bandeiras
  const flagSources = {
    pt: 'https://flagcdn.com/w20/pt.png',
    en: 'https://flagcdn.com/w20/gb.png'
  };

  // ====== Helper: obter nós dos links do menu (desktop e mobile) ======
  function getDesktopNavNodes() {
    // Primeiro tenta pelos ids esperados
    const byId = {
      home: document.getElementById("nav-home"),
      services: document.getElementById("nav-services"),
      pricing: document.getElementById("nav-pricing"),
      gallery: document.getElementById("nav-gallery"),
      book: document.getElementById("btn-book") || document.querySelector(".btn_book") || document.querySelector(".btn-book")
    };
    // Se pelo menos um não existir, tenta fallback por estrutura .nav-left a (ordem)
    const navLeftLinks = document.querySelectorAll(".nav-left a, .navbar_list a, .navbar_list li a");
    if ((!byId.home || !byId.services || !byId.pricing || !byId.gallery) && navLeftLinks.length >= 4) {
      return {
        home: navLeftLinks[0],
        services: navLeftLinks[1],
        pricing: navLeftLinks[2],
        gallery: navLeftLinks[3],
        book: byId.book
      };
    }
    return byId;
  }

  function getMobileNavNodes() {
    const byId = {
      home: document.getElementById("m-nav-home"),
      services: document.getElementById("m-nav-services"),
      pricing: document.getElementById("m-nav-pricing"),
      gallery: document.getElementById("m-nav-gallery"),
      book: document.getElementById("m-btn-book") || document.querySelector(".mobile-book") || document.querySelector(".btn_mobile")
    };
    // fallback: links inside .mobile-menu (skip the last if it's language)
    const mobileLinks = document.querySelectorAll(".mobile_menu a, .mobile-menu a");
    if ((!byId.home || !byId.services || !byId.pricing || !byId.gallery) && mobileLinks.length >= 4) {
      return {
        home: mobileLinks[0],
        services: mobileLinks[1],
        pricing: mobileLinks[2],
        gallery: mobileLinks[3],
        book: byId.book || mobileLinks[4] || null
      };
    }
    return byId;
  }

  // ====== FUNÇÃO DE TROCA DE IDIOMA ======
  function changeLanguage(lang) {
    if (!translations[lang]) return;

    const desktopNav = getDesktopNavNodes();
    const mobileNav = getMobileNavNodes();

    if (desktopNav.home) desktopNav.home.textContent = translations[lang].home;
    if (desktopNav.services) desktopNav.services.textContent = translations[lang].services;
    if (desktopNav.pricing) desktopNav.pricing.textContent = translations[lang].pricing;
    if (desktopNav.gallery) desktopNav.gallery.textContent = translations[lang].gallery;
    if (desktopNav.book) {
      // pode ser um link ou botão
      desktopNav.book.textContent = translations[lang].book;
    }

    if (mobileNav.home) mobileNav.home.textContent = translations[lang].home;
    if (mobileNav.services) mobileNav.services.textContent = translations[lang].services;
    if (mobileNav.pricing) mobileNav.pricing.textContent = translations[lang].pricing;
    if (mobileNav.gallery) mobileNav.gallery.textContent = translations[lang].gallery;
    if (mobileNav.book) mobileNav.book.textContent = translations[lang].book;

    // actualiza bandeiras (se existirem)
    if (desktopFlag) desktopFlag.src = flagSources[lang];
    if (mobileFlag) mobileFlag.src = flagSources[lang];
  }

  // ====== MOBILE MENU HANDLERS ======
  if (menuToggle && mobileMenu) {
    const toggleMobileMenu = (e) => {
      if (e) e.stopPropagation();
      const opening = mobileMenu.classList.toggle("open");
      mobileMenu.setAttribute("aria-hidden", String(!opening));
      // Atualiza aria-expanded no toggle
      if (menuToggle.setAttribute) menuToggle.setAttribute("aria-expanded", String(opening));
    };

    menuToggle.addEventListener("click", toggleMobileMenu);
    menuToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMobileMenu(e);
      }
    });

    // Fecha mobile ao clicar num link interno
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        if (menuToggle.setAttribute) menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Fecha mobile com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        if (menuToggle.setAttribute) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Fecha mobile ao fazer resize para desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        if (menuToggle && menuToggle.setAttribute) menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ====== DESKTOP DROPDOWN ======
  if (desktopBtn && desktopSelector) {
    desktopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const active = desktopSelector.classList.toggle("active");
      desktopBtn.setAttribute("aria-expanded", String(active));
    });

    // liga listener para todos os items dentro do dropdown (caso exista)
    const desktopItems = desktopSelector.querySelectorAll(".lang-dropdown li");
    desktopItems.forEach(item => {
      item.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const lang = item.getAttribute("data-lang");
        if (lang) changeLanguage(lang);
        desktopSelector.classList.remove("active");
        desktopBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ====== MOBILE DROPDOWN (dentro do menu móvel) ======
  if (mobileBtn && mobileSelector) {
    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const active = mobileSelector.classList.toggle("active");
      mobileBtn.setAttribute("aria-expanded", String(active));
    });

    const mobileItems = mobileSelector.querySelectorAll(".lang-dropdown li");
    mobileItems.forEach(item => {
      item.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const lang = item.getAttribute("data-lang");
        if (lang) changeLanguage(lang);
        mobileSelector.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
        // fecha também o mobile menu para experiência limpa
        if (mobileMenu) {
          mobileMenu.classList.remove("open");
          mobileMenu.setAttribute("aria-hidden", "true");
          if (menuToggle && menuToggle.setAttribute) menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // ====== Fecha dropdowns e mobile menu quando clica fora ======
  document.addEventListener("click", (e) => {
    if (desktopSelector && !desktopSelector.contains(e.target)) {
      desktopSelector.classList.remove("active");
      if (desktopBtn) desktopBtn.setAttribute("aria-expanded", "false");
    }
    if (mobileSelector && !mobileSelector.contains(e.target)) {
      mobileSelector.classList.remove("active");
      if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
    }
    if (mobileMenu && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      if (menuToggle && menuToggle.setAttribute) menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // ====== Keyboard: ESC fecha dropdowns ======
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (desktopSelector) {
        desktopSelector.classList.remove("active");
        if (desktopBtn) desktopBtn.setAttribute("aria-expanded", "false");
      }
      if (mobileSelector) {
        mobileSelector.classList.remove("active");
        if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
      }
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // PREDEFINIR idioma inicial (pt)
  changeLanguage('pt');
});
