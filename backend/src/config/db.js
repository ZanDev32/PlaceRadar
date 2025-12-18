const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

const dropProductivityScoreIfPresent = async () => {
        const ddl = `
DO $$
BEGIN
    IF to_regclass('"Locations"') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE "Locations" DROP COLUMN IF EXISTS productivity_score;';
    END IF;
END $$;
`;

        await sequelize.query(ddl);
};

const ensureProductivityScoreGeneratedColumn = async () => {
        const ddl = `
DO $$
DECLARE
    gen text;
BEGIN
    SELECT attgenerated
        INTO gen
        FROM pg_attribute
     WHERE attrelid = '"Locations"'::regclass
         AND attname = 'productivity_score'
         AND NOT attisdropped;

    IF gen IS NULL THEN
        EXECUTE '
            ALTER TABLE "Locations"
            ADD COLUMN productivity_score integer
            GENERATED ALWAYS AS (
                CASE
                    WHEN wifi_speed_mbps IS NULL OR outlet_per_table IS NULL OR noise_level IS NULL
                    THEN NULL
                    ELSE LEAST(
                        100,
                        GREATEST(
                            0,
                            ROUND(
                                100 * (
                                    0.4 * (LEAST(GREATEST(wifi_speed_mbps, 0), 200)::numeric / 200::numeric)
                                    + 0.3 * (LEAST(GREATEST(outlet_per_table::numeric, 0::numeric), 1.0::numeric) / 1.0::numeric)
                                    + 0.3 * ((5::numeric - LEAST(GREATEST(noise_level, 1), 5)::numeric) / 4::numeric)
                                )
                            )::int
                        )
                    )
                END
            ) STORED;
        ';
    ELSIF gen <> 's' THEN
        EXECUTE 'ALTER TABLE "Locations" DROP COLUMN productivity_score;';
        EXECUTE '
            ALTER TABLE "Locations"
            ADD COLUMN productivity_score integer
            GENERATED ALWAYS AS (
                CASE
                    WHEN wifi_speed_mbps IS NULL OR outlet_per_table IS NULL OR noise_level IS NULL
                    THEN NULL
                    ELSE LEAST(
                        100,
                        GREATEST(
                            0,
                            ROUND(
                                100 * (
                                    0.4 * (LEAST(GREATEST(wifi_speed_mbps, 0), 200)::numeric / 200::numeric)
                                    + 0.3 * (LEAST(GREATEST(outlet_per_table::numeric, 0::numeric), 1.0::numeric) / 1.0::numeric)
                                    + 0.3 * ((5::numeric - LEAST(GREATEST(noise_level, 1), 5)::numeric) / 4::numeric)
                                )
                            )::int
                        )
                    )
                END
            ) STORED;
        ';
    END IF;
END $$;
`;

        await sequelize.query(ddl);
};

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully');

        // sequelize.sync({ alter: true }) will attempt ALTER COLUMN operations.
        // Postgres blocks altering columns that are referenced by GENERATED columns.
        // To keep sync working, we drop the generated column (if any), sync, then recreate it.
        await dropProductivityScoreIfPresent();
        await sequelize.sync({ alter: true }); // Apply model changes to the database
        await ensureProductivityScoreGeneratedColumn();
        console.log('Database synced');
    } catch (error) {
        console.error('PostgreSQL connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };