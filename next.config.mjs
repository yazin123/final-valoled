/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['project-bucket-001.s3.ap-south-1.amazonaws.com', 'example.com', 'media.linealight.com', 'light-store-demo.s3.ap-south-1.amazonaws.com']
    },
    webpack: (config) => {
        // Add support for importing pdf files and node modules
        config.module.rules.push({
            test: /\.node$/,
            use: 'node-loader',
        });

        return config;
    },
    // This helps with certain react-pdf functionality
    experimental: {
        serverActions: true,
    },
    // Add rewrites to handle API requests
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://13.235.75.225:3000/api/:path*'
            }
        ];
    },
};

export default nextConfig;