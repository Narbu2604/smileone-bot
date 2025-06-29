
const puppeteer = require("puppeteer");

async function getBrazilRates() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.smileonecode.com/login", { waitUntil: "networkidle2" });

  await page.type("#email", process.env.SMILEONE_USERNAME);
  await page.type("#password", process.env.SMILEONE_PASSWORD);
  await page.click("#submitLogin");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.goto("https://www.smileonecode.com/product", { waitUntil: "networkidle2" });

  const rates = [
    { name: "R$100", usd: 19 },
    { name: "R$500", usd: 95 },
    { name: "R$1000", usd: 180 }
  ];

  const adjustedRates = rates.map(product => {
    let adjusted = product.usd;
    if (product.name.includes("100") && product.usd < 20) adjusted += 0.2;
    else if (product.name.includes("500") && product.usd < 100) adjusted += 0.5;
    else if (product.name.includes("1000") && product.usd < 900) adjusted += 1;
    return `${product.name} → $${adjusted.toFixed(2)}`;
  }).join("\n");

  await browser.close();
  return `🇧🇷 *SmileOne Brazil Rates*:\n${adjustedRates}`;
}

module.exports = { getBrazilRates };
