const PG_USERNAME = process.env.PG_USERNAME;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_HOST = process.env.PG_HOST;
const PG_PORT = process.env.PG_PORT;
const PG_DB = process.env.PG_DB;
const SCHEMA = process.env.SCHEMA || 'public';

module.exports = {
  flywayArgs: {
    url: `jdbc:postgresql://${PG_HOST}:${PG_PORT}/${PG_DB}`,
    schemas: SCHEMA,
    defaultSchema: SCHEMA,
    locations: `filesystem:migrations`,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    table: '__migrations',
    sqlMigrationSuffixes: '.sql',
  },
  env: {},
  downloads: {
    storageDirectory: `${__dirname}/flyway-downloads`,
    expirationTimeInMs: -1,
  },
};
