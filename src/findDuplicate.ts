import productsToUpsert from "../scrappedData/zepto/freshVegetables/db-data1739788279.json";

const duplicates = productsToUpsert.reduce((acc: any, product: any) => {
    const key = `${product.name}-${product.website_id}-${product.quantity}-${product.category_id}`;

    // If the key already exists, it's a duplicate
    if (acc[key]) {
        acc[key].push(product);
    }
    else {
        acc[key] = [product];
    }
    return acc;
}, {});

// Filter to keep only keys with more than 1 occurrence (duplicates)
const duplicateProducts = Object.values(duplicates).filter((products: any) => products.length > 1);

console.log("duplicates", duplicates);

// console.log("duplicateProducts.flatMap", duplicateProducts.flatMap((products: any) => products));