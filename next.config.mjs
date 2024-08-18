/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MongoDB_URI: process.env.MongoDB_URI
    }
};

export default nextConfig;
