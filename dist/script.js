// script.js (Versi 2.0 - Refactored & Final Corrected)
console.log('INI SCRIPT VERSI FINAL REFACTOR!');

const app = {
  // =================================================================
  // A. STATE & SELEKSI ELEMEN
  // =================================================================
  elements: {
    html: document.documentElement,
    keywordInput: document.getElementById('keywordInput'),
    hasilDork: document.getElementById('hasilDork'),
    tombolSalin: document.getElementById('tombolSalin'),
    tombolCari: document.getElementById('tombolCari'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    tabs: document.querySelectorAll('.tab-button'),
    panels: document.querySelectorAll('.tab-panel'),
    templateButton: document.getElementById('template-button'),
    templateMenu: document.getElementById('template-menu'),
    templateArrow: document.getElementById('template-arrow'),
    templateItems: document.querySelectorAll('.template-item'),
    templateButtonText: document.querySelector('#template-button span'),
    checkboxes: document.querySelectorAll('input[type="checkbox"]'),
    textInputs: document.querySelectorAll('.card-operator input[type="text"]'),
  },

  // =================================================================
  // B. INISIALISASI APLIKASI
  // =================================================================
  init() {
    if (this.elements.themeToggleBtn) this.theme.setup();
    if (this.elements.tabs.length > 0) this.tabs.setup();
    if (this.elements.templateButton) this.templates.setup();
    this.coreListeners.setup();
    this.dork.generate();
    console.log('Aplikasi Cari Jitu! berhasil dimuat.');
  },

  // =================================================================
  // C. KUMPULAN FUNGSI (MODUL)
  // =================================================================

  coreListeners: {
    setup() {
      app.elements.keywordInput?.addEventListener('input', () => app.dork.generate());
      app.elements.checkboxes.forEach((cb) => cb.addEventListener('change', () => app.dork.generate()));
      app.elements.textInputs.forEach((input) => input.addEventListener('input', () => app.dork.generate()));
      app.elements.tombolSalin?.addEventListener('click', () => app.actions.copyToClipboard());
      app.elements.tombolCari?.addEventListener('click', () => app.actions.searchOnGoogle());

      app.elements.checkboxes.forEach((cb) => {
        const dependentInput = document.getElementById(cb.id.replace('Checkbox', 'Input'));
        if (dependentInput) {
          cb.addEventListener('change', () => app.dork.handleDependentInput(cb, dependentInput));
        }
      });
    },
  },

  theme: {
    sunIcon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
    moonIcon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`,
    apply(theme) {
      if (theme === 'dark') {
        app.elements.html.classList.add('dark');
        app.elements.themeToggleBtn.innerHTML = this.sunIcon;
      } else {
        app.elements.html.classList.remove('dark');
        app.elements.themeToggleBtn.innerHTML = this.moonIcon;
      }
    },
    toggle() {
      const isDarkMode = app.elements.html.classList.contains('dark');
      const newTheme = isDarkMode ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      this.apply(newTheme);
    },
    setup() {
      this.apply(localStorage.getItem('theme') || 'light');
      app.elements.themeToggleBtn.addEventListener('click', () => this.toggle());
    },
  },

  // KOREKSI #1: Struktur 'tabs' yang dobel sudah dihapus. Sekarang langsung app.tabs.setup()
  tabs: {
    activeClasses: ['bg-primary-500', 'dark:bg-primary-400', 'text-white', 'shadow'],
    inactiveClasses: ['text-neutral-500', 'dark:text-neutral-400', 'hover:bg-neutral-200', 'dark:hover:bg-neutral-700'],
    switch(tab) {
      app.elements.tabs.forEach((item) => {
        item.classList.remove(...this.activeClasses);
        item.classList.add(...this.inactiveClasses);
      });
      tab.classList.add(...this.activeClasses);
      tab.classList.remove(...this.inactiveClasses);

      const targetPanel = document.getElementById(tab.id.replace('tab-', 'panel-'));
      let activePanel = null;
      app.elements.panels.forEach((panel) => {
        if (!panel.classList.contains('hidden')) activePanel = panel;
      });

      if (activePanel === targetPanel) return;
      if (activePanel) activePanel.classList.add('opacity-0');

      setTimeout(() => {
        app.elements.panels.forEach((panel) => {
          panel.classList.add('hidden');
          panel.classList.remove('grid', 'lg:grid-cols-2', 'gap-4');
          panel.classList.add('space-y-3');
        });

        if (targetPanel) {
          targetPanel.classList.remove('hidden');
          if (window.matchMedia('(min-width: 1024px)').matches) {
            targetPanel.classList.add('grid', 'lg:grid-cols-2', 'gap-4');
            targetPanel.classList.remove('space-y-3');
          }
          setTimeout(() => targetPanel.classList.remove('opacity-0'), 10);
        }
      }, 150);
    },
    setup() {
      app.elements.tabs.forEach((tab) => {
        tab.addEventListener('click', () => this.switch(tab));
      });
      if (app.elements.tabs.length > 0) {
        this.switch(app.elements.tabs[0]);
      }
      window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab-button.bg-primary-500') || app.elements.tabs[0];
        if (activeTab) this.switch(activeTab);
      });
    },
  },

  templates: {
    toggleMenu() {
      app.elements.templateMenu.classList.toggle('hidden');
      app.elements.templateArrow.classList.toggle('rotate-180');
    },
    select(item) {
      const keyword = item.dataset.keyword;
      const operators = JSON.parse(item.dataset.operators);

      app.elements.checkboxes.forEach((cb) => (cb.checked = false));
      app.elements.textInputs.forEach((input) => {
        input.value = '';
        input.disabled = true;
      });

      app.elements.keywordInput.value = keyword;

      for (const op in operators) {
        const checkbox = document.getElementById(`${op}Checkbox`);
        const input = document.getElementById(`${op}Input`);
        const value = operators[op];
        if (checkbox) checkbox.checked = true;
        if (input && typeof value === 'string') {
          input.value = value;
          input.disabled = false;
        }
      }

      app.dork.generate();
      this.toggleMenu();
      app.elements.templateButtonText.textContent = item.textContent.trim();
    },
    setup() {
      app.elements.templateButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
      app.elements.templateItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.select(item);
        });
      });
      window.addEventListener('click', () => {
        if (!app.elements.templateMenu.classList.contains('hidden')) {
          this.toggleMenu();
        }
      });
    },
  },

  dork: {
    handleDependentInput(checkbox, input) {
      input.disabled = !checkbox.checked;
      if (checkbox.checked) {
        input.focus();
      } else {
        input.value = '';
      }
      // KOREKSI #3: Panggil generate() setelah mengubah state
      this.generate();
    },
    generate() {
      const dorkParts = [];
      let keyword = app.elements.keywordInput?.value || '';

      // KOREKSI #2: Semua referensi sekarang menggunakan document.getElementById agar selalu up-to-date
      if (document.getElementById('exactCheckbox')?.checked && keyword) {
        keyword = `"${keyword}"`;
      }
      if (keyword) {
        dorkParts.push(keyword);
      }
      if (document.getElementById('wildcardCheckbox')?.checked && keyword) {
        dorkParts[dorkParts.length - 1] += ' *';
      }

      function addOperator(opName) {
        const checkbox = document.getElementById(`${opName}Checkbox`);
        const input = document.getElementById(`${opName}Input`);
        if (checkbox?.checked && input?.value) {
          dorkParts.push(`${opName}:${input.value}`);
        }
      }
      function addSimpleOperator(opName) {
        const checkbox = document.getElementById(`${opName}Checkbox`);
        if (checkbox?.checked && app.elements.keywordInput?.value) {
          dorkParts.push(`${opName}:"${app.elements.keywordInput.value}"`);
        }
      }

      addOperator('site');
      addOperator('filetype');
      addSimpleOperator('intitle');

      const excludeInput = document.getElementById('excludeInput');
      if (document.getElementById('excludeCheckbox')?.checked && excludeInput?.value) {
        dorkParts.push(`-${excludeInput.value}`);
      }

      addSimpleOperator('intext');
      addOperator('related');
      addOperator('cache');

      if (app.elements.hasilDork) {
        app.elements.hasilDork.value = dorkParts.join(' ');
      }
    },
  },

  actions: {
    copyToClipboard() {
      const textToCopy = app.elements.hasilDork?.value;
      if (!textToCopy) return;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const originalText = app.elements.tombolSalin.innerText;
          app.elements.tombolSalin.innerText = 'Berhasil Disalin!';
          // Kita gunakan warna aksen primer kita
          app.elements.tombolSalin.classList.add('bg-primary-600');
          setTimeout(() => {
            app.elements.tombolSalin.innerText = originalText;
            app.elements.tombolSalin.classList.remove('bg-primary-600');
          }, 2000);
        })
        .catch((err) => console.error('Gagal menyalin teks: ', err));
    },
    searchOnGoogle() {
      const dork = app.elements.hasilDork?.value;
      if (!dork) return;
      const query = encodeURIComponent(dork);
      const googleUrl = `https://www.google.com/search?q=${query}`;
      window.open(googleUrl, '_blank');
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
