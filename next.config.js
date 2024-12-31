/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/, // Match .svg files
      use: ["@svgr/webpack"], // Use @svgr/webpack loader
    });
    return config; // Return the modified config
  },
};

module.exports = nextConfig;
