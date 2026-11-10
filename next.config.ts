import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The complaint page moved to a Google Form. Old links go to the complaint section on the home page.
  async redirects() {
    return [{ source: "/khieu-nai", destination: "/#khieu-nai", permanent: true }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
