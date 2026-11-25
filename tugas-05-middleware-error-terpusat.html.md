# Tugas 5 — Middleware & Error Terpusat

Pertemuan 5, lanjutan dari [Materi 5: Middleware dan Penanganan Error Terpusat](materi-05-middleware-error-terpusat.html)

## Router, Middleware, dan Error Terpusat Tugas 5

**Tujuan:** membangun API berlapis lengkap dengan router, middleware (`logger`, `cekApiKey`, validasi Joi), dan error terpusat, sesuai spesifikasi varian kalian. Rujukan langkahnya ada di Materi 5.

### Pembagian Varian

| Digit terakhir NIM | Varian | Resource |
| --- | --- | --- |
| **Ganjil** (1, 3, 5, 7, 9) | A — Perpustakaan | `/buku` |
| **Genap** (0, 2, 4, 6, 8) | B — Kantin | `/menu` |

Buat proyek baru (kerangka Express boleh disalin dari Tugas 4) dengan minimal **5 data awal** buatan sendiri. Kerjakan **hanya varian kalian**.

### Varian A — Perpustakaan (NIM ganjil)

**Bentuk data:** `{ id, judul, penulis, tahun, stok, kategori }`

| Method | URL | Middleware | Hasil |
| --- | --- | --- | --- |
| `GET` | `/buku` dan `/buku?kategori=sains` | logger | 200, daftar (dengan filter kategori bila ada) |
| `GET` | `/buku/:id` | logger | 200, atau 404 `NOT_FOUND` |
| `POST` | `/buku` | logger, cekApiKey, validasi | 201, atau 401 / 422 / 409 |
| `DELETE` | `/buku/:id` | logger, cekApiKey | 204, atau 401 / 404 |

| Field | Aturan validasi (Joi) |
| --- | --- |
| `judul` | string, 3–100 karakter, wajib |
| `penulis` | string, minimal 3 karakter, wajib |
| `tahun` | bilangan bulat, 1900–2026, wajib |
| `stok` | bilangan bulat, 0–100, default `1` |
| `kategori` | salah satu dari `novel`, `sains`, `sejarah`, `agama`, wajib |

**Aturan bisnis (di service, status 409):** `judul` tidak boleh kembar (abaikan huruf besar/kecil), kode `JUDUL_DUPLIKAT`.

### Varian B — Kantin (NIM genap)

**Bentuk data:** `{ id, nama, harga, kategori, tersedia }`

| Method | URL | Middleware | Hasil |
| --- | --- | --- | --- |
| `GET` | `/menu` dan `/menu?kategori=minuman` | logger | 200, daftar (dengan filter kategori bila ada) |
| `GET` | `/menu/:id` | logger | 200, atau 404 `NOT_FOUND` |
| `POST` | `/menu` | logger, cekApiKey, validasi | 201, atau 401 / 422 / 409 |
| `DELETE` | `/menu/:id` | logger, cekApiKey | 204, atau 401 / 404 |

| Field | Aturan validasi (Joi) |
| --- | --- |
| `nama` | string, 3–50 karakter, wajib |
| `harga` | bilangan bulat, 1.000–100.000, wajib |
| `kategori` | salah satu dari `makanan`, `minuman`, `camilan`, wajib |
| `tersedia` | boolean, default `true` |

**Aturan bisnis (di service, status 409):** `nama` tidak boleh kembar (abaikan huruf besar/kecil), kode `NAMA_DUPLIKAT`.

### Syarat Teknis (Semua Varian)

* **Struktur 4 lapis:** `routes/`, `controllers/`, `services/`, `data/`. Router dipasang di `index.js` dengan `app.use('/buku', ...)`; awalan tidak diulang di file router. Fungsi service `async` dan tidak menyentuh `req`/`res`.
* **logger:** tiap request tercatat satu baris `METHOD URL -> STATUS (n ms)`.
* **cekApiKey:** membaca header `x-api-key`, salah atau kosong → 401. Hanya dipasang di `POST` dan `DELETE`. Urutan di `POST`: `cekApiKey` → `validasi` → controller.
* **Validasi:** skema Joi di `validators/`, `abortEarly: false`, gagal → 422 `VALIDATION_ERROR` berisi semua kesalahan sekaligus.
* **Error terpusat:** `AppError`, `notFound`, dan `errorHandler` (4 parameter, dipasang paling akhir). Tidak boleh ada `res.status(4xx).json(...)` manual. Format selalu `{ error: { pesan, kode } }`; URL tak dikenal → 404 `ROUTE_NOT_FOUND`.
* **requests.http** (REST Client), minimal 10 request: GET daftar, GET dengan filter, GET detail ada, GET detail 404, URL tak dikenal, POST 201, POST 401, POST 422, POST 409, DELETE 204 dan DELETE 404.

**Jebakan dari materi:** lupa `next()` membuat request menggantung; `errorHandler` wajib 4 parameter; `notFound` dan `errorHandler` dipasang setelah semua rute; `req.params.id` itu string; `DELETE` berhasil dijawab `res.status(204).end()` tanpa body.

