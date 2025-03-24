/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['project-bucket-001.s3.ap-south-1.amazonaws.com', 'example.com', 'media.linealight.com','light-store-demo.s3.ap-south-1.amazonaws.com']
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
};

export default nextConfig;