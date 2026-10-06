# MoneyChanger-DigiDocWebApp

**w-app**: preview interaktif UI kasir web dan tablet pelanggan, menggunakan React, Vite, dan TypeScript. Repository ini terpisah dari **m-app** (`MoneyChanger-DigiDocApp`).

## Menjalankan lokal

Gunakan Node.js 24 dan npm 11.

```sh
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite (default `http://127.0.0.1:5173`; bila port terpakai, Vite memilih port berikutnya). Halaman awal adalah meja kasir. Konfigurasi opsional tersedia di `.env.example`; hanya `VITE_APP_NAME` yang digunakan.

```sh
npm run check
npm run test:watch
npm run build
npm run preview
```

`check` menjalankan format, ESLint, TypeScript, Vitest, dan build. CI menjalankan pemeriksaan yang sama pada push ke `main` dan pull request. Commit PR diperiksa dengan Conventional Commits, misalnya `feat(ui): add cashier layout`.

## Dokumentasi

Sumber dokumentasi: vault Obsidian `MoneyChangerDigiDoc-Obsidian` di repository m-app, folder `Planning/WebApp`. Mulai dari catatan **01 - W-App Index**. Dokumentasi m-app tetap terpisah dan ditautkan melalui indeks repository.

Lokasi lokal vault: `/Users/afi/Documents/Projects/MoneyChanger-DigiDocApp/MoneyChangerDigiDoc-Obsidian`.

Referensi desain asli tersedia di `design-system/`; CSS token aktif berada di `src/styles/theme.tokens.css`. Flow/layout mengacu pada [Figma DigiDoc](https://www.figma.com/design/uKeY5jzugbgzL96JgixVyc/DigiDoc?node-id=213-2), sedangkan warna/font/komponen mengikuti lampiran yang disetujui.

## Review UI

| Rute              | Tampilan                                                                          |
| ----------------- | --------------------------------------------------------------------------------- |
| `#/cashier`       | Antrean, sesi QR, walk-in KTP/paspor, nominal, pembayaran, struk, tutup meja      |
| `#/tablet`        | Liveness contoh, konfirmasi ID/EN, persetujuan, tanda tangan visual, terima kasih |
| `#/rates`         | Kurs contoh, pencarian dan pembaruan tampilan                                     |
| `#/transactions`  | Riwayat, filter, struk, ekspor CSV                                                |
| `#/design-system` | Token, komponen, dan contoh state                                                 |

Mulai dengan **Proses A-07** untuk QR atau **Walk-in · KTP / paspor** untuk pelanggan baru. Respons HP, chip, foto, liveness, dan transfer tersedia sebagai tombol simulasi. **Review UI** menyediakan loading/kosong/error dan reset seluruh data demo. Panduan lengkap: catatan Obsidian **07 - Panduan Review UI**.

Seluruh data adalah fixture. Nominal, kurs, total, dan kembalian merupakan angka contoh yang sudah ditetapkan; tidak ada kalkulasi finansial, API, database, autentikasi, kamera, atau transaksi nyata. Perubahan hanya bertahan selama halaman terbuka, dan reset setelah refresh. Kasir dan tablet berbagi state pada tab yang sama; perangkat/tab berbeda belum tersinkronisasi. QR merupakan visual demo. Tanda tangan merupakan goresan lokal yang dibuang ketika layar dilepas; tidak menghasilkan dokumen bertanda tangan legal.

Flow/layout mengikuti referensi Figma; 29 frame flow yang tersedia berupa gambar raster, sehingga layar dibangun kembali dengan elemen React interaktif dan token lampiran. Preview bukan salinan piksel persis.

## Deployment Vercel

UI online: [moneychanger-digidocwebapp.vercel.app](https://moneychanger-digidocwebapp.vercel.app).

`vercel.json` menetapkan Vite, `npm ci`, `npm run build`, dan output `dist`. Navigasi menggunakan hash sehingga tidak memerlukan rewrite SPA. `.vercelignore` mengecualikan file lokal, environment, dependencies, dan dokumen referensi dari upload; `.vercel` dan environment lokal tidak masuk Git.

Deployment production pertama dilakukan melalui CLI pada scope `kaifazhe`. Setelah login dan linking project, perubahan dapat diunggah dengan `npx vercel deploy --prod --scope kaifazhe`. Koneksi GitHub otomatis belum berhasil, jadi push repository belum memicu deployment Vercel. Status dan prosedur lengkap dicatat di Obsidian **10 - Deployment Vercel**.
