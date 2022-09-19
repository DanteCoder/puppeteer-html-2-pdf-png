import puppeteer from 'puppeteer';
import pdfMerger from 'pdf-merger-js';
import fs from 'fs';

export interface PngOptions {
  size: { width: number; height: number };
  style?: string;
  zoom?: number;
}

export const html2pdf = async (html: string[], options: PngOptions) => {
  const { style, size, zoom } = options ?? {};
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const merger = new pdfMerger();
  const roundedZoom = zoom ? calculateRoundedZoom(zoom, size.width, size.height) : 1;
  const roundedScaledWidth = Math.round(size.width * roundedZoom);
  const roundedScaledHeight = Math.round(size.height * roundedZoom);

  const htmlToPrint = await page.evaluate(
    (html, width, height, zoom) => {
      const htmlToPrint = html.map(htmlStringPage => {
        const htmlPage = document.createElement('div');
        htmlPage.style.width = width.toString();
        htmlPage.style.height = height.toString();
        htmlPage.style.overflow = 'hidden';

        if (zoom != null) {
          const zoomableDiv = document.createElement('div');
          // @ts-ignore
          zoomableDiv.style.zoom = zoom.toString();
          zoomableDiv.innerHTML = htmlStringPage;
          htmlPage.appendChild(zoomableDiv);
        } else {
          htmlPage.innerHTML = htmlStringPage;
        }

        return htmlPage.outerHTML;
      });

      return htmlToPrint;
    },
    html,
    roundedScaledWidth,
    roundedScaledHeight,
    roundedZoom
  );

  const pdfPages = await Promise.all(
    htmlToPrint.map(async htmlStringPage => {
      const page = await browser.newPage();
      await page.setContent(htmlStringPage, { waitUntil: 'load' });
      await page.addStyleTag({ content: style });
      return await page.pdf({
        printBackground: true,
        width: roundedScaledWidth,
        height: roundedScaledHeight,
        pageRanges: '1',
        margin: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
      });
    })
  );

  for (const pdfPage of pdfPages) {
    await merger.add(pdfPage);
  }

  const mergedPdfBuffer = await merger.saveAsBuffer();
  fs.writeFileSync(__dirname + '/' + 'my.pdf', mergedPdfBuffer);

  await browser.close();
};

const calculateRoundedZoom = (zoom: number, width: number, height: number) => {
  const largerSide = Math.max(width, height);
  const roundedScaledSide = Math.round(largerSide * zoom);
  return roundedScaledSide / largerSide;
};
