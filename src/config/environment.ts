export interface EnvironmentConfig {
  watch_files: string | undefined;
  node_env: string;
  port: string | number;
}

const env: EnvironmentConfig = {
  watch_files: process.env.WATCH_FILES,
  node_env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000
};

export default env;
