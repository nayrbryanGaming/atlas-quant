// JSON structured logger to ensure readable output on Vercel and no direct secret leaking
export const logger = {
    info: (message: string, meta?: unknown) => {
        console.log(JSON.stringify({ level: 'info', message, timestamp: new Date().toISOString(), ...(typeof meta === 'object' && meta !== null ? meta : { meta }) }));
    },
    error: (message: string, error?: unknown) => {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(JSON.stringify({ level: 'error', message, timestamp: new Date().toISOString(), error: errorMsg }));
    },
    warn: (message: string, meta?: unknown) => {
        console.warn(JSON.stringify({ level: 'warn', message, timestamp: new Date().toISOString(), ...(typeof meta === 'object' && meta !== null ? meta : { meta }) }));
    }
};
