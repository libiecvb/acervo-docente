import nextra from 'nextra'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

// Nextra 4.x: docs folder is automatically detected
// theme.config.tsx is auto-loaded from docs/
export default nextra({
  defaultShowCopyCode: true,
})(nextConfig)
