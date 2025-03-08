import fs from "fs";
import blinkitVegetables from "../scrappedData/blinkit/freshVegetables/1740128504.json";
import zeptoVegetables from "../scrappedData/zepto/freshVegetables/1740134102.json";
import { vegetablesWithoutDiffForms } from "./vegetableList";

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

const getBlinkitVegetables = () => {
    const products = findProducts(blinkitVegetables)
    fs.writeFileSync("testingData/blinkitVegetables.json", JSON.stringify(products));
    return products
}

const getZeptoVegetables = () => {
    const products = findProducts(zeptoVegetables)
    fs.writeFileSync("testingData/zeptoVegetables.json", JSON.stringify(products));
    return products
}


const main = () => {
    const blinkitVegetables = getBlinkitVegetables()
    const zeptoVegetables = getZeptoVegetables()

    const mathTheLists = (blinkitVegetables: string[], zeptoVegetables: string[]) => {
        const mappedProducts = vegetablesWithoutDiffForms.map((product) => {
            const blinkitVegetable = blinkitVegetables.filter((blinkitVegetable) => blinkitVegetable.includes(product.name))
            const zeptoVegetable = zeptoVegetables.filter((zeptoVegetable) => zeptoVegetable.includes(product.name))

            return {
                name: product.name,
                blinkitVegetables: blinkitVegetable,
                zeptoVegetables: zeptoVegetable,
            }
        })


        // I want to get all the products that are not mapped
        const blinkitMappedProducts = mappedProducts.flatMap((product) => product.blinkitVegetables)
        const zeptoMappedProducts = mappedProducts.flatMap((product) => product.zeptoVegetables)
        const notMappedBlinkitProducts = blinkitVegetables.filter((blinkitVegetable) => !blinkitMappedProducts.includes(blinkitVegetable))
        const notMappedZeptoProducts = zeptoVegetables.filter((zeptoVegetable) => !zeptoMappedProducts.includes(zeptoVegetable))

        return {
            mappedProducts,
            notMappedBlinkitProducts,
            notMappedZeptoProducts
        }
    }

    const data = mathTheLists(blinkitVegetables.productList, zeptoVegetables.productList)

    fs.writeFileSync("testingData/uniqueVegetableNameList.json", JSON.stringify(data));
}

main()

// const compareLists = (blinkitVegetables: string[], zeptoVegetables: string[]) => {
//     const matches: { blinkitVegetable: string, zeptoVegetable: string }[] = [];
//     const mismatchedZeptoVegetables: string[] = [];
//     const mismatchedBlinkitVegetables: string[] = [];

//     blinkitVegetables.forEach((blinkitVegetable) => {
//         const zeptoVegetable = zeptoVegetables.find((zeptoVegetable) => zeptoVegetable === blinkitVegetable)
//         if (zeptoVegetable) {
//             matches.push({ blinkitVegetable, zeptoVegetable });
//         } else {
//             mismatchedBlinkitVegetables.push(blinkitVegetable);
//         }
//     });

//     zeptoVegetables.forEach((zeptoVegetable) => {
//         if (!matches.find((match) => match.zeptoVegetable === zeptoVegetable)) {
//             mismatchedZeptoVegetables.push(zeptoVegetable);
//         }
//     });


//     return {
//         matches,
//         mismatchedZeptoVegetables,
//         mismatchedBlinkitVegetables
//     }
// }


