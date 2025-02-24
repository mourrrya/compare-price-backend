import { WebsiteConfig } from "../config/scraping-config";
import { Page } from "puppeteer";
import { delay } from "../helpers/delay";

export async function smoothScroll(container: Element, config: WebsiteConfig) {
  return new Promise((resolve) => {
    let scrollStep = 10; // Number of pixels to scroll per frame
    let intervalId: number | null = null;
    const scroll = () => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      console.table({
        scrollTop: container.scrollTop,
        ceilScrollTop: Math.ceil(container.scrollTop),
        maxScrollTop: maxScrollTop,
        roundedMaxScrollTop: Math.round(maxScrollTop)
      })
      if (Math.ceil(container.scrollTop) < Math.round(maxScrollTop)) {
        container.scrollTop += scrollStep; // Scroll by step
        intervalId = requestAnimationFrame(scroll);
      } else {
        cancelAnimationFrame(intervalId!); // Stop scrolling when at the bottom
        const productElements = document.querySelectorAll(config.selectors.productBlockSelector)
        resolve(productElements.length);
      }
    };
    scroll();
  });
}

export const scrollToEnd = async (page: Page, scrollContainerElement: HTMLElement, config: WebsiteConfig) => {

  const loaderSelector = config.selectors.infiniteLoaderSelector;

  await page.evaluate(async (scrollContainer, loaderSelector, config, smoothScroll, delay) => {
    const smoothScrollFunc = new Function(`return (${smoothScroll})`)();
    const delayFunc = new Function(`return (${delay})`)();

    if (!scrollContainer) return

    while (true) {

      const productCountAfterScroll = await smoothScrollFunc(scrollContainer, config);

      const loader = await document.querySelector(loaderSelector!);

      await delayFunc(3000);

      const productCountAfterDelay = await document.querySelectorAll(config.selectors.productBlockSelector).length;

      if (productCountAfterScroll === productCountAfterDelay && !loader) break;
      else continue;

    }

    console.log("scrollToEnd finished");

  }, scrollContainerElement, loaderSelector, config, smoothScroll.toString(), delay.toString());
}