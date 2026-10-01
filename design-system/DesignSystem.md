# Design System & Tema

Panduan visual generik untuk warna, tipografi, layout, komponen, dan interaksi.

Karakter visual: latar terang, kartu putih dengan sudut membulat, aksen biru-violet, dan hero navy dengan pola jaringan cyan.

Warna dibagi menjadi **primitive** (palet dasar) dan **semantic** (fungsi UI). Gunakan alias seperti `bg-primary`, `text-danger`, dan `border-border` untuk menyatakan fungsi. Palet `magenta` menunjuk biru-violet; `pumkin` adalah nama token untuk palet oranye.

## Warna semantic

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `primary` | `#362fd9` | Aksi utama, tab aktif, aksen |
| `primary-hover` | `#2c25cb` | Hover aksi utama |
| `primary-active` | `#2923be` | Pressed aksi utama |
| `primary-subtle` | `#ebeafb` | Latar aksen lembut |
| `primary-disabled` | `#c3c1f4` | Aksi utama nonaktif |
| `success` | `#42b549` | Status sukses |
| `success-subtle` | `#ecf8ed` | Latar status sukses |
| `danger` | `#fc2947` | Error, aksi destruktif |
| `danger-subtle` | `#ffeaed` | Latar error/destruktif |
| `warning` | `#fe690f` | Peringatan |
| `warning-subtle` | `#fff0e7` | Latar peringatan |
| `background` | `#f8fafe` | Latar halaman |
| `surface` | `#ffffff` | Kartu, input, dialog |
| `foreground` | `#202024` | Teks utama |
| `muted` | `#959398` | Teks pendukung |
| `border` | `#d5d4d6` | Garis pembatas/input |

## Palet primitive

Semua nilai berasal langsung dari `@theme`.

| Palet | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| magenta | `#ebeafb` | `#c3c1f4` | `#9b97ec` | `#5e59e1` | `#362fd9` | `#2c25cb` | `#2923be` | `#2721b2` | `#241fa6` |
| pumkin | `#fff0e7` | `#ffd2b7` | `#ffb487` | `#fe873f` | `#fe690f` | `#fe6001` | `#f45c01` | `#e55701` | `#da5301` |
| red-velvet | `#ffeaed` | `#febfc8` | `#fe94a3` | `#fd697e` | `#fc2947` | `#fc0e2f` | `#ec0324` | `#d30321` | `#ba031d` |
| matcha | `#ecf8ed` | `#c6e9c8` | `#a1daa4` | `#68c46d` | `#42b549` | `#3da844` | `#399d3f` | `#348e39` | `#2d7b32` |
| neutral | `#f8f8f8` | `#d5d4d6` | `#bfbec1` | `#aaa9ac` | `#959398` | `#807d83` | `#6b686e` | `#555259` | `#49464c` |

Basic: `white` = `#ffffff`, `background` = `#f8fafe`, `black` = `#202024`.

## Tipografi

Font: **Plus Jakarta Sans**, bobot **400 / 500 / 700**, subset Latin. Font stack: `var(--font-plus-jakarta), ui-sans-serif, system-ui, sans-serif`.

| Utility |Ukuran | Line height | Bobot | Letter spacing |
| --- | --- | --- | --- | --- |
| `text-h1` | 56px | 1.1 | 700 | 0.02em |
| `text-h2` | 56px | 1.1 | 400 | 0.02em |
| `text-h3` | 48px | 1.15 | 700 | 0.02em |
| `text-h4` | 36px | 1.2 | 700 | 0.02em |
| `text-h5` | 26px | 1.3 | 700 | 0.02em |
| `text-h6` | 24px | 1.3 | 700 | 0.02em |
| `text-h7` | 20px | 32px | 700 | 0.02em |
| `text-h8` | 20px | 1.4 | 500 | 0.02em |
| `text-xl` | 18px | 24px | Mengikuti konteks | Tidak dioverride oleh token |
| `text-lg` | 16px | 22px | Mengikuti konteks | Tidak dioverride oleh token |
| `text-md` | 14px | 20px | Mengikuti konteks | Tidak dioverride oleh token |
| `text-sm` | 12px | 18px | Mengikuti konteks | Tidak dioverride oleh token |

`h1`–`h8` adalah nama utility tipografi, bukan aturan pemilihan elemen heading HTML. Gunakan `tabular-nums` untuk angka yang perlu sejajar.

## Layout dan spacing

| Pola | Ukuran |
| --- | --- |
| Canvas desktop acuan | 1440px |
| Area konten desktop | 1192px; margin 124px pada canvas 1440px |
| Container konten | Maksimum 1256px termasuk padding |
| Area navigasi desktop | 1136px; container maksimum 1200px termasuk padding |
| Gutter horizontal | 20px; dari `md`: 32px |
| Kartu hero | Padding 20 → 32 → 40px; radius 16 → 24px; desktop min-height 416px |
| Navbar | Tinggi 80px; dari `lg`: 96px |
| Sidebar | Terbuka 16.5rem, ringkas 4.5rem; drawer mobile 17rem |
| Dialog | Lebar viewport dikurangi 2rem; dari `sm`: 440px / 560px; max-height 85vh |
| Tabel lebar | Min-width 720px; scroll horizontal |

Spacing umum: **4, 8, 12, 16, 20, 24, 32, dan 40px**. Utility standar mengikuti skala Tailwind v4; ukuran khusus dapat menggunakan nilai arbitrary.

Breakpoint acuan default: `sm` 40rem, `md` 48rem, `lg` 64rem. Nilai spacing, radius, dan breakpoint standar belum didefinisikan sebagai override dalam CSS tema.

