// --- FUNGSI UNTUK TAB ---
window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        item.classList.remove('text-blue-600', 'border-blue-600');
        item.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
      });
      tab.classList.add('text-blue-600', 'border-blue-600');
      tab.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
      panels.forEach((panel) => panel.classList.add('hidden'));
      const targetPanelId = tab.id.replace('tab-', 'panel-');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
      }
    });
  });
});
// --- AKHIR FUNGSI TAB ---

// --- 1. Seleksi Semua Elemen Interaktif ---
// Bagian ini jadi lebih panjang karena ada elemen baru
const keywordInput = document.getElementById('keywordInput');
const hasilDork = document.getElementById('hasilDork');
const tombolSalin = document.getElementById('tombolSalin');
const tombolCari = document.getElementById('tombolCari');

// Operator di Tab Dasar
const siteCheckbox = document.getElementById('siteCheckbox');
const siteInput = document.getElementById('siteInput');
const filetypeCheckbox = document.getElementById('filetypeCheckbox'); // BARU
const filetypeInput = document.getElementById('filetypeInput'); // BARU
const intitleCheckbox = document.getElementById('intitleCheckbox'); // BARU

// --- 2. Pasang "Mata-mata" (Event Listeners) ---
keywordInput.addEventListener('input', generateDork);

// Listener untuk operator Tab Dasar
siteInput.addEventListener('input', generateDork);
siteCheckbox.addEventListener('change', () => {
  handleDependentInput(siteCheckbox, siteInput);
});

filetypeInput.addEventListener('input', generateDork); // BARU
filetypeCheckbox.addEventListener('change', () => {
  // BARU
  handleDependentInput(filetypeCheckbox, filetypeInput);
});

intitleCheckbox.addEventListener('change', generateDork); // BARU

// Listener untuk tombol aksi
tombolSalin.addEventListener('click', salinKeClipboard);
tombolCari.addEventListener('click', cariDiGoogle);

// --- 3. Fungsi-Fungsi Aplikasi ---

// Fungsi Bantuan untuk input yang bergantung pada checkbox
function handleDependentInput(checkbox, input) {
  if (checkbox.checked) {
    input.disabled = false;
    input.focus();
  } else {
    input.disabled = true;
    input.value = '';
  }
  generateDork(); // Panggil generateDork setiap kali status berubah
}

// Fungsi Otak Aplikasi (Sudah di-upgrade)
function generateDork() {
  let keyword = keywordInput.value;
  const dorkParts = [];

  if (keyword) {
    dorkParts.push(keyword);
  }

  // Logika untuk site:
  if (siteCheckbox.checked && siteInput.value) {
    dorkParts.push(`site:${siteInput.value}`);
  }

  // Logika untuk filetype: (BARU)
  if (filetypeCheckbox.checked && filetypeInput.value) {
    dorkParts.push(`filetype:${filetypeInput.value}`);
  }

  // Logika untuk intitle: (BARU)
  if (intitleCheckbox.checked && keyword) {
    dorkParts.push(`intitle:"${keyword}"`); // Kita pake tanda kutip biar lebih akurat
  }

  hasilDork.value = dorkParts.join(' ');
}

// Fungsi untuk Tombol Salin
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

// Fungsi untuk Tombol Cari di Google
function cariDiGoogle() {
  const dork = hasilDork.value;
  if (!dork) return;
  const query = encodeURIComponent(dork);
  const googleUrl = `https://www.google.com/search?q=${query}`;
  window.open(googleUrl, '_blank');
}

// Panggil fungsi sekali di awal untuk inisialisasi
generateDork();
