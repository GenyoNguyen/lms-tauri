/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export'
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io"
            }
        ]
    }
};

export default nextConfig;
