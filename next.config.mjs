/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false
  },
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *;'
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' }
        ]
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' }
        ]
      }
    ];
  }
};

export default nextConfig;
