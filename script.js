
/* =========================================================================
   AGRISENSE DASHBOARD — SIMULASI SMART FARMING
   Catatan: SEMUA angka sensor di bawah ini adalah data PALSU / SIMULASI
   yang dibuat dengan Math.random(). Pada implementasi nyata, bagian ini
   akan digantikan oleh data yang dikirim microcontroller (mis. ESP32/
   Arduino) melalui HTTP request (fetch), WebSocket, atau MQTT.
   ========================================================================= */

// ---- Jam real-time di header ----
function updateJam() {
  const now = new Date();
  document.getElementById("jam").textContent = now.toLocaleTimeString("id-ID");
}
setInterval(updateJam, 1000);
updateJam();

// ---- Util: tambah baris ke log aktivitas ----
function tambahLog(pesan) {
  const log = document.getElementById("log");
  const jamSekarang = new Date().toLocaleTimeString("id-ID");

  const baris = document.createElement("p");
  baris.innerHTML = `<span class="waktu">${jamSekarang}</span> ${pesan}`;
  log.prepend(baris); // baris terbaru muncul paling atas

  // batasi log maksimal 8 baris supaya tidak kepanjangan
  while (log.children.length > 8) {
    log.removeChild(log.lastChild);
  }
}

// ---- Util: terapkan status warna (aman/waspada/bahaya) ke sebuah kartu ----
function terapkanStatus(cardEl, badgeEl, level) {
  cardEl.classList.remove("status-aman", "status-waspada", "status-bahaya");
  cardEl.classList.add("status-" + level);

  const label = { aman: "AMAN", waspada: "WASPADA", bahaya: "BAHAYA" };
  badgeEl.textContent = label[level];
}

/* ============================
   SIMULASI SENSOR: SUHU UDARA
   Rentang normal contoh: 22–33 °C
   ============================ */
function bacaSuhu() {
  const suhu = (Math.random() * 14 + 20).toFixed(1); // 20.0–34.0 °C
  document.getElementById("suhuValue").innerHTML = suhu + "<span> °C</span>";
  document.getElementById("suhuBar").style.width = Math.min(suhu / 40 * 100, 100) + "%";

  const card = document.getElementById("cardSuhu");
  const badge = document.getElementById("suhuBadge");

  let level = "aman";
  if (suhu > 32) level = "bahaya";
  else if (suhu > 29) level = "waspada";
  terapkanStatus(card, badge, level);

  if (level === "bahaya") tambahLog("🌡️ Suhu udara tinggi: " + suhu + " °C");
}

/* ================================
   SIMULASI SENSOR: KELEMBAPAN TANAH
   Semakin RENDAH = semakin kering
   ================================ */
function bacaTanah() {
  const persen = (Math.random() * 60 + 20).toFixed(0); // 20–80%
  document.getElementById("tanahValue").innerHTML = persen + "<span> %</span>";
  document.getElementById("tanahBar").style.width = persen + "%";

  const card = document.getElementById("cardTanah");
  const badge = document.getElementById("tanahBadge");

  let level = "aman";
  if (persen < 30) level = "bahaya";      // tanah terlalu kering
  else if (persen < 45) level = "waspada";
  terapkanStatus(card, badge, level);

  // Auto-suggest: kalau tanah kering & pompa masih mati, catat peringatan
  const pompaNyala = document.getElementById("togglePompa").checked;
  if (level === "bahaya" && !pompaNyala) {
    tambahLog("💧 Tanah kering (" + persen + "%) — pertimbangkan nyalakan pompa!");
  }
}

/* ==================================
   SIMULASI SENSOR: INTENSITAS CAHAYA
   ================================== */
function bacaCahaya() {
  const lux = (Math.random() * 800 + 200).toFixed(0); // 200–1000 lux
  document.getElementById("cahayaValue").innerHTML = lux + "<span> lux</span>";
  document.getElementById("cahayaBar").style.width = Math.min(lux / 1000 * 100, 100) + "%";

  const card = document.getElementById("cardCahaya");
  const badge = document.getElementById("cahayaBadge");

  let level = "aman";
  if (lux < 350) level = "waspada"; // cahaya terlalu redup
  terapkanStatus(card, badge, level);
}

/* ============================
   SIMULASI SENSOR: CURAH HUJAN
   ============================ */
function bacaHujan() {
  const mm = (Math.random() * 15).toFixed(1); // 0–15 mm
  document.getElementById("hujanValue").innerHTML = mm + "<span> mm</span>";
  document.getElementById("hujanBar").style.width = Math.min(mm / 15 * 100, 100) + "%";

  const card = document.getElementById("cardHujan");
  const badge = document.getElementById("hujanBadge");

  let level = "aman";
  if (mm > 10) level = "waspada"; // hujan lebat, berpotensi banjir lahan
  terapkanStatus(card, badge, level);
}

// Jalankan semua fungsi simulasi tiap 3 detik
function siklusSensor() {
  bacaSuhu();
  bacaTanah();
  bacaCahaya();
  bacaHujan();
}
setInterval(siklusSensor, 3000);
siklusSensor(); // panggil sekali di awal supaya tidak kosong

/* =========================================================
   KONTROL AKTUATOR — dipicu langsung oleh interaksi pengguna
   ========================================================= */
document.getElementById("togglePompa").addEventListener("change", function () {
  const nyala = this.checked;
  document.getElementById("pompaStatusTxt").textContent = nyala ? "Menyala" : "Mati";
  tambahLog(nyala ? "🚿 Pompa irigasi DINYALAKAN oleh pengguna." : "🚿 Pompa irigasi DIMATIKAN oleh pengguna.");
  // TODO (implementasi nyata): kirim perintah ke microcontroller, mis.
  // fetch('/api/pompa', { method: 'POST', body: JSON.stringify({on: nyala}) })
});

document.getElementById("toggleLampu").addEventListener("change", function () {
  const nyala = this.checked;
  document.getElementById("lampuStatusTxt").textContent = nyala ? "Menyala" : "Mati";
  tambahLog(nyala ? "💡 Grow light DINYALAKAN oleh pengguna." : "💡 Grow light DIMATIKAN oleh pengguna.");
});

document.getElementById("toggleKipas").addEventListener("change", function () {
  const nyala = this.checked;
  document.getElementById("kipasStatusTxt").textContent = nyala ? "Menyala" : "Mati";
  tambahLog(nyala ? "🌀 Kipas ventilasi DINYALAKAN oleh pengguna." : "🌀 Kipas ventilasi DIMATIKAN oleh pengguna.");
});
