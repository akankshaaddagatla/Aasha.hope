/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
