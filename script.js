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
      panels.forEach((panel) => panel.classList.add('hidden'));
      const targetPanelId = tab.id.replace('tab-', 'panel-');
      document.getElementById(targetPanelId)?.classList.remove('hidden');
    });
  });
});

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
