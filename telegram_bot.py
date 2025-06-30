import requests
from bs4 import BeautifulSoup
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Replace with your own credentials
USERNAME = 'your_username'  # Your Smile One account username
PASSWORD = 'your_password'   # Your Smile One account password
LOGIN_URL = 'https://www.smileonecode.com/login'
PRODUCT_LIST_URL = 'https://www.smileonecode.com/product-list'
TOKEN = 'your_telegram_bot_token'  # Your Telegram bot token

def login():
    session = requests.Session()
    payload = {
        'username': USERNAME,
        'password': PASSWORD
    }
    session.post(LOGIN_URL, data=payload)
    return session

def check_rate(session):
    response = session.get(PRODUCT_LIST_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the Smile One rate in the HTML (this will depend on the actual structure of the page)
    rate = 0  # Replace with actual rate extraction logic
    return float(rate)  # Ensure the rate is a float

def calculate_amount(rate):
    if rate < 20:
        return 100 + 0.2
    elif rate < 200:
        return 1000 + 1
    elif rate < 1000:
        return 5000 + 3
    return 0

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Welcome! Use /check to get the Smile One rate.')

def check(update: Update, context: CallbackContext) -> None:
    session = login()
    rate = check_rate(session)
    amount = calculate_amount(rate)
    update.message.reply_text(f'The current rate is {rate}. Adjusted amount: {amount}')

def main():
    updater = Updater(TOKEN)
    dispatcher = updater.dispatcher

    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("check", check))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
