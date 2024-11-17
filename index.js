const puppeteer = require('puppeteer');
const { BSKY_EMAIL, BSKY_PW } = require('./SECRETS');
const randomAdjective = require('./getAdjective');
const newDisplayName = `${randomAdjective} dolphin`;

(async () => {
    try {
        //---this line for raspbian---
        // const browser = await puppeteer.launch({ product: 'chrome', executablePath: '/usr/bin/chromium-browser' });
        //---this line for other linux---
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto('https://bsky.app/');
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
        });

        const signInButton = await page.$('button[aria-label="Sign in"]');
        await signInButton.click();

        const emailInput = await page.$(
            '#root > div > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div.css-175oi2r.r-dta0w2 > div > div > div > div > div:nth-child(2) > div.css-175oi2r > div:nth-child(1) > input'
        );
        const passwordInput = await page.$(
            '#root > div > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div.css-175oi2r.r-dta0w2 > div > div > div > div > div:nth-child(2) > div.css-175oi2r > div:nth-child(2) > input'
        );

        await emailInput.type(BSKY_EMAIL);
        await passwordInput.type(BSKY_PW);

        const loginSubmitButton = await page.$(
            '#root > div > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div.css-175oi2r.r-dta0w2 > div > div > div > div > div:nth-child(3) > button:nth-child(3)'
        );
        await loginSubmitButton.click();

        await page.waitForNavigation({
            waitUntil: 'networkidle2',
        });

        await page.goto('https://bsky.app/profile/rngdolphins.bsky.social', {
            waitUntil: 'networkidle2',
        });

        const editProfileButton = await page.$('[aria-label="Edit profile"]');
        editProfileButton.click();

        await page.waitForTimeout(1000);

        const displayNameInput = await page.$('input[aria-label="Display name"]');
        await displayNameInput.click({ clickCount: 3 });
        await displayNameInput.press('Backspace');
        await displayNameInput.type(newDisplayName);

        const saveChangesButton = await page.$('button[aria-label="Save"]');
        await saveChangesButton.click();

        console.log(`Cohost display name changed to ${newDisplayName}`);

        await browser.close();
    } catch (error) {
        console.log(error);
    }
})();
