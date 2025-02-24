import fs from "fs";
import Fuse from "fuse.js";
import blinkitFruits from "../scrappedData/blinkit/freshFruits/1740128505.json";
import zeptoFruits from "../scrappedData/zepto/freshFruits/1740134102.json";

const findProducts = (data: any[]) => {
    const fuse = new Fuse(data, {
        keys: ['name'],
        threshold: 0.1,
        shouldSort: true
    })
    // I want to get all the unique fruits names
    const uniqueFruits: string[] = [];
    data.forEach(d => {
        const names = fuse.search(d.name);
        console.log("name length", names.length);
        
        names.forEach(n => {
            if (uniqueFruits.includes(n.item.name)) {
                return;
            } else {    
                uniqueFruits.push(n.item.name);
            }
        })
    })
    return uniqueFruits;
}

const getBlinkitFruits = () => {
    const products = findProducts(blinkitFruits);
    fs.writeFileSync("testingData/blinkitFruits.json", JSON.stringify(products));
    return products;
}

getBlinkitFruits();

const getZeptoFruits = () => {
    const products = findProducts(zeptoFruits);
    fs.writeFileSync("testingData/zeptoFruits.json", JSON.stringify(products));
    return products;
}