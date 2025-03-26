import { WebsiteConfig } from "../config/scraping-config";
import { Page } from "puppeteer";

export interface VariantScraped {
    name: string;
    quantity: string;
    discountedPrice: number;
    actualPrice: number;
    imgUrl: string;
    outOfStock: boolean;
    product_id?: number;
}



export const scrapProducts = async (page: Page, config: WebsiteConfig): Promise<VariantScraped[]> => {
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
            let discountedPrice = product.querySelector(productDiscountedPrice)?.textContent?.trim() || 'N/A';
            let actualPrice = product.querySelector(productActualPrice)?.textContent?.trim() || 'N/A';
            const imgUrl = product.querySelector(productImgUrl)?.getAttribute('src') || 'N/A';
            const outOfStock = !!product.querySelector(productOutOfStock);

            discountedPrice = discountedPrice.replace(/[^\d.]/g, '');
            actualPrice = actualPrice.replace(/[^\d.]/g, '');

            return { name, quantity, discountedPrice: parseFloat(discountedPrice), actualPrice: parseFloat(actualPrice), outOfStock, imgUrl };
        });
    }, config);

    return products
}
