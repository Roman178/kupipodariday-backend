export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  db: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: 'student',
    password: 'student',
    databaseName: 'kupipodariday',
  },
  jwtSecret: 'jwtSecret',
  emailDistributionSMTPT: {
    email: 'VasTopVas@yandex.ru',
    password: 'psqrvrudhxjvqwnk',
    host: 'smtp.yandex.ru',
    port: 465,
    testHost: 'smtp.ethereal.email',
    testPort: 587,
  },
});
