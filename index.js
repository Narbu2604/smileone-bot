
require('dotenv').config();
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🇧🇷 SmileOne Brazil Rate Bot is active!');
});

bot.onText(/rate brazil/i, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Fetching Brazil rates...');

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.smileonecode.com/login', { waitUntil: 'networkidle2' });

    await page.type('#email', process.env.SMILEONE_USERNAME);
    await page.type('#password', process.env.SMILEONE_PASSWORD);
    await Promise.all([
      page.click('#btnlogin'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await page.goto('https://www.smileonecode.com/product', { waitUntil: 'networkidle2' });

    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.card-body')).map(card => {
        const name = card.querySelector('h5')?.innerText || '';
        const price = card.querySelector('.price')?.innerText.replace('$', '') || '';
        return { name, price };
      });
    });

    const brazilProducts = products.filter(p =>
      p.name.includes("Smile One Code (Brazil)") &&
      (p.name.includes("100") || p.name.includes("500") || p.name.includes("1000"))
    );

    const adjusted = brazilProducts.map(p => {
      const price = parseFloat(p.price);
      let extra = 0;
      if (p.name.includes("1000")) extra = 1;
      else if (p.name.includes("500")) extra = 0.5;
      else if (p.name.includes("100")) extra = 0.2;

      return `${p.name} → $${(price + extra).toFixed(2)}`;
    });

    await browser.close();
    bot.sendMessage(chatId, adjusted.length ? adjusted.join('\n') : 'No Brazil products found.');

  } catch (err) {
    console.error('Bot error:', err);
    bot.sendMessage(chatId, '⚠️ Failed to fetch Brazil rates.');
  }
});
