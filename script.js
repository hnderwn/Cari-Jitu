// --- FUNGSI UNTUK TAB (Versi Desain Baru) ---
window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');
  const activeClasses = ['bg-primary-600', 'shadow', 'text-white'];
  const inactiveClasses = ['text-color-text-muted', 'hover:bg-color-bg-surface'];

  // Fungsi untuk mengatur tampilan panel berdasarkan ukuran layar
  function applyPanelLayout() {
    // Cek lebar layar
    const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches; // Sesuai dengan breakpoint 'lg' Tailwind

    panels.forEach((panel) => {
      // Hapus semua display terkait dulu agar bersih
      panel.style.display = ''; // Reset display style
      panel.classList.remove('grid', 'grid-cols-2', 'gap-4'); // Hapus kelas grid jika ada
    });

    // Terapkan layout tab normal untuk mobile
    // Sembunyikan semua kecuali yang aktif
    panels.forEach((panel) => panel.classList.add('hidden'));

    // Aktifkan panel pertama saat dimuat atau saat switchTab dipanggil
    const currentActiveTab = document.querySelector('.tab-button.bg-[--color-accent-primary]');
    const targetPanelId = currentActiveTab ? currentActiveTab.id.replace('tab-', 'panel-') : tabs[0].id.replace('tab-', 'panel-');
    const activePanel = document.getElementById(targetPanelId);

    if (activePanel) {
      activePanel.classList.remove('hidden'); // Selalu tampilkan yang aktif

      // Tambahkan grid hanya jika layar besar
      if (isLargeScreen) {
        activePanel.classList.add('grid', 'grid-cols-2', 'gap-4');
      } else {
        activePanel.classList.add('space-y-3'); // Kembali ke layout space-y-3 untuk mobile
      }
    }
  }

  function switchTab(tab) {
    // Atur style tombol
    tabs.forEach((item) => {
      item.classList.remove(...activeClasses);
      item.classList.add(...inactiveClasses);
    });
    tab.classList.add(...activeClasses);
    tab.classList.remove(...inactiveClasses);

    // Atur panel yang ditampilkan (gunakan fungsi applyPanelLayout untuk mengatur display)
    panels.forEach((panel) => {
      panel.classList.add('hidden'); // Sembunyikan semua panel
      panel.classList.remove('grid', 'grid-cols-2', 'gap-4'); // Hapus grid dari yang lain
      panel.classList.add('space-y-3'); // Pastikan space-y-3 untuk yang hidden
    });

    const targetPanelId = tab.id.replace('tab-', 'panel-');
    const activePanel = document.getElementById(targetPanelId);

    if (activePanel) {
      activePanel.classList.remove('hidden'); // Munculkan panel aktif

      // Terapkan grid hanya jika layar besar
      if (window.matchMedia('(min-width: 1024px)').matches) {
        activePanel.classList.add('grid', 'grid-cols-2', 'gap-4');
        activePanel.classList.remove('space-y-3'); // Hapus space-y-3 jika pakai grid
      } else {
        activePanel.classList.add('space-y-3'); // Pastikan space-y-3 untuk mobile
      }
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab));
  });

  // Otomatis aktifkan tab pertama saat halaman dimuat
  if (tabs.length > 0) {
    // Set tab pertama aktif secara visual
    tabs[0].classList.add(...activeClasses);
    tabs[0].classList.remove(...inactiveClasses);

    // Terapkan layout awal
    applyPanelLayout(); // Panggil fungsi ini untuk pertama kali
  }

  // Tambahkan event listener untuk resize window
  window.addEventListener('resize', applyPanelLayout);
});
// --- AKHIR FUNGSI TAB ---

// --- 1. Seleksi Semua Elemen Interaktif ---
const keywordInput = document.getElementById('keywordInput');
const hasilDork = document.getElementById('hasilDork');
const tombolSalin = document.getElementById('tombolSalin');
const tombolCari = document.getElementById('tombolCari');

// Operator Tab Dasar
const siteCheckbox = document.getElementById('siteCheckbox'),
  siteInput = document.getElementById('siteInput');
const filetypeCheckbox = document.getElementById('filetypeCheckbox'),
  filetypeInput = document.getElementById('filetypeInput');
const intitleCheckbox = document.getElementById('intitleCheckbox');

// Operator Tab Tepat & Ekstra
const exactCheckbox = document.getElementById('exactCheckbox');
const excludeCheckbox = document.getElementById('excludeCheckbox'),
  excludeInput = document.getElementById('excludeInput');
const wildcardCheckbox = document.getElementById('wildcardCheckbox');

// Operator Tab Lanjutan (BARU)
const intextCheckbox = document.getElementById('intextCheckbox');
const relatedCheckbox = document.getElementById('relatedCheckbox'),
  relatedInput = document.getElementById('relatedInput');
const cacheCheckbox = document.getElementById('cacheCheckbox'),
  cacheInput = document.getElementById('cacheInput');

// --- 2. Pasang "Mata-mata" (Event Listeners) ---
keywordInput.addEventListener('input', generateDork);
tombolSalin.addEventListener('click', salinKeClipboard);
tombolCari.addEventListener('click', cariDiGoogle);

// Listeners Tab Dasar
siteInput.addEventListener('input', generateDork);
siteCheckbox.addEventListener('change', () => handleDependentInput(siteCheckbox, siteInput));
filetypeInput.addEventListener('input', generateDork);
filetypeCheckbox.addEventListener('change', () => handleDependentInput(filetypeCheckbox, filetypeInput));
intitleCheckbox.addEventListener('change', generateDork);

// Listeners Tab Tepat & Ekstra
exactCheckbox.addEventListener('change', generateDork);
excludeInput.addEventListener('input', generateDork);
excludeCheckbox.addEventListener('change', () => handleDependentInput(excludeCheckbox, excludeInput));
wildcardCheckbox.addEventListener('change', generateDork);

// Listeners Tab Lanjutan (BARU)
intextCheckbox.addEventListener('change', generateDork);
relatedInput.addEventListener('input', generateDork);
relatedCheckbox.addEventListener('change', () => handleDependentInput(relatedCheckbox, relatedInput));
cacheInput.addEventListener('input', generateDork);
cacheCheckbox.addEventListener('change', () => handleDependentInput(cacheCheckbox, cacheInput));

// --- 3. Fungsi-Fungsi Aplikasi ---
function handleDependentInput(checkbox, input) {
  if (checkbox.checked) {
    input.disabled = false;
    input.focus();
  } else {
    input.disabled = true;
    input.value = '';
  }
  generateDork();
}

function generateDork() {
  let keyword = keywordInput.value;
  const dorkParts = [];

  if (exactCheckbox.checked && keyword) keyword = `"${keyword}"`;
  if (keyword) dorkParts.push(keyword);
  if (wildcardCheckbox.checked && keyword) dorkParts[dorkParts.length - 1] += ' *';

  // Operator Dasar
  if (siteCheckbox.checked && siteInput.value) dorkParts.push(`site:${siteInput.value}`);
  if (filetypeCheckbox.checked && filetypeInput.value) dorkParts.push(`filetype:${filetypeInput.value}`);
  if (intitleCheckbox.checked && keywordInput.value) dorkParts.push(`intitle:"${keywordInput.value}"`);

  // Operator Tepat & Ekstra
  if (excludeCheckbox.checked && excludeInput.value) dorkParts.push(`-${excludeInput.value}`);

  // Operator Lanjutan (BARU)
  if (intextCheckbox.checked && keywordInput.value) dorkParts.push(`intext:"${keywordInput.value}"`);
  if (relatedCheckbox.checked && relatedInput.value) dorkParts.push(`related:${relatedInput.value}`);
  if (cacheCheckbox.checked && cacheInput.value) dorkParts.push(`cache:${cacheInput.value}`);

  hasilDork.value = dorkParts.join(' ');
}

function salinKeClipboard() {
  const teksUntukDisalin = hasilDork.value;
  if (!teksUntukDisalin) return;
  navigator.clipboard
    .writeText(teksUntukDisalin)
    .then(() => {
      const teksAsli = tombolSalin.innerText;
      tombolSalin.innerText = 'Berhasil Disalin!';
      tombolSalin.classList.add('bg-indigo-600');
      setTimeout(() => {
        tombolSalin.innerText = teksAsli;
        tombolSalin.classList.remove('bg-indigo-600');
      }, 2000);
    })
    .catch((err) => console.error('Gagal menyalin teks: ', err));
}

function cariDiGoogle() {
  const dork = hasilDork.value;
  if (!dork) return;
  const query = encodeURIComponent(dork);
  const googleUrl = `https://www.google.com/search?q=${query}`;
  window.open(googleUrl, '_blank');
}

generateDork();

// --- LOGIKA UNTUK THEME SWITCHER (DARK MODE) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggleBtn.innerHTML = sunIcon;
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleBtn.innerHTML = moonIcon;
  }
}

function toggleTheme() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const newTheme = isDarkMode ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
  console.log(`Tema diubah ke: ${newTheme}`);
}

themeToggleBtn.addEventListener('click', toggleTheme);

// Cek tema yang tersimpan saat halaman dimuat
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // Opsional: Gunakan tema sistem jika tidak ada yang tersimpan
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}
