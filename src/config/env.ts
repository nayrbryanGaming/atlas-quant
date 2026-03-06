export const ENV = {
    COINGECKO_API_URL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    MASTER_PUBLIC_KEY: process.env.MASTER_PUBLIC_KEY || 'BgpTkU2YVazAhBvbBxBgMncZ7kAaTXRFvygv7GQqbUgA',
    CRON_SECRET: process.env.CRON_SECRET || '',
    FEATURE_AI_ENABLED: process.env.FEATURE_AI_ENABLED === 'true',
};
