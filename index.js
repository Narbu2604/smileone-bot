
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN);
app.use(express.json());

bot.setWebHook(`${process.env.WEBHOOK_URL}`);

const formatRate = (real, usd) => {
  let margin = 0;
  if (usd < 20) margin = 0.2;
  else if (usd < 100) margin = 0.5;
  else margin = 1.0;
  return (usd + margin).toFixed(2);
};

async function fetchRates() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://www.smileonecode.com/login', { waitUntil: 'networkidle2' });

  await page.type('#email', process.env.SMILEONE_USERNAME);
  await page.type('#password', process.env.SMILEONE_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  await page.goto('https://www.smileonecode.com/products?region=brazil', { waitUntil: 'networkidle2' });

  const prices = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.product-box')];
    const map = {};
    rows.forEach(row => {
      const name = row.querySelector('.name')?.innerText;
      const price = parseFloat(row.querySelector('.price')?.innerText?.replace(/[^\d.]/g, ''));
      if (name.includes("R$ 100")) map["100"] = price;
      if (name.includes("R$ 500")) map["500"] = price;
      if (name.includes("R$ 1000")) map["1000"] = price;
    });
    return map;
  });

  await browser.close();
  return prices;
}

app.post('/webhook', async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.text) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text.includes("rate brazil")) {
    try {
      const prices = await fetchRates();
      const msgText = `🇧🇷 *SmileOne Brazil Updated Rates:*

` +
        `🔹 R$100 = $${formatRate(100, prices["100"])}
` +
        `🔹 R$500 = $${formatRate(500, prices["500"])}
` +
        `🔹 R$1000 = $${formatRate(1000, prices["1000"])}`;
      bot.sendMessage(chatId, msgText, { parse_mode: "Markdown" });
    } catch (err) {
      bot.sendMessage(chatId, "❌ Failed to fetch rates. Please try again later.");
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
