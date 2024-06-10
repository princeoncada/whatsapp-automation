import puppeteer from "puppeteer";
import 'dotenv/config';

export async function setSender() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
            process.env.NODE_ENV === "production" 
                ? '--user-data-dir=/usr/src/app/user-data' 
                : '--user-data-dir=./user-data-dev'
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });
    try {
        const page = await browser.newPage();
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";

        await page.setUserAgent(ua);
        await page.goto("https://web.whatsapp.com/");

        await page.waitForSelector('canvas[aria-label]');
        const button = await page.waitForSelector('span[role="button"]');
        await button.click();

        const input = await page.waitForSelector('input[aria-label="Type your phone number."]');
        await input.click();
        await input.press('ArrowLeft');
        await input.press('Backspace');
        await input.press('Backspace');
        await input.press('Backspace');
        await input.type('16892250141');

        const nextBtn = await page.waitForSelector('xpath///div[contains(text(), "Next")]')
        await nextBtn.click();

        await page.waitForSelector('div[aria-details="link-device-phone-number-code-screen-instructions"] > div > div');
        const codeArray = await page.$$eval('div[aria-details="link-device-phone-number-code-screen-instructions"] > div > div span', spans => {
            return spans.map(span => span.textContent);
        });

        console.log(`Please enter this code: ${codeArray.join(', ')}`);

        await page.waitForSelector('span[title="mbusttt"]', { timeout: 60000 })
    } catch (e) {
        console.error(e);
    }
    await browser.close();
};

export async function sendMessage(message) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
            process.env.NODE_ENV === "production" 
                ? '--user-data-dir=/usr/src/app/user-data' 
                : '--user-data-dir=./user-data-dev'
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });
    try {
        const page = await browser.newPage();
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";

        await page.setUserAgent(ua);
        await page.goto("https://web.whatsapp.com/");

        const groupChat = await page.waitForSelector('span[title="mbusttt"]');
        await groupChat.click();
        const msgBox = await page.waitForSelector('div[aria-label="Type a message"]');
        await msgBox.click();

        const lines = message.split('\n');
        for (const line of lines) {
            await page.keyboard.type(line);
            await page.keyboard.down('Shift');
            await page.keyboard.press('Enter');
            await page.keyboard.up('Shift');
        }

        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (e) {
        console.log(e);
    }

    await browser.close();
}