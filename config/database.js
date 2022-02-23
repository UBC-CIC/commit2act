module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", ""),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", ""),
      user: env("DATABASE_USERNAME", ""),
      password: env("DATABASE_PASSWORD", ""),
    },
        pool: {
          "min": 0,
          "max": 50,
          "idleTimeoutMillis": 60000,
          "createTimeoutMillis": 60000,
          "acquireTimeoutMillis": 60000
        }
    },
    useNullAsDefault: true,
});
