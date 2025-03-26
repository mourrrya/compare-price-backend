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
            combos.push(product.name.toLowerCase().trim());
            return;
        }
        if (product.name.toLowerCase().includes("organic")) {
            organic.push(product.name.toLowerCase().trim());
            return;
        }
        if (product.name.toLowerCase().includes("hydroponic")) {
            hydroponic.push(product.name.toLowerCase().trim());
            return;
        }
        productList.push(product.name.toLowerCase().trim());
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
            const blinkitFruitList = blinkitFruits.filter((blinkitFruit) => blinkitFruit.includes(product.first_name.toLowerCase()))
            const zeptoFruitList = zeptoFruits.filter((zeptoFruit) => zeptoFruit.includes(product.first_name.toLowerCase()))

            return {
                name: product.first_name,
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

