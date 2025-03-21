import fs from "fs";
import moment from "moment";
import { VariantCategory, WebsiteConfig, WebsiteName } from '../config/scraping-config';
import { objToCsv } from "../helpers/fileModifier";
import { upsertVariantsToDb } from "../services/productVariantServices";
import { scrapBlinkit } from './blinkitScraper';
import { VariantScraped, } from "./scrapeProducts";
import { scrapZepto } from './zeptoScraper';

export async function scrapeAllWebsites(configs: WebsiteConfig[]) {
  console.log('Starting scraping job...');
  for (const config of configs) {

    if (config.name === 'blinkit') {
      const { freshVegetables, freshFruits } = await scrapBlinkit(config);
      await addToFile(freshVegetables, "vegetables", config.name);
      await addToFile(freshFruits, "fruits", config.name);
    }

    if (config.name === 'zepto') {
      const { freshVegetables, freshFruits } = await scrapZepto(config);
      await addToFile(freshVegetables, "vegetables", config.name);
      await addToFile(freshFruits, "fruits", config.name);
    }

    // if (config.name === 'swiggy') {
    //  await scrapSwiggy(config);
    // }

  }
  console.log('Scraping job completed');
}

const addToFile = async (products: VariantScraped[], categoryName: VariantCategory, website: WebsiteName) => {
  const date = moment().unix()

  const data = await upsertVariantsToDb(website, categoryName, products)

  if (categoryName === "vegetables") {
    fs.writeFileSync(`scrappedData/${website}/freshVegetables/${date}.csv`, objToCsv(products))
    fs.writeFileSync(`scrappedData/${website}/freshVegetables/${date}.json`, JSON.stringify(products))
    fs.writeFileSync(`scrappedData/${website}/freshVegetables/db-data${date}.json`, JSON.stringify(data))
  }

  if (categoryName === "fruits") {
    fs.writeFileSync(`scrappedData/${website}/freshFruits/${date}.csv`, objToCsv(products))
    fs.writeFileSync(`scrappedData/${website}/freshFruits/${date}.json`, JSON.stringify(products))
    fs.writeFileSync(`scrappedData/${website}/freshFruits/db-data${date}.json`, JSON.stringify(products))
  }
}