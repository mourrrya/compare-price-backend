

import puppeteer, { ElementHandle } from 'puppeteer';
import { WebsiteConfig } from '../config/scraping-config';
import { VariantScraped, scrapProducts } from './scrapeProducts';
import { scrollToEnd } from './smoothScroll';


export const scrapZepto = async (config: WebsiteConfig) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(config.url);

  await page.setViewport({ width: 800, height: 600 });

  await page.waitForSelector('button[aria-label="Select Location"]', { visible: true, timeout: 60000 });

  const addressSearchItem = await page.$('button[aria-label="Select Location');

  await addressSearchItem!.click({ delay: 500 });

  await page.waitForSelector('input[placeholder="Search a new address"]', { visible: true, timeout: 60000 });

  await page.type('input[placeholder="Search a new address"]', '110053', { delay: 300 });

  await page.waitForSelector('div[data-testid="address-search-item"]', { visible: true, timeout: 60000 });

  const addressItem = await page.$('div[data-testid="address-search-item"]');

  await page.evaluate(el => el!.click(), addressItem);

  await page.waitForSelector('button[data-testid="location-confirm-btn"]', { visible: true, timeout: 60000 });

  await page.click('button[data-testid="location-confirm-btn"]', { delay: 800 });

  await page.waitForSelector('a[aria-label="go to Categories page"]', { visible: true, timeout: 60000 });

  try {
    await page.click('a[aria-label="go to Categories page"]', { delay: 300 });
  } catch (error) {
    console.log("category click failed", error);
  }

  await page.waitForSelector('#CATEGORY_GRID_V3-element a img', { visible: true, timeout: 60000 });

  await page.evaluate(() => {
    const element = document.querySelector('#CATEGORY_GRID_V3-element a') as HTMLElement;;
    element.click();
  });


  await page.waitForSelector('a.relative.mb-2.flex.cursor-pointer', { visible: true, timeout: 60000 });

  const categoryElements = await page.$$("a.relative.mb-2.flex.cursor-pointer");

  const scrollContainerElement: HTMLElement = await page.$(config.selectors.productListContainerSelector) as unknown as HTMLElement;

  await page.evaluate((element: HTMLElement) => {
    if (element) {
      element.style.height = '500px';
      element.style.overflowY = 'scroll';
    }
  }, scrollContainerElement);

  const freshVegetables: VariantScraped[] = []
  const freshFruits: VariantScraped[] = []

  for (const [index, categoryElement] of categoryElements.entries()) {
    const categoryName = await page.evaluate((element) => {
      const categoryNameSelector = "p";
      const categoryName = element.querySelector(categoryNameSelector)?.textContent?.trim().toLowerCase() || 'N/A'
      return categoryName
    }, categoryElement)

    if (categoryName !== "fresh vegetables" && categoryName !== "fresh fruits") continue;

    await page.evaluate((element) => {
      element.scrollTop = 0;
    }, scrollContainerElement);

    await page.waitForSelector('a.relative.mb-2.flex.cursor-pointer', { visible: true, timeout: 60000 });

    const categoryElements = await page.$$("a.relative.mb-2.flex.cursor-pointer");

    await categoryElements[index].click({ delay: 500 });

    await page.waitForSelector(config.selectors.productBlockSelector, { visible: true, timeout: 60000 });

    await scrollToEnd(page, scrollContainerElement, config);

    const products = await scrapProducts(page, config);

    if (categoryName === "fresh vegetables") { freshVegetables.push(...products) }
    if (categoryName === "fresh fruits") { freshFruits.push(...products) }

  }

  await browser.close();

  return { freshVegetables, freshFruits }
}