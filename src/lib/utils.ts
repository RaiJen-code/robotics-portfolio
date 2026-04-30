/**
 * imgSrc — prefix path gambar dengan basePath agar benar di GitHub Pages
 *
 * Kenapa perlu ini?
 * - Di GitHub Pages, site ada di: https://user.github.io/robotics-portfolio/
 * - Gambar ada di:               https://user.github.io/robotics-portfolio/images/xxx.jpg
 * - Tapi jika pakai "/images/xxx.jpg" (slash di depan), browser cari di:
 *   https://user.github.io/images/xxx.jpg  ← SALAH, basePath hilang
 *
 * Solusi: tambahkan NEXT_PUBLIC_BASE_PATH di depan setiap path gambar.
 *
 * Contoh pakai:
 *   <img src={imgSrc('/images/projects/somebody.jpg')} />
 *   → di development:  /images/projects/somebody.jpg
 *   → di GitHub Pages: /robotics-portfolio/images/projects/somebody.jpg
 */
export function imgSrc(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${base}${path}`;
}
