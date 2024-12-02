/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home-financeira', // ou o caminho da sua página home
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig 