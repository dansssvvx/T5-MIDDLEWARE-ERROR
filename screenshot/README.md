# Daftar screenshot yang wajib diambil

File PNG belum dihasilkan otomatis. Jalankan `npm run dev`, kirim request dari `requests.http` dengan REST Client/Postman, lalu tangkap layar memakai `Win + Shift + S` (Snipping Tool) dan simpan di folder ini dengan nama berikut.

| Nama file | Cara menghasilkan |
| --- | --- |
| `01-terminal-logger.png` | Kirim nomor 4, 7, 9, 6, 14 berurutan; terminal harus menampilkan `GET /menu/999 -> 404`, `POST /menu -> 401`, `POST /menu -> 422`, `POST /menu -> 201`, `DELETE /menu/5 -> 204` |
| `02-get-404.png` | Nomor 4: panel REST Client menampilkan 404 `NOT_FOUND` |
| `03-route-404.png` | Nomor 5: 404 `ROUTE_NOT_FOUND` |
| `04-post-401.png` | Nomor 7: 401 `API_KEY_MISSING` |
| `05-post-422.png` | Nomor 9: 422 `VALIDATION_ERROR` dengan empat detail terlihat |
| `06-post-409.png` | Nomor 10: 409 `NAMA_DUPLIKAT` |
| `07-post-201.png` | Nomor 6: 201 dengan data menu baru |
| `08-delete-204.png` | Nomor 14: status 204 dan body kosong |
| `09-put-200.png` | Nomor 11: 200 dengan data yang diperbarui (bonus) |
| `10-error-500-client.png` | Nomor 17 setelah `push` disabotase: klien 500, pesan `Terjadi kesalahan pada server`, tanpa stack |
| `11-error-500-terminal.png` | Terminal pada saat yang sama: `[SERVER_ERROR]` plus stack lengkap |
| `12-requests-http.png` | `requests.http` terbuka di VS Code dengan daftar request terlihat |

Setelah `10` dan `11` diambil, kembalikan `menu.dorong(baru)` menjadi `menu.push(baru)` di `src/data/menu.data.js`, restart server, dan pastikan nomor 6 kembali menghasilkan 201 sebelum commit.

## Bukti teks hasil pengujian nyata

Empat berkas berikut berisi keluaran asli dari proses verifikasi (bukan screenshot, bukan contoh rekaan) dan dapat dipakai sebagai rujukan saat mengambil screenshot:

| File | Isi |
| --- | --- |
| `bukti-teks-respons.txt` | 16 skenario `requests.http`, hasil `RESULT 16/16` |
| `bukti-teks-terminal-logger.txt` | Baris logger sungguhan untuk status 200, 404, 401, 422, 201, 204 |
| `bukti-teks-terminal-500.txt` | `[SERVER_ERROR] TypeError: menu.dorong is not a function` + stack lengkap di terminal |
| `bukti-teks-client-500.txt` | Respons klien 500 berisi pesan umum, tanpa stack |
