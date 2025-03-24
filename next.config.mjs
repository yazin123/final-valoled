/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['project-bucket-001.s3.ap-south-1.amazonaws.com', 'example.com', 'media.linealight.com', 'light-store-demo.s3.ap-south-1.amazonaws.com']
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.node$/,
            use: 'node-loader',
        });
        return config;
    },
    experimental: {
        serverActions: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: 'http://13.235.75.225:3000/api/v1/:path*'
            }
        ];
    },
    // Add a fallback to handle mixed content
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: 'upgrade-insecure-requests'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;