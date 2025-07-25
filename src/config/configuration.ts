export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRATION ?? '3600', 10),
    refreshExpiresIn: parseInt(
      process.env.JWT_REFRESH_EXPIRATION ?? '604800',
      10,
    ),
  },
  apiPrefix: process.env.API_PREFIX || 'api/v1',
});
