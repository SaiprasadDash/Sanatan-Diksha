/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.sanatandiksha.com' },
    ],
  },
};
export default nextConfig;
