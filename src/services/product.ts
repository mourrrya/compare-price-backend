// create a design for services related to product

import { ProductScraped } from "@/scrapers/scrapeProducts";
import { ProductCategory, WebsiteName } from "../config/scraping-config";
import Product from "../models/product";

export const getProducts = () => {
    // get all products from database
}

export const upsertProductsToDb = async (website: WebsiteName, categoryName: ProductCategory, products: ProductScraped[]) => {

    const productData = products.map((product) => {
        return {
            name: product.name,
            quantity: product.quantity,
            discounted_price: product.discountedPrice,
            actual_price: product.actualPrice,
            img_url: product.imgUrl,
            out_of_stock: !!product.outOfStock,
            website_id: website === "blinkit" ? 1 : website === "zepto" ? 2 : "NA",
            category_id: categoryName === "vegetables" ? 1 : categoryName === "fruits" ? 2 : "NA",
            last_scraped: new Date(),
        };
    });

    const uniqueProductsObj = productData.reduce((acc: any, product: any) => {
        const key = `${product.name}-${product.website_id}-${product.quantity}-${product.category_id}`;
        acc[key] = [product];
        return acc;
    }, {})

    const uniqueProductsToUpsert = Object.values(uniqueProductsObj).flatMap((product: any) => product);

    try {
        await Product.bulkCreate(uniqueProductsToUpsert, {
            updateOnDuplicate: [
                "actual_price",
                "discounted_price",
                "out_of_stock",
                "img_url",
                "last_scraped",
            ],
            conflictAttributes: ["name", "website_id", "quantity", "category_id"],
        });
    } catch (error) {
        console.error('Error upserting products:', error);
    }

    return uniqueProductsToUpsert;
}