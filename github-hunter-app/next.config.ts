import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 启用静态导出
  // 可选：自定义导出目录（默认是 'out'）
  distDir: 'out',

};

export default nextConfig;
