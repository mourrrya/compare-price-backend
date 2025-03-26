// create a design for services related to product

import { VariantScraped } from "@/scrapers/scrapeProducts";
import { VariantCategory, WebsiteName } from "../config/scraping-config";
import Variant from "../models/variant";
import Product from "../models/product";
import { Op } from "sequelize";
import { productVariantMapping } from "../helpers/productVariantMapping";

export const productVariants = async () => {
    const productsWithVariants = await Product.findAll({
        include: {
            model: Variant,
            where: {
                product_id: { [Op.ne]: null }, // Exclude variants without a product
            },
            required: false, // Ensures products without variants are still included
        },
    });
    return productsWithVariants
}

export const getVariants = async () => {
    return await Variant.findAll();
}

export const upsertVariantsToDb = async (website: WebsiteName, categoryName: VariantCategory, variants: VariantScraped[]) => {

    const categoryMap: Record<VariantCategory, number> = {
        fruits: 2,
        vegetables: 1
    };

    const websiteMap: Record<WebsiteName, number> = {
        blinkit: 1,
        zepto: 2,
        swiggy: 3
    };

    const products = await Product.findAll({ where: { category_id: categoryMap[categoryName] }, });

    const productData = products.map(product => product.get({ plain: true }));
    
    const mappedVariants = productVariantMapping(productData, variants,)

    const variantData = mappedVariants.map((variant) => {
        return {
            name: variant.name.toLowerCase(),
            quantity: variant.quantity,
            discounted_price: variant.discountedPrice,
            actual_price: variant.actualPrice,
            img_url: variant.imgUrl,
            out_of_stock: !!variant.outOfStock,
            product_id: variant.product_id,
            website_id: websiteMap[website],
            category_id: categoryMap[categoryName],
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