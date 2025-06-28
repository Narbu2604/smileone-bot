require('dotenv').config();
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const LOGIN_URL = 'https://www.smileonecode.com/login';

async function fetchRate(country) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle0' });

  // Login form submission
  await page.type('#email', process.env.SMILEONE_USERNAME);
  await page.type('#password', process.env.SMILEONE_PASSWORD);
  await Promise.all([
    page.click('button[type=submit]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  // Navigate to product list (adjust as needed)
  let url = country === 'brazil' ? 'https://www.smileonecode.com/products/brazil' : 'https://www.smileonecode.com/products/philippines';
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Scrape the first product's price (adjust selector if needed)
  const rate = await page.evaluate(() => {
    const priceEl = document.querySelector('.price .amount');
    if (!priceEl) return null;
    return parseFloat(priceEl.innerText.replace('$', '').trim());
  });

  await browser.close();

  if (!rate) return null;
  if (rate < 20) return 20.2;
  if (rate < 100) return 100.5;
  if (rate < 900) return 901;
  return rate;
}

bot.onText(/rate (brazil|ph)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const country = match[1].toLowerCase() === 'ph' ? 'philippines' : 'brazil';

  bot.sendMessage(chatId, `⏳ Fetching updated ${country.toUpperCase()} rate...`);
  const price = await fetchRate(country);

  if (!price) {
    bot.sendMessage(chatId, '❌ Failed to retrieve price. SmileOne site may be down.');
  } else {
    bot.sendMessage(chatId, `✅ ${country.toUpperCase()} Rate: $${price}`);
  }
});
