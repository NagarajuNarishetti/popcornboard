/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['image.tmdb.org', 'img.omdbapi.com', 'm.media-amazon.com'],
  },
}

module.exports = nextConfig