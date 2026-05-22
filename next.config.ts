import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Pindahkan keluar dari experimental ke root level seperti ini:
  allowedDevOrigins: ["192.168.1.250", "localhost:3000"],
};

export default nextConfig;
