import fs from "fs";
import blinkitFruits from "../scrappedData/blinkit/freshFruits/1740128505.json";
import zeptoFruits from "../scrappedData/zepto/freshFruits/1740134102.json";
import { fruitsWithoutDiffForms } from "./fruitList";

function splitString(input: string) {
    // Define the regular expression to match symbols, spaces, and integers
    const regex = /[\(\),-]|(?<=\D)(?=\d)|(?<=\d)(?=\D)/g;

    // Split the string using the regex and filter out empty strings
    return input.split(regex).map(str => str.trim()).filter(Boolean);
}

const findProducts = (products: any[]) => {
    const combos: string[] = [];
    const organic: string[] = [];
    const hydroponic: string[] = [];
    const actualSplittedProductName: string[][] = [];
    const productList: string[] = []
    products.forEach((product: { name: string; }) => {
        const splittedProductName = splitString(product.name)[0];

        actualSplittedProductName.push(splitString(product.name));

        if (product.name.toLowerCase().includes("combo")) {
            combos.push(product.name.toLocaleLowerCase().trim());
            return;
        }
        if (product.name.toLowerCase().includes("organic")) {
            organic.push(product.name.toLocaleLowerCase().trim());
            return;
        }
        if (product.name.toLowerCase().includes("hydroponic")) {
            hydroponic.push(product.name.toLocaleLowerCase().trim());
            return;
        }
        productList.push(product.name.toLocaleLowerCase().trim());
    })

    return { productList, combos, organic, hydroponic, actualSplittedProductName }
}

const getBlinkitFruits = () => {
    const products = findProducts(blinkitFruits)
    fs.writeFileSync("testingData/blinkitFruits.json", JSON.stringify(products));
    return products
}

const getZeptoFruits = () => {
    const products = findProducts(zeptoFruits)
    fs.writeFileSync("testingData/zeptoFruits.json", JSON.stringify(products));
    return products
}


const main = () => {
    const blinkitFruits = getBlinkitFruits()
    const zeptoFruits = getZeptoFruits()

    const mathTheLists = (blinkitFruits: string[], zeptoFruits: string[]) => {
        const mappedProducts = fruitsWithoutDiffForms.map((product) => {
            const blinkitFruitList = blinkitFruits.filter((blinkitFruit) => blinkitFruit.includes(product.name.toLocaleLowerCase()))
            const zeptoFruitList = zeptoFruits.filter((zeptoFruit) => zeptoFruit.includes(product.name.toLocaleLowerCase()))

            return {
                name: product.name,
                blinkitFruits: blinkitFruitList,
                zeptoFruits: zeptoFruitList,
            }
        })


        // I want to get all the products that are not mapped
        const blinkitMappedProducts = mappedProducts.flatMap((product) => product.blinkitFruits)
        const zeptoMappedProducts = mappedProducts.flatMap((product) => product.zeptoFruits)
        const notMappedBlinkitProducts = blinkitFruits.filter((blinkitFruit) => !blinkitMappedProducts.includes(blinkitFruit))
        const notMappedZeptoProducts = zeptoFruits.filter((zeptoFruit) => !zeptoMappedProducts.includes(zeptoFruit))

        return {
            mappedProducts,
            notMappedBlinkitProducts,
            notMappedZeptoProducts
        }
    }

    const data = mathTheLists(blinkitFruits.productList, zeptoFruits.productList)

    fs.writeFileSync("testingData/uniqueFruitNameList.json", JSON.stringify(data));
}

main()

// const compareLists = (blinkitFruits: string[], zeptoFruits: string[]) => {
//     const matches: { blinkitVegetable: string, zeptoVegetable: string }[] = [];
//     const mismatchedZeptoFruits: string[] = [];
//     const mismatchedBlinkitFruits: string[] = [];

//     blinkitFruits.forEach((blinkitVegetable) => {
//         const zeptoVegetable = zeptoFruits.find((zeptoVegetable) => zeptoVegetable === blinkitVegetable)
//         if (zeptoVegetable) {
//             matches.push({ blinkitVegetable, zeptoVegetable });
//         } else {
//             mismatchedBlinkitFruits.push(blinkitVegetable);
//         }
//     });

//     zeptoFruits.forEach((zeptoVegetable) => {
//         if (!matches.find((match) => match.zeptoVegetable === zeptoVegetable)) {
//             mismatchedZeptoFruits.push(zeptoVegetable);
//         }
//     });


//     return {
//         matches,
//         mismatchedZeptoFruits,
//         mismatchedBlinkitFruits
//     }
// }


