import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Type errors and lint errors fail the build (no ignoreBuildErrors /
  // ignoreDuringBuilds). All images are served locally from /public, so no
  // remote image hosts need to be allowed.
};

export default nextConfig;
