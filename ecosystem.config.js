module.exports = {
    apps: [
        {
        name: 'Nehre FRONT',
        cwd: '/var/www/nehre-front',
        script: 'npm run start',
        env: {
            "NEXTAUTH_URL": "https://cosmoline.166tech.az",
            "NEXTAUTH_SECRET": "I3D1tDJyWCVQSC/z52thJ1CmZoY3SN80QRiey811uVg="
        },
    },
]};