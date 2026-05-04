// =============================================
//  BAGIAN 1: Registrasi Service Worker
// =============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/tokotest/app-toko/sw.js')
            .then((registration) => {
                console.log('[App] SW berhasil terdaftar! Scope:', registration.scope);
            })
            .catch((error) => {
                console.error('[App] SW gagal:', error);
            });
    });
}

// =============================================
//  BAGIAN 2: Helper Format Harga
// =============================================
function formatHarga(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
}

// =============================================
//  BAGIAN 3: Ambil & Tampilkan Data Barang
// =============================================
async function ambilDataBarang() {
    try {
        // ✅ FIX: Pakai path relatif supaya ikut domain otomatis (tokotest.test / localhost)
        const response = await fetch('../api-toko/get_barang.php');

        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        const hasil = await response.json();

        if (hasil.status === 'success') {
            const hargaList = hasil.data.map(b => Number(b.harga));
            document.getElementById('stat-total').textContent = hasil.data.length + ' item';
            document.getElementById('stat-min').textContent = formatHarga(Math.min(...hargaList));
            document.getElementById('stat-max').textContent = formatHarga(Math.max(...hargaList));
            document.getElementById('loading-state').style.display = 'none';

            let barisHTML = '';
            hasil.data.forEach((barang, i) => {
                barisHTML += `
                    <div class="row-anim" style="
                        display: grid;
                        grid-template-columns: 60px 1fr 130px;
                        gap: 8px; padding: 11px 16px;
                        border-top: 1px solid #f0f0f0;
                        align-items: center;
                        animation-delay: ${i * 0.07}s;
                    ">
                        <div style="font-size:12px;background:#E1F5EE;color:#085041;font-weight:500;
                            border-radius:6px;padding:2px 8px;text-align:center;width:fit-content;">
                            ${barang.id}
                        </div>
                        <div style="font-size:14px;color:#1a1a1a;">${barang.nama_barang}</div>
                        <div style="font-size:14px;font-weight:500;color:#0F6E56;text-align:right;">
                            ${formatHarga(barang.harga)}
                        </div>
                    </div>
                `;
            });
            document.getElementById('tabel-barang').innerHTML = barisHTML;
        } else {
            throw new Error(hasil.message || 'Status tidak sukses');
        }
    } catch (error) {
        console.error('[App] Gagal mengambil data:', error);
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'block';
    }
}

ambilDataBarang();