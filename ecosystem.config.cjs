module.exports = {
    apps: [
        {
            name: "bbdbuy-pc",
            script: "./node_modules/next/dist/bin/next",
            args: "start -p 3000",
            cwd: "/usr/frontend/bbdbuy-pc",
            instances: 1,
            watch: false,
            autorestart: true,
            max_memory_restart: "600M",
            env: {
                NODE_ENV: "production"
            },
            output: "/var/log/bbdbuy-pc/out.log",
            error: "/var/log/bbdbuy-pc/error.log"
        }
    ]
};
