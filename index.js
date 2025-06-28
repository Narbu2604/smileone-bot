require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "SmileOne Rate Bot is running!");
});

bot.onText(/rate (brazil|ph)/, (msg, match) => {
  const region = match[1].toUpperCase();
  bot.sendMessage(msg.chat.id, `Fetching rate for ${region}...`);
});