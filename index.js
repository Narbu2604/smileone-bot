
require('dotenv').config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { getBrazilRates } = require("./smileone");

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN);

app.use(express.json());

app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Bot is live!");
});

bot.setWebHook(`${process.env.WEBHOOK_URL}/webhook`);

bot.onText(/\/start|rate brazil/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const rates = await getBrazilRates();
    bot.sendMessage(chatId, rates);
  } catch (err) {
    bot.sendMessage(chatId, "Failed to fetch rates.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
