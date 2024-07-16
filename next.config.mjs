// next.config.mjs
import path from 'path'; // Import modul path dari Node.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Mendapatkan path absolut ke direktori proyek
    const projectDir = path.dirname(new URL(import.meta.url).pathname);

    // Tambahkan alias atau penyesuaian resolusi modul di sini jika diperlukan
    config.resolve.alias = {
      ...config.resolve.alias,
      '@app': path.resolve(projectDir, 'src/app'), // Contoh penambahan alias
      // Tambahkan lebih banyak alias sesuai kebutuhan
    };

    return config;
  },
};

export default nextConfig;
