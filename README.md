# SmileOne Telegram Rate Bot

## 🔧 What It Does:
- Logs into SmileOne.com using your credentials
- Fetches product rates for Brazil or Philippines
- Applies pricing rules:
  - < $20 → $20.2
  - < $100 → $100.5
  - < $900 → $901
- Sends the price back via Telegram when customer types:
  - `rate brazil`
  - `rate ph`

---

## 🚀 How to Deploy on Render

1. Sign up at https://render.com (Free)
2. Create a new "Web Service"
3. Use "Node" environment
4. Upload this project or push it to GitHub
5. Add the following Environment Variables:
   - `BOT_TOKEN` = Your Telegram Bot Token
   - `SMILEONE_USERNAME` = Your SmileOne Email
   - `SMILEONE_PASSWORD` = Your SmileOne Password
6. Click "Deploy"

---

## ✉️ Telegram Bot Setup

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Type `/start` → `/newbot`
3. Copy the token and paste it into `.env` or Render.com

Done! Your bot will reply to your customers instantly.
