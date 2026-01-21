module.exports = {
  apps: [
    {
      name: 'yevudo-app',
      script: './.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3000,
      },
      error_file: './.pm2/logs/err.log',
      out_file: './.pm2/logs/out.log',
      log_file: './.pm2/logs/combined.log',
      time: true,
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      wait_ready: true,
      listen_timeout: 3000,
      kill_timeout: 5000,
    },
  ],
};
