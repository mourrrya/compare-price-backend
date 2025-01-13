import { WebsiteConfig } from '../config/scraping-config';
import { scrapBlinkit } from './blinkitScraper';
import { scrapZepto } from './zeptoScraper';

export async function scrapeAllWebsites(configs: WebsiteConfig[]) {
  console.log('Starting scraping job...');
  for (const config of configs) {

    if (config.name === 'blinkit') {
      // await scrapBlinkit(config);
    }

    if (config.name === 'zepto') {
      await scrapZepto(config);
    }

    // if (config.name === 'swiggy') {
    //  await scrapSwiggy(config);
    // }


  }
  console.log('Scraping job completed');
}
