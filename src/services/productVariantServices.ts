    // create a design for services related to product

import { VariantScraped } from "@/scrapers/scrapeProducts";
import { VariantCategory, WebsiteName } from "../config/scraping-config";
import Variant from "../models/variant";

export const getVariants = async () => {
    return await Variant.findAll();
}

export const upsertVariantsToDb = async (website: WebsiteName, categoryName: VariantCategory, variants: VariantScraped[]) => {

    const variantData = variants.map((variant) => {
        return {
            name: variant.name,
            quantity: variant.quantity,
            discounted_price: variant.discountedPrice,
            actual_price: variant.actualPrice,
            img_url: variant.imgUrl,
            out_of_stock: !!variant.outOfStock,
            website_id: website === "blinkit" ? 1 : website === "zepto" ? 2 : "NA",
            category_id: categoryName === "vegetables" ? 1 : categoryName === "fruits" ? 2 : "NA",
            last_scraped: new Date(),
        };
    });

    const uniqueVariantsObj = variantData.reduce((acc: any, variant: any) => {
        const key = `${variant.name}-${variant.website_id}-${variant.quantity}-${variant.category_id}`;
        acc[key] = [variant];
        return acc;
    }, {})

    const uniqueVariantsToUpsert = Object.values(uniqueVariantsObj).flatMap((variant: any) => variant);

    try {
        await Variant.bulkCreate(uniqueVariantsToUpsert, {
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

    return uniqueVariantsToUpsert;
}