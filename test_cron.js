fetch('https://atlas-quant.vercel.app/api/cron/market-scan', {
    headers: { 'Authorization': 'Bearer ' }
}).then(res => res.json()).then(console.log).catch(console.error);
