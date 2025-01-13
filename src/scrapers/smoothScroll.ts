import { WebsiteConfig } from "../config/scraping-config";
import { Page } from "puppeteer";
import { delay } from "../helpers/delay";

export async function smoothScroll(container: Element) {
  console.log("smoothScroll");

  return new Promise((resolve) => {
    let scrollStep = 10; // Number of pixels to scroll per frame
    let intervalId: number | null = null;

    const scroll = () => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      console.log("container.scrollHeight", container.scrollHeight);
      console.log("container.clientHeight", container.clientHeight);
      console.log("container.scrollTop", container.scrollTop);
      console.log("maxScrollTop", maxScrollTop);

      if (container.scrollTop < maxScrollTop) {
        container.scrollTop += scrollStep; // Scroll by step
        intervalId = requestAnimationFrame(scroll);
      } else {
        cancelAnimationFrame(intervalId!); // Stop scrolling when at the bottom
        resolve(void 0); // Resolve when scrolling ends
      }
    };

    scroll();
  });
}

export const scrollToEnd = async (page: Page, scrollContainerElement: HTMLElement, config: WebsiteConfig) => {

  const loaderSelector = config.selectors.infiniteLoaderSelector;

  await page.evaluate(async (scrollContainer, loaderSelector, smoothScroll, delay) => {
    const smoothScrollFunc = new Function(`return (${smoothScroll})`)();
    const delayFunc = new Function(`return (${delay})`)();

    if (!scrollContainer) return

    while (true) {

      await smoothScrollFunc(scrollContainer);

      const loader = document.querySelector(loaderSelector!);

      await delayFunc(1000);

      if (!!loader) {
        console.log("loader found, continuing");
        continue;
      }

      if (!loader) {
        console.log("loader not found, breaking");
        break;
      }
    }

    console.log("scrollToEnd finished");

  }, scrollContainerElement, loaderSelector, smoothScroll.toString(), delay.toString());


}