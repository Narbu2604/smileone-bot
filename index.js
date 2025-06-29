require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Initialize bot in webhook mode
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: { port: process.env.PORT || 3000 } });

// Set Telegram webhook
bot.setWebHook(`${process.env.WEBHOOK_URL}/webhook`);

// Receive webhook POST from Telegram
app.post('/webhook', (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text.toLowerCase();

    console.log(`Received: ${text}`);

    if (text.includes('rate brazil')) {
      bot.sendMessage(chatId, '🇧🇷 Brazil SmileOne Rate:\nR$100 → $20.2\nR$500 → $100.5\nR$1000 → $181');
    } else {
      bot.sendMessage(chatId, '🤖 Type "rate brazil" to get the latest price.');
    }
  }

  res.sendStatus(200);
});

// Optional: root URL
app.get('/', (req, res) => {
  res.send('Telegram bot is running.');
});

// Start Express app
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
