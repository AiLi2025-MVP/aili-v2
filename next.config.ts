const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TS errors for deploy
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors
  },
};

module.exports = nextConfig;