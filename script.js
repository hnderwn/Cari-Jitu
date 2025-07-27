// --- 1. Seleksi Semua Elemen Interaktif ---
const keywordInput = document.getElementById('keywordInput');
const siteCheckbox = document.getElementById('siteCheckbox');
const siteInput = document.getElementById('siteInput');
const inurlCheckbox = document.getElementById('inurlCheckbox');
const hasilDork = document.getElementById('hasilDork');
const tombolSalin = document.getElementById('tombolSalin');
const tombolCari = document.getElementById('tombolCari');

// --- 2. Pasang "Mata-mata" (Event Listeners) ---
keywordInput.addEventListener('input', generateDork);
siteInput.addEventListener('input', generateDork);
inurlCheckbox.addEventListener('change', generateDork);
siteCheckbox.addEventListener('change', () => {
  if (siteCheckbox.checked) {
    siteInput.disabled = false;
    siteInput.focus();
  } else {
    siteInput.disabled = true;
    siteInput.value = '';
  }
  generateDork();
});

tombolSalin.addEventListener('click', salinKeClipboard);
tombolCari.addEventListener('click', cariDiGoogle);

// --- 3. Fungsi-Fungsi Aplikasi ---

function generateDork() {
  //... (Fungsi ini tidak diubah)
  let keyword = keywordInput.value;
  const dorkParts = [];
  if (keyword) {
    dorkParts.push(keyword);
  }
  if (siteCheckbox.checked) {
    const siteValue = siteInput.value;
    if (siteValue) {
      dorkParts.push(`site:${siteValue}`);
    }
  }
  if (inurlCheckbox.checked) {
    dorkParts.push(`inurl:${keyword}`);
  }
  hasilDork.value = dorkParts.join(' ');
}

function salinKeClipboard() {
  // --- TAMBAHAN DEBUGGING ---
  console.log('Fungsi salinKeClipboard() KEPANGGIL!');

  const teksUntukDisalin = hasilDork.value;

  if (!teksUntukDisalin) {
    // --- TAMBAHAN DEBUGGING ---
    console.log('Teks kosong, fungsi berhenti di sini.');
    return;
  }

  navigator.clipboard
    .writeText(teksUntukDisalin)
    .then(() => {
      console.log('Berhasil disalin ke clipboard!');
      const teksAsli = tombolSalin.innerText;
      tombolSalin.innerText = 'Berhasil Disalin!';
      tombolSalin.classList.add('bg-indigo-600');
      setTimeout(() => {
        tombolSalin.innerText = teksAsli;
        tombolSalin.classList.remove('bg-indigo-600');
      }, 2000);
    })
    .catch((err) => {
      console.error('Gagal menyalin teks: ', err);
    });
}

function cariDiGoogle() {
  // --- TAMBAHAN DEBUGGING ---
  console.log('Fungsi cariDiGoogle() KEPANGGIL!');

  const dork = hasilDork.value;

  if (!dork) {
    // --- TAMBAHAN DEBUGGING ---
    console.log('Teks kosong, fungsi berhenti di sini.');
    return;
  }

  console.log('Membuka tab baru untuk mencari:', dork);
  const query = encodeURIComponent(dork);
  const googleUrl = `https://www.google.com/search?q=${query}`;
  window.open(googleUrl, '_blank');
}

// Panggil fungsi sekali di awal
generateDork();
