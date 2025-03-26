import { VariantScraped } from "@/scrapers/scrapeProducts";
import Product from "../models/product";
import fs from "fs";


export const productVariantMapping = (products: Product[], variants: VariantScraped[]) => {

    debugger
    return variants.map((variant) => {
        // const comboProduct = products.find(() => variant.name.toLowerCase().includes("combo"));
        // if (comboProduct) {
        //     return { ...variant, product_id: comboProduct.id };
        // }

        // const organicProduct = products.find(() => variant.name.toLowerCase().includes("apple ber"));
        // if (organicProduct) {
        //     return { ...variant, product_id: organicProduct.id };
        // }

        

        const unmatchedVariants: { product: Product; variant: VariantScraped }[] = [];

        const matchingProduct = products.find((product) => {
            const data = variant.name.toLowerCase().includes(product.first_name.toLowerCase());

            if (!data) {
                unmatchedVariants.push({ product, variant })
            }

            return data
        }
        );

        fs.writeFileSync('unmatchedProductsVariants.json', JSON.stringify(unmatchedVariants));


        return { ...variant, product_id: matchingProduct?.id || null };
    });
}



