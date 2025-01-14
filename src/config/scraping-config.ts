type WebsiteName = 'zepto' | 'blinkit' | "swiggy";
export interface WebsiteConfig {
  url: string;
  name: WebsiteName;
  selectors: {
    productListContainerSelector: string
    infiniteLoaderSelector?: string
    productsGridSelector: string
    productBlockSelector: string

    productName: string;
    productActualPrice: string;
    productQty: string;
    productDiscountedPrice: string;
    productCategory: string;
    productImgUrl: string;
    productOutOfStock: string;
  }
}

export const websitesToScrape: WebsiteConfig[] = [
  {
    url: 'https://www.swiggy.com/stores/instamart',
    name: 'swiggy',
    selectors: {
      productsGridSelector: "",
      productListContainerSelector: "",
      infiniteLoaderSelector: "",
      productBlockSelector: "",
      productName: '',
      productActualPrice: '',
      productQty: '',
      productDiscountedPrice: '',
      productCategory: '',
      productImgUrl: '',
      productOutOfStock: '',
    }
  },
  {
    url: 'https://blinkit.com/',
    name: 'blinkit',
    selectors: {
      productListContainerSelector: ".plp2-container > div:nth-child(2) > div[style]",
      infiniteLoaderSelector: ".htTHJK",
      productsGridSelector: '',
      productBlockSelector: '.Product__UpdatedPlpProductContainer-sc-11dk8zk-0',
      productName: '.Product__UpdatedTitle-sc-11dk8zk-9',
      productQty: '.plp-product__quantity--box',
      productDiscountedPrice: '.Product__UpdatedPriceAndAtcContainer-sc-11dk8zk-10 > div > div',
      productActualPrice: '.Product__UpdatedPriceAndAtcContainer-sc-11dk8zk-10 > div > div:nth-child(2)',
      productOutOfStock: '.AddToCart__UpdatedOutOfStockTag-sc-17ig0e3-4',
      productImgUrl: '.Imagestyles__ImageContainer-sc-1u3ccmn-0 > img',
      productCategory: '',
    }
  },
  {
    url: 'https://www.zeptonow.com/',
    name: 'zepto',
    selectors: {
      productListContainerSelector: ".relative.mx-auto.bg-skin-base",
      infiniteLoaderSelector: ".animate-spin.w-5.h-5.text-skin-primary.relative",
      productsGridSelector: "div[data-testid='undefined-product-list']",
      productBlockSelector: "a[data-testid='product-card']",

      productName: 'h5[data-testid="product-card-name"]',
      productQty: 'span[data-testid="product-card-quantity"] > h4',
      productDiscountedPrice: '.flex.items-baseline.gap-1 > h4',
      productActualPrice: '.flex.items-baseline.gap-1 > p',
      productOutOfStock: '.flex.content-center.items-center.justify-center.rounded-md.py-1.px-2.text-xs',
      productImgUrl: 'img[data-testid="product-card-image"]',
      productCategory: '',
    }
  },
];
