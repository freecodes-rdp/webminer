const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://webminer.pages.dev?algorithm=cwm_minotaurx&host=minotaurx.na.mine.zpool.ca&port=7019&worker=XbCLsxKNZkVPPLNAXzoTUwAxVMiT3r8saZ&password=c%3DDASH&workers=10');
  console.log("Minage en cours en arrière-plan...");
})();
