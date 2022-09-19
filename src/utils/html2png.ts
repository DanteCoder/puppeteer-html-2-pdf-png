import puppeteer from 'puppeteer';

export interface PngOptions {
  style?: string;
  zoom?: number;
}

export const html2png = async (html: string[], options?: PngOptions) => {
  const browser = await puppeteer.launch({ headless: true });
  const { style, zoom } = options ?? {};

  await Promise.all(
    html.map(async (html, i) => {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      await page.addStyleTag({ content: style });
      if (zoom != null) await page.addStyleTag({ content: `body{zoom:${zoom}}` });
      await page.screenshot({
        captureBeyondViewport: true,
        fullPage: true,
        type: 'png',
        path: __dirname + '/' + i.toString() + '.png',
      });
    })
  );

  await browser.close();
};