## Radius dan shadow

| Radius | Ukuran |
| --- | --- |
| rounded-md | 6px |
| rounded-lg | 8px |
| rounded-xl | 12px |
| rounded-2xl | 16px |
| rounded-3xl | 24px |
| rounded-full | Bentuk lingkaran/pill |
| Radius kecil | 2px |

Ukuran radius standar mengikuti default Tailwind v4.

| Shadow | Nilai |
| --- | --- |
| shadow-card | `0 4px 16px 0 rgb(32 32 36 / 0.06)` |
| shadow-raised | `0 8px 24px 0 rgb(32 32 36 / 0.08)` |

## Komponen dan state

### Button

Default `primary`, ukuran `md`. Semua varian memakai `font-bold`, `gap-2`, `transition-colors`, dan cursor nonaktif pada state disabled.

| Varian | Default | Hover | Active | Disabled |
| --- | --- | --- | --- | --- |
| Primary | Primary + teks putih | Primary-hover | Primary-active | Primary-disabled |
| Secondary | Primary-subtle + teks primary | Magenta-200 | Magenta-300 | Neutral-100 + teks neutral-400 |
| Tertiary | Transparan + teks primary | Primary-subtle | Magenta-200 | Teks neutral-400 |

| Ukuran | Tinggi | Padding horizontal | Tipografi | Radius |
| --- | --- | --- | --- | --- |
| lg | 48px | 24px | text-lg | 8px |
| md | 40px | 20px | text-md | 8px |
| sm | 32px | 16px | text-md | 6px |
| xs | 28px | 12px | text-sm | 6px |

### Input, select, kartu, dialog

- Input: tinggi 48px, radius 8px, border semantic, surface putih, padding horizontal 16px; focus mengubah border ke primary.
- Select: tinggi 48px; dropdown memakai border, radius 8px, shadow-raised, dan hover primary-subtle.
- Input ringkas: variasi tinggi 32/40/44px sesuai konteks.
- Kartu: surface putih, radius umumnya 16px, shadow-card atau shadow-raised; kartu hero desktop memakai radius 24px.
- Dialog: native `<dialog>`, radius 16px, shadow-raised; scrim hitam 40% dengan blur 2px. Judul berlabel, Escape/backdrop untuk menutup, dan fokus modal native.
- Accordion: `<details>/<summary>` dalam kartu dengan hover teks primary.
- Badge: pasangan warna semantic dan subtle untuk status.
- Grafik dua seri: muted dan primary; garis 2px, fill opacity 0.12, grid border, kurva `monotone`, tinggi 280px.

## Tema

### Tema dasar terang

Background `#f8fafe`, surface `#ffffff`, foreground `#202024`.

### Hero

Background `#0a1f3d`, radial gradient `#0e3a6b`, `#0f4c81`, dan `#062544`. Mesh menggunakan `#22d3ee` / `#67e8f9`, opacity 0.4 atau 0.25 untuk variasi yang lebih lembut.

### Gradient dekoratif emas

| Stop | Warna |
| --- | --- |
| 0% | #F4E4B8 |
| 22% | #BF9B4F |
| 45% | #F7EFD2 |
| 68% | #A8853C |
| 88% | #E8D49A |
| 100% | #8C6D2F |

### Tampilan fullscreen gelap/terang

| Properti | Dark | Light |
| --- | --- | --- |
| Background | #0a0a12 | #f4f6fb |
| Teks utama | #ffffff | #202024 |
| Header border | Putih 10% | Hitam 10% |
| Row border | Putih 15% | Hitam 12% |
| Zebra | Putih 3% | Hitam 2.5% |
| Muted | Neutral-400 | Neutral-500 |
| Muted sekunder | Neutral-300 | Neutral-600 |
| Header aksen | Primary-subtle | Primary |
| Opacity dekorasi latar | 0.07 | 0.11 |

Tampilan mengisi `100dvh`. Ukuran teks dapat disesuaikan dengan tinggi baris dan lebar yang tersedia: angka 14–72px, label 12–52px, heading 11–26px, ilustrasi kecil 14–64px, sebelum pengali ukuran. Skala awal 1×, minimum 0.8×, langkah 0.1×, batas keras 3×; batas nyata mengikuti ruang yang tersedia.

### Cetak

Kertas putih A4, lebar 210mm, padding 12mm, teks basic-black, tanpa shadow saat dicetak. Dekorasi latar opsional: opacity 0.08 dan ukuran 120mm.

## Motion dan ikon

Easing: `cubic-bezier(0.32,0.72,0,1)`. Transisi umum 300ms dan 500ms. Reveal: 800ms, translasi awal 32px ke bawah, opacity 0 → 1, threshold 0.15, sekali saat masuk viewport. Reveal memiliki pemeriksaan `prefers-reduced-motion`; dukungan tersebut belum menjadi aturan global untuk seluruh transisi.

Ikon UI: Lucide React, umumnya 16/20px. Ikon tambahan dapat memakai React Icons.

## Penggunaan

- [`tokens.json`](tokens.json): 107 deklarasi token dengan nilai asli dan hasil resolusi alias, ditambah pengaturan visual generik. Struktur JSON ini bukan skema impor DTCG langsung.
- [`theme.tokens.css`](theme.tokens.css): deklarasi `@theme` untuk Tailwind v4. Impor setelah Tailwind, muat Plus Jakarta Sans, dan sediakan `--font-plus-jakarta`.

CSS tema mencakup token warna, tipografi, dan shadow. Atur background, color, serta font-family halaman menggunakan alias yang sesuai. Varian fullscreen, hero, layout, dan motion dicatat terpisah dalam JSON dan panduan ini.
