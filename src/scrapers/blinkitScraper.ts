import fs from "fs";
import moment from "moment";
import puppeteer from "puppeteer";
import { WebsiteConfig } from "../config/scraping-config";
import { objToCsv } from "../helpers/fileModifier";
import { scrollToEnd } from "./smoothScroll";
import { scrapProducts } from "./scrapeProducts";

export const scrapBlinkit = async (config: WebsiteConfig) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // const userAgents = [
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
    //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    // ];

    // await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

    await page.goto(config.url);

    await page.setViewport({ width: 1600, height: 768 });

    await page.waitForSelector('input[name="select-locality"]', { visible: true, timeout: 60000 });

    await page.click('input[name="select-locality"]');

    await page.type('input[name="select-locality"]', '110059', { delay: 200 });

    await page.waitForSelector('.address-icon-container', { visible: true, timeout: 60000 });

    await page.click('.address-icon-container');

    const elementSelector = '.gwkGLQ:nth-of-type(3)';
    await page.waitForSelector(elementSelector, { visible: true, timeout: 60000 });
    await page.click(elementSelector);

    const productBlock = config.selectors.productListContainerSelector;
    await page.waitForSelector(productBlock, { visible: true, timeout: 60000 });
    const scrollContainerElement: HTMLElement = await page.$(productBlock) as unknown as HTMLElement;

    await page.evaluate((element: HTMLElement) => {
        if (element) {
            element.style.height = '400px';
        }
    }, scrollContainerElement);

    // common scrape behavior

    const categorySelector = ".CategoryListItem__Container-sc-ve8uzt-0"
    const productGridSelector = ".products--grid";

    await page.waitForSelector(categorySelector, { visible: true, timeout: 60000 });

    const categoryElements = await page.$$(categorySelector);

    for (const categoryElement of categoryElements) {

        const categoryName = await page.evaluate((element) => {
            const categoryNameSelector = ".CategoryListItem__Text-sc-ve8uzt-4";
            const categoryName = element.querySelector(categoryNameSelector)?.textContent?.trim().toLocaleLowerCase() || 'N/A'
            return categoryName
        }, categoryElement)

        if (categoryName !== "fresh vegetables" && categoryName !== "fresh fruits") continue;

        await page.evaluate((element) => {
            element.scrollTop = 0;
        }, scrollContainerElement);

        await categoryElement.click();

        await page.waitForSelector(productGridSelector, { visible: true, timeout: 60000 });

        await scrollToEnd(page, scrollContainerElement, config);

        const products = await scrapProducts(page, config);
        const data = objToCsv(products)
        const date = moment().unix()

        if (categoryName === "fresh vegetables") {
            fs.writeFileSync(`blinkit/freshVegetables/${date}.csv`, data)
        }

        if (categoryName === "fresh fruits") {
            fs.writeFileSync(`blinkit/freshFruits/${date}.csv`, data)
        }

    }
    await browser.close();
}