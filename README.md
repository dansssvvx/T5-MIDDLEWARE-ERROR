# Tugas 5 - Middleware & Error Terpusat

## Identitas
- Nama : Ahmad Ramadhani R
- NIM  : F1D02310102 (Varian: B — Kantin, resource `/menu`)

Digit terakhir NIM adalah `2` (genap), maka yang dikerjakan Varian B saja.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. API key default: `pwl-secret-key-2026`, dikirim lewat header `x-api-key` pada `POST`, `PUT`, dan `DELETE`.

Kunci dibaca dari `process.env.API_KEY` (bonus). Salin `.env.example` menjadi `.env` untuk menggantinya:

```bash
cp .env.example .env
```

**Apa yang terjadi bila `API_KEY` tidak diset:** server tetap jalan memakai kunci default `pwl-secret-key-2026` dan menulis peringatan sekali di terminal saat modul dimuat. Pilihan ini saya pakai supaya proyek bisa langsung dijalankan dengan `npm install` + `npm run dev` tanpa membuat `.env` dulu; untuk lingkungan nyata, `.env` sebaiknya wajib dan kunci default dihapus. Port dapat diubah lewat `PORT`, mode lewat `NODE_ENV`.

## Struktur Proyek

```text
T5-MIDDLEWARE-ERROR/
├── src/
│   ├── index.js                    # titik masuk: pasang express.json, logger global, router /menu, notFound, errorHandler
│   ├── routes/
│   │   └── menu.routes.js          # memetakan URL ke controller + menentukan urutan middleware per rute
│   ├── controllers/
│   │   └── menu.controller.js     # menerima req/res, memanggil service, mengirim status 200/201/204, melempar error ke next()
│   ├── services/
│   │   └── menu.service.js        # async, aturan bisnis (404 & 409 duplikat nama), tidak tahu apa-apa soal req/res
│   ├── data/
│   │   └── menu.data.js           # array 5 menu awal + operasi find/create/update/remove (tempat uji 500)
│   ├── validators/
│   │   └── menu.validator.js      # skema Joi + middleware validate(schema) dengan abortEarly: false
│   ├── middlewares/
│   │   ├── logger.js              # mencatat METHOD URL -> STATUS (n ms) untuk setiap request
│   │   ├── cekApiKey.js           # memeriksa header x-api-key, 401 bila kosong/salah
│   │   └── error.js               # notFound + errorHandler (4 parameter, satu-satunya pengirim respons error)
│   └── errors/
│       └── app-error.js            # kelas AppError: statusCode, code, pesan
├── requests.http                   # 17 skenario uji REST Client
├── screenshot/                     # bukti pengujian (lihat daftar di bawah)
├── .env.example
├── .gitignore
└── README.md
```

Alur satu request: `index.js → logger → router → (cekApiKey → validasi) → controller → service → data`; bila ada error, `next(err)` meneruskannya ke `errorHandler` di paling akhir.

## Endpoint

| Method | URL | Middleware | Status |
| --- | --- | --- | --- |
| GET | `/menu` | logger | 200 daftar seluruh menu |
| GET | `/menu?kategori=minuman` | logger | 200 daftar yang sudah difilter |
| GET | `/menu/:id` | logger | 200, atau 404 `NOT_FOUND` |
| POST | `/menu` | logger → cekApiKey → validasi | 201, atau 401 / 422 / 409 |
| PUT | `/menu/:id` (bonus) | logger → cekApiKey → validasi | 200, atau 401 / 404 / 409 / 422 |
| DELETE | `/menu/:id` | logger → cekApiKey | 204 tanpa body, atau 401 / 404 |
| * | URL lain | logger → notFound | 404 `ROUTE_NOT_FOUND` |

Lima data awal: Nasi Goreng Kambing (18000, makanan), Es Teh Manis (5000, minuman), Keripik Pisang (8000, camilan, `tersedia: false`), Soto Ayam Lamongan (15000, makanan), Kopi Susu Gula Aren (12000, minuman).

## Aturan Validasi, Aturan Bisnis, dan Kode Error

Validasi Joi (`validators/menu.validator.js`, `abortEarly: false`):

| Field | Aturan |
| --- | --- |
| `nama` | string, 3–50 karakter, wajib |
| `harga` | bilangan bulat, 1000–100000, wajib |
| `kategori` | salah satu `makanan`, `minuman`, `camilan`, wajib |
| `tersedia` | boolean, default `true` bila tidak dikirim |

Karena `abortEarly: false`, satu request dengan empat field salah mengembalikan empat pesan sekaligus di `error.detail` (lihat `requests.http` nomor 9).

Aturan bisnis: `nama` tidak boleh kembar, abaikan huruf besar/kecil (`es teh manis` bentrok dengan `Es Teh Manis`) → 409 `NAMA_DUPLIKAT`. Aturan ini ada di **service**, bukan di Joi, karena Joi hanya memeriksa bentuk satu body request; pengecekan kembar perlu melihat seluruh data yang tersimpan di lapis `data/`, bersifat stateful, dan juga dipakai ulang oleh `PUT`. Memasukkannya ke Joi akan mencampurkan validasi format dengan aturan bisnis serta membuat Joi bergantung pada database.

Daftar kode error:

| Kode | Status | Muncul saat |
| --- | --- | --- |
| `API_KEY_MISSING` | 401 | header `x-api-key` tidak ada atau kosong |
| `API_KEY_INVALID` | 401 | header `x-api-key` tidak cocok |
| `VALIDATION_ERROR` | 422 | skema Joi gagal; `error.detail` berisi semua field yang salah |
| `NAMA_DUPLIKAT` | 409 | nama menu sudah ada (case-insensitive) |
| `NOT_FOUND` | 404 | id menu tidak ditemukan |
| `ROUTE_NOT_FOUND` | 404 | URL tidak dikenal |
| `INTERNAL_ERROR` | 500 | error tak terduga; pesan klien selalu "Terjadi kesalahan pada server", stack hanya di terminal |

Semua error lewat satu `errorHandler` dengan format `{ "error": { "pesan": "...", "kode": "..." } }`. Tidak ada `res.status(4xx).json(...)` yang ditulis manual di controller.

## Pengujian

Jalankan `npm run dev`, lalu kirim request dari `requests.http` lewat REST Client (ekstensi VS Code) atau Postman. `requests.http` berisi 17 skenario: daftar, filter, detail ada/404, URL tak dikenal, POST 201/401/422/409, PUT 200/404, DELETE 401/204/404, dan uji 500.

Screenshot yang harus ada di folder `screenshot/` (belum dibuat otomatis — ambil dari lingkungan Anda sendiri, panduan ada di `screenshot/README.md`):

| File | Isi |
| --- | --- |
| `01-terminal-logger.png` | Terminal server dengan baris logger berisi status 404, 401, 422, 201, 204 |
| `02-get-404.png` | Hasil `GET /menu/999` → 404 `NOT_FOUND` |
| `03-route-404.png` | Hasil `GET /rute-tidak-ada` → 404 `ROUTE_NOT_FOUND` |
| `04-post-401.png` | Hasil POST tanpa `x-api-key` → 401 |
| `05-post-422.png` | Hasil POST dengan empat field salah → 422, semua detail terlihat |
| `06-post-409.png` | Hasil POST `es teh manis` → 409 `NAMA_DUPLIKAT` |
| `07-post-201.png` | Hasil POST valid → 201 beserta data baru |
| `08-delete-204.png` | Hasil DELETE dengan API key → 204, body kosong |
| `09-put-200.png` | Hasil PUT `/menu/3` → 200 (bonus) |
| `10-error-500-client.png` | Klien menerima 500 dengan pesan umum, tanpa stack trace |
| `11-error-500-terminal.png` | Terminal menampilkan `[SERVER_ERROR]` dan stack lengkap |
| `12-requests-http.png` | File `requests.http` terbuka di VS Code |

Sebagai pelengkap, folder `screenshot/` juga berisi empat berkas `.txt` berisi keluaran asli verifikasi (16/16 skenario lolos, baris logger, stack 500 di terminal, dan respons 500 di klien).

Untuk uji 500: ubah sementara `menu.push(baru)` menjadi `menu.dorong(baru)` di `src/data/menu.data.js`, restart server, kirim request nomor 17, tangkap kedua screenshot, lalu **kembalikan** menjadi `menu.push(baru)` dan restart sebelum commit.

## Deklarasi Penggunaan AI

| Bagian | Alat AI | Dipakai untuk apa | Cara saya memeriksa hasilnya |
|--------|---------|-------------------|------------------------------|
| Kerangka proyek, router, dan 4 lapis | OpenCode (AI agent) | Menyusun struktur `src/`, memasang router `/menu` di `index.js`, memisahkan controller/service/data | Membaca tiap file dan memastikan service tidak memakai `req`/`res`; menjalankan `node --check` pada semua file |
| Skema Joi & middleware validasi | OpenCode (AI agent) | Menulis aturan `nama`, `harga`, `kategori`, `tersedia` serta `abortEarly: false` | `requests.http` nomor 9 mengirim empat field salah; respons 422 menampilkan keempat pesan sekaligus |
| Aturan 409 di service | OpenCode (AI agent) | Menerjemahkan aturan "nama kembar abaikan huruf besar/kecil" ke pengecekan di service | `requests.http` nomor 10 mengirim `es teh manis` setelah `Es Teh Manis` ada → 409 `NAMA_DUPLIKAT` |
| Error terpusat & uji 500 | OpenCode (AI agent) | Menulis `AppError`, `notFound`, `errorHandler` 4 parameter, dan menyamarkan error 500 | Nomor 4/5 → 404, nomor 17 setelah sabotase `push` → klien 500 pesan umum, terminal berisi stack |
| `requests.http` dan README.md | OpenCode (AI agent) | Menyusun 17 skenario uji dan dokumentasi dari spesifikasi tugas | Menjalankan seluruh skenario dan mencocokkan status yang tertera di tabel Endpoint |

Contoh prompt yang dipakai:

```text
kerjakan tugas berikut @tugas-05-middleware-error-terpusat.html.md.
Informasi jika dibutuhkan, NAMA : Ahmad Ramadhani R. NIM:F1D02310102
```

Pernyataan: Saya menggunakan AI pada bagian yang tertulis di tabel. Bagian lain saya kerjakan sendiri. Saya sudah menjalankan tiap skenario di `requests.http`, memeriksa status serta isi responsnya, dan memastikan kode yang tersimpan bukan kode yang sengaja dirusak saat uji 500.

## Kesimpulan & Kendala

Sebelum error terpusat, setiap handler menulis `res.status(...).json(...)` sendiri sehingga format pesan berbeda-beda, stack error 500 bisa bocor ke klien, dan rute yang salah jawabannya tidak seragam. Sesudahnya, controller cukup `next(err)`; `notFound` dan `errorHandler` yang dipasang paling akhir mengubah semua kegagalan menjadi satu format `{ error: { pesan, kode } }`, dengan status 500 selalu memakai pesan umum dan stack hanya di terminal. Urutan pemasangan juga menjadi jelas: middleware global → router → `notFound` → `errorHandler`; bila `errorHandler` dipasang sebelum rute, error tidak akan pernah sampai ke sana.

Kendala yang dihadapi dan solusinya:

1. `req.params.id` bertipe string, sehingga perbandingan dengan `id` angka selalu gagal. Solusi: dikonversi ke `Number` di service sebelum `findById`.
2. Lupa memanggil `next()` pada middleware membuat request menggantung. Solusi: setiap middleware diakhiri `next()` atau `next(err)` pada semua cabang.
3. `DELETE` sukses tidak boleh mengirim JSON. Solusi: `res.status(204).end()` tanpa body.
4. Uji 500 menyisakan kode rusak bila lupa dikembalikan. Solusi: langsung mengembalikan `menu.dorong` ke `menu.push` dan menjalankan ulang POST valid sebelum commit.
5. Screenshot harus diambil dari lingkungan VS Code/REST Client sendiri; berkas PNG tidak dihasilkan otomatis oleh proyek ini.
