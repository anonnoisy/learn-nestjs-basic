var dbConfig = {
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
};

switch (process.env.NODE_ENV) {
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true,
        }, dbConfig);
        break;
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ['**/*.entity.js'],
            migrationsRun: true,
            ssl: {
                rejectUnauthorized: true
            },
        });
        break;
    default:
        throw new Error('Unknown environment');
        break;
}

console.log(dbConfig);

module.exports = dbConfig;