function jalankanSimulasi() {
    // Membaca data dari kolom input web
    let sensor1 = parseFloat(document.getElementById("inputSensor1").value);
    let sensor2 = parseFloat(document.getElementById("inputSensor2").value);
    
    let kotakVisual = document.getElementById("indikatorVisual");
    let teksStatus = document.getElementById("keteranganStatus");

    // TANTANGAN LOGIKA KELOMPOK: Tulis aturan Nested If kalian di bawah ini
    if (sensor1 > 35) { 
        if (sensor2 < 30) {
            kotakVisual.innerText = "ALARM / POMPA MENYALA MAKSIMAL!";
            kotakVisual.style.backgroundColor = "red";
            teksStatus.innerText = "Kondisi Lingkungan Kritis! Sistem mengambil keputusan darurat.";
        } else {
            kotakVisual.innerText = "ALAT SIAGA / NORMAL";
            kotakVisual.style.backgroundColor = "orange";
            teksStatus.innerText = "Suhu tinggi namun kelembaban aman.";
        }
    } else {
        kotakVisual.innerText = "SISTEM AMAN / AMAN";
        kotakVisual.style.backgroundColor = "green";
        teksStatus.innerText = "Seluruh parameter sensor berada di batas normal.";
    }
}
