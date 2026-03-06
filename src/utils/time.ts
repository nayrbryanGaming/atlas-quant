export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getUnixTimestamp = (): number => Math.floor(Date.now() / 1000);
