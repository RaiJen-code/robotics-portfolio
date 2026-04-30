# Folder Gambar / Images Folder

Taruh semua foto untuk website di sini.

## Struktur Folder yang Dibutuhkan

```
images/
├── rangga-hero.jpg          ← Foto profil untuk hero section
│                              (portrait, min 800×1200px)
│
└── projects/
    ├── somebody.jpg         ← Project S.O.M.E.B.O.D.Y
    ├── robotic-arm.jpg      ← Project Robotic Arm CV
    ├── pln-pipeline.jpg     ← Project ADW310 Pipeline
    ├── si-jago-merah.jpg    ← Project Si Jago Merah
    ├── filtora.jpg          ← Project FILTORA
    ├── dancetron.jpg        ← Project DANCETRON
    └── greenhouse.jpg       ← Project Smart Greenhouse
```

## Ukuran yang Direkomendasikan

| Foto | Ukuran | Format |
|------|--------|--------|
| Hero profile | 800×1200px (portrait) | JPG, max 500KB |
| Project cover | 1200×700px (landscape) | JPG, max 300KB |

## Tips Compress Foto

Sebelum upload, compress foto agar website tetap cepat:
- Online: https://squoosh.app (gratis, bagus)
- Online: https://tinypng.com (gratis)
- Target ukuran file: < 300KB per foto

## Cara Update Foto di HTML (rangga-portfolio.html)

Cari teks berikut di `rangga-portfolio.html` dan ganti path-nya:

```html
<!-- Hero photo -->
<img id="heroImg" src="images/rangga-hero.jpg" ...>

<!-- Project photos -->
<img src="images/proj-somebody.jpg" ...>
<img src="images/proj-roboticarm.jpg" ...>
```

Untuk Next.js (`rangga-portfolio.html` sudah handle otomatis via frontmatter markdown).
