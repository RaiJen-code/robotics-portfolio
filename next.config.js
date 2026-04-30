/** @type {import('next').NextConfig} */

// Ganti dengan nama repo GitHub kamu, misal: /robotics-portfolio
// Jika menggunakan custom domain, biarkan basePath kosong: ''
const REPO_NAME = process.env.REPO_NAME || '';

const nextConfig = {
  output: 'export',           // Static export — WAJIB untuk GitHub Pages
  basePath: REPO_NAME,        // Set ke '' jika pakai custom domain
  assetPrefix: REPO_NAME,     // Set ke '' jika pakai custom domain
  trailingSlash: true,        // GitHub Pages butuh trailing slash
  
  images: {
    unoptimized: true,        // GitHub Pages tidak support Next Image Optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Pastikan semua pages di-generate saat build
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Environment variables yang aman di-expose ke frontend
  env: {
    N8N_CHAT_WEBHOOK: process.env.N8N_CHAT_WEBHOOK || '',
    N8N_SERVICE_WEBHOOK: process.env.N8N_SERVICE_WEBHOOK || '',
    N8N_CONTACT_WEBHOOK: process.env.N8N_CONTACT_WEBHOOK || '',
    FORMSPREE_ID: process.env.FORMSPREE_ID || '',
    SITE_URL: process.env.SITE_URL || 'https://username.github.io',
  },
};

module.exports = nextConfig;
