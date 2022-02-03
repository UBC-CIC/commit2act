module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f62b42f5ba38ae0be924499b1d4a7ad3'),
  },
});
