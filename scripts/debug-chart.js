const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        console.log("Setting local storage token...");
        // Go to an empty page first to set localStorage
        await page.goto('http://localhost:3000');
        await page.evaluate(() => {
            localStorage.setItem('atlas_token', 'test_local_token');
        });

        console.log("Navigating to dashboard...");
        await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });

        console.log("Waiting for error text...");
        await page.waitForSelector('div[style*="color: red"]', { timeout: 10000 });

        const errorText = await page.$eval('div[style*="color: red"]', el => el.textContent);
        console.log("EXTRACTED_ERROR:", errorText);

        await browser.close();
        process.exit(0);
    } catch (err) {
        console.error("Puppeteer Failed:", err);
        process.exit(1);
    }
})();