### Uji Error 500

Sengaja salah ketik di lapis data (mis. `push` jadi `dorong`), kirim `POST` yang valid. Klien harus menerima `500` dengan pesan umum “Terjadi kesalahan pada server”, sedangkan jejak lengkap hanya muncul di terminal server. Screenshot keduanya, lalu **kembalikan kodenya** sebelum commit.

### Bonus (Opsional)

* **+5%:** `PUT /:id` (200) lewat 4 lapis dengan `cekApiKey` dan `validasi`; id tidak ada → 404. Tambahkan ke `requests.http` beserta screenshot.
* **+5%:** kunci dibaca dari `process.env.API_KEY`. Jelaskan di README apa yang terjadi bila variabel tidak diset dan pilihan kalian.

### Screenshot

Simpan di folder `screenshot/` dalam repository:

* Terminal server dengan baris `logger` (ada status 404, 401, 422, 201, 204).
* Hasil di REST Client/Postman: GET 404, URL tak dikenal, POST 401, 422, 409, 201, DELETE 204.
* Error 500 (sisi klien dan terminal), serta `requests.http` di VS Code.

### README.md

```
# Tugas 5 - Middleware & Error Terpusat

## Identitas
- Nama : [Nama Lengkap]
- NIM  : [NIM Mahasiswa]  (Varian: A / B)

## Cara Menjalankan
npm install, npm run dev, API key: [nilai / cara mengatur]

## Struktur Proyek
[Pohon folder + 1 kalimat tugas tiap lapis]

## Endpoint
[Tabel: Method, URL, Middleware, Status]

## Aturan Validasi, Aturan Bisnis, dan Kode Error
[Aturan Joi per field; aturan 409 + alasan tempatnya di service, bukan di Joi; daftar kode error]

## Pengujian
[Screenshot + satu kalimat keterangan tiap gambar]

## Deklarasi Penggunaan AI
[Lihat di bawah]

## Kesimpulan & Kendala
[Apa bedanya sebelum dan sesudah error terpusat? Kendala dan solusinya]
```

### Deklarasi Penggunaan AI

AI **boleh** dipakai, tetapi wajib dideklarasikan jujur di README. Yang dinilai kejujuran dan kelengkapan, bukan banyaknya AI.

```
| Bagian | Alat AI | Dipakai untuk apa | Cara saya memeriksa hasilnya |
|--------|---------|-------------------|------------------------------|
| Skema Joi | ChatGPT | Contoh aturan field tahun | Uji tahun "abc" dan 3000 di requests.http, keduanya 422 |
| Aturan 409 | - | - | - |

Pernyataan: [Saya menggunakan AI pada bagian yang tertulis di tabel. Bagian lain saya kerjakan sendiri.]
```

* Cantumkan **setiap bagian** yang dibantu AI, untuk apa, dan cara kalian memeriksanya. Sertakan minimal satu contoh prompt.
* Kalau tidak memakai AI: *"Saya tidak menggunakan AI dalam mengerjakan tugas ini."*
* Bersiaplah ditanya, misalnya: “kenapa `errorHandler` dipasang paling akhir?” atau “kenapa aturan 409 tidak di Joi?”. Deklarasi tidak jujur dapat mengurangi nilai.

### Kriteria Penilaian

| No | Kriteria | Bobot |
| --- | --- | --- |
| 1 | Rute sesuai varian (daftar + filter, detail, POST, DELETE) dengan status yang benar | 15% |
| 2 | Router dan struktur 4 lapis dengan tanggung jawab benar | 15% |
| 3 | `logger` dan `cekApiKey` bekerja, urutan pemasangan benar | 10% |
| 4 | Validasi Joi sesuai tabel aturan varian | 15% |
| 5 | Aturan bisnis 409 di service | 5% |
| 6 | Error terpusat, format seragam, error 500 tidak membocorkan detail | 10% |
| 7 | `requests.http` lengkap dan screenshot pengujian lengkap | 10% |
| 8 | README.md lengkap di GitHub | 10% |
| 9 | Deklarasi penggunaan AI jujur dan lengkap | 10% |
| **Total** | | **100%** |
| + | **Bonus:** PUT berlapis | +5% |
| + | **Bonus:** API key dari environment | +5% |

### Submission

* Satu repository GitHub bernama **T5-MIDDLEWARE-ERROR**, status **Public**, berisi kode, `requests.http`, screenshot, dan README.
* Upload link repository ke [Berajah](https://berajah-if.unram.ac.id/course/view.php?id=28) — hanya link GitHub, bukan file/ZIP.

**Perhatian:**

* Repository tetap **public** hingga **akhir semester**.
* Proyek harus bisa dijalankan dengan `npm install` lalu `npm run dev`; `node_modules` tidak di-upload.
* Kode yang di-commit harus kode yang benar, bukan yang sengaja dirusak untuk uji 500.

Tugas 5 — Pemrograman Web Lanjut — Middleware & Penanganan Error Terpusat

Teknik Informatika - Universitas Mataram © 2026