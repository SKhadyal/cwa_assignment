import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["sequelize", "sqlite3"],
};

export default nextConfig;
