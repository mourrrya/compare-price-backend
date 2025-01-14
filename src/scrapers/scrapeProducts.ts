import { WebsiteConfig } from "../config/scraping-config";
import { Page } from "puppeteer";

export const scrapProducts = async (page: Page, config: WebsiteConfig) => {
    const products = await page.evaluate((config) => {
        const {
            productBlockSelector,
            productName,
            productQty,
            productDiscountedPrice,
            productImgUrl,
            productActualPrice,
            productOutOfStock,
        } = config.selectors;
        const productElements = document.querySelectorAll(productBlockSelector);
        return Array.from(productElements).map((product) => {
            const name = product.querySelector(productName)?.textContent?.trim() || 'N/A';
            const quantity = product.querySelector(productQty)?.textContent?.trim() || 'N/A';
            const discountedPrice = product.querySelector(productDiscountedPrice)?.textContent?.trim() || 'N/A';
            const image = product.querySelector(productImgUrl)?.getAttribute('src') || 'N/A';
            const actualPrice = product.querySelector(productActualPrice)?.textContent?.trim() || 'N/A';
            const outOfStock = !!product.querySelector(productOutOfStock);
            return { name, quantity, discountedPrice, actualPrice, outOfStock, image };
        });
    }, config);

    return products
}
