import { WebsiteConfig } from "../config/scraping-config";
import { Page } from "puppeteer";

export const scrapProducts = async (page: Page, config: WebsiteConfig) => {
    const productBlockSelector = config.selectors.productBlockSelector;
    const productName = config.selectors.productName;
    const productQty = config.selectors.productQty;
    const productDiscountedPrice = config.selectors.productDiscountedPrice;
    const productImgUrl = config.selectors.productImgUrl;
    const productActualPrice = config.selectors.productActualPrice;
    const productOutOfStock = config.selectors.productOutOfStock;
    const products = await page.evaluate((productBlockSelector,
        productName,
        productQty,
        productDiscountedPrice,
        productImgUrl,
        productActualPrice,
        productOutOfStock) => {
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
    },
        productBlockSelector,
        productName,
        productQty,
        productDiscountedPrice,
        productImgUrl,
        productActualPrice,
        productOutOfStock);

    return products
}


