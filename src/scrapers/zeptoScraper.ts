

import fs from 'fs';
import moment from "moment";
import puppeteer from 'puppeteer';
import { WebsiteConfig } from '../config/scraping-config';
import { objToCsv } from '../helpers/fileModifier';
import { scrollToEnd } from './smoothScroll';
import { scrapProducts } from './scrapeProducts';

export const scrapZepto = async (config: WebsiteConfig) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(config.url);

  await page.setViewport({ width: 1600, height: 768 });

  await page.waitForSelector('.location-popup-container', { visible: true, timeout: 60000 });

  await page.click('.location-popup-container > div > div > button', { delay: 500 });

  await page.waitForSelector('input[placeholder="Search a new address"]', { visible: true, timeout: 60000 });

  await page.type('input[placeholder="Search a new address"]', '110053', { delay: 300 });

  await page.waitForSelector('div[data-testid="address-search-item"]', { visible: true, timeout: 60000 });

  await page.click('div[data-testid="address-search-item"]');

  await page.waitForSelector('button[data-testid="location-confirm-btn"]', { visible: true, timeout: 60000 });

  await page.click('button[data-testid="location-confirm-btn"]', { delay: 800 });

  const fAndVElement = await page.$$("#CATEGORY_GRID_V3-element");

  fAndVElement[0].click();

  await page.waitForSelector('.plp-cat-sub-category-item', { visible: true, timeout: 60000 });

  const categoryElements = await page.$$(".plp-cat-sub-category-item");

  const scrollContainerElement: HTMLElement = await page.$(config.selectors.productListContainerSelector) as unknown as HTMLElement;

  await page.evaluate((element: HTMLElement) => {
    if (element) {
      element.style.height = '500px';
      element.style.overflowY = 'scroll';
    }
  }, scrollContainerElement);

  for (const categoryElement of categoryElements) {

    const categoryName = await page.evaluate((element) => {
      const categoryNameSelector = "p";
      const categoryName = element.querySelector(categoryNameSelector)?.textContent?.trim().toLocaleLowerCase() || 'N/A'
      return categoryName
    }, categoryElement)

    if (categoryName !== "fresh vegetables" && categoryName !== "fresh fruits") continue;

    await page.evaluate((element) => {
      element.scrollTop = 0;
    }, scrollContainerElement);

    await categoryElement.click();

    await page.waitForSelector(config.selectors.productBlockSelector, { visible: true, timeout: 60000 });

    await scrollToEnd(page, scrollContainerElement, config);

    const products = await scrapProducts(page, config);
    const data = objToCsv(products)
    const date = moment().unix()

    if (categoryName === "fresh vegetables") {
      fs.writeFileSync(`zepto/freshVegetables/${date}.csv`, data)
    }

    if (categoryName === "fresh fruits") {
      fs.writeFileSync(`zepto/freshFruits/${date}.csv`, data)
    }

  }

}