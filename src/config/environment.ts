const env = {
  watch_files: process.env.WATCH_FILES || 1,
  passphrase: process.env.PASSPHRASE || 'secret',
  node_env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000
}

export default env
