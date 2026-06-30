/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode para detectar problemas de hidratação
  reactStrictMode: true,

  // Imagens de domínios externos permitidos
  images: {
    remotePatterns: [
      {
        // Supabase Storage (avatars, fotos)
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // O redirecionamento de "/" é tratado pelo middleware (src/middleware.ts),
  // que decide entre /mesa (autenticado) e /login (não autenticado).
  // Não duplicar aqui para evitar redirect duplo.
}

export default nextConfig
