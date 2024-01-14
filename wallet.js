const puppeteer = require("puppeteer")
require("dotenv").config();

const wallet = async (req, res) => {
    const walletAddress = req.params.address

    // Initiate the browser 
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox"
        ],
        executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        headless: 'new',
    }); 

    try {
        // const tokenAddress = 'Adgn26Wpe82fySNELDrtgWvQi8AUyuSd4Mt4TRjfiGCf';
        const TIMEOUT = 30000;
        // Create a new page with the default browser context 
        const page = await browser.newPage(); 

        // Go to the target website 
        await page.goto(`https://solscan.io/account/${walletAddress}`); 

        // Wait for the pagination selector to show up
        await page.waitForSelector('#rc_select_0', {timeout: TIMEOUT});

        // Locate the pagination selector
        const dropdownInput = await page.$('#rc_select_0');
        const clickable = await dropdownInput.isVisible()

        if (clickable) {
            // Click to focus on the input (opens the dropdown)
            await dropdownInput.click();

            // Wait for options to show up
            await page.waitForSelector('.ant-select-item.ant-select-item-option', {timeout: TIMEOUT})

            // Grab dropdown options and select the 4th (50)
            const options = await page.$$('.ant-select-item.ant-select-item-option');
            await options[3].click()
        }

        // Wait for the table to appear on the page
        const tableSelector = '#rc-tabs-0-panel-default table tbody tr'; 
        await page.waitForSelector(tableSelector, {timeout: TIMEOUT});

        // Grab Table data
        const data = await page.$$eval('#rc-tabs-0-panel-default table tbody tr',  rows => {
            return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
            });
        });
        console.log(data)

        res.send(data)
    } catch (e) {
        console.log(e);
        res.send(`Something went wrong while scraping: ${e}`)
    } finally {
        // Closes the browser and all of its pages 
        await browser.close(); 
    }

}

module.exports = { wallet }