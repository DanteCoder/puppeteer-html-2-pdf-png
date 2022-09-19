import puppeteer from 'puppeteer';

export interface PngOptions {
  style?: string;
  size: { width: number; height: number };
}

export const html2pdf = async (html: string[], options: PngOptions) => {
  const { style, size } = options ?? {};
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const htmlToPrint = await page.evaluate(
    (html: string[], width: number, height: number) => {
      const htmlToPrint = html.reduce((containerDiv, htmlStringPage) => {
        const htmlPage = document.createElement('div');
        htmlPage.innerHTML = htmlStringPage;
        htmlPage.style.width = width.toString();
        htmlPage.style.height = height.toString();
        htmlPage.style.overflow = 'hidden';

        containerDiv.appendChild(htmlPage);
        return containerDiv;
      }, document.createElement('div'));

      return htmlToPrint.outerHTML;
    },
    html,
    size.width,
    size.height
  );

  await page.setContent(htmlToPrint, { waitUntil: 'load' });
  await page.addStyleTag({ content: style });
  await page.pdf({
    path: __dirname + '/' + 'my.pdf',
    printBackground: true,
    ...size,
  });

  await browser.close();
};
