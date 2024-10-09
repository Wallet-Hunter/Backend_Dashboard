const TelegramBot = require('node-telegram-bot-api');

// Replace with your Bot Token
// const token = '7505850569:AAFleDscypJCq12usa5Dsn_iuVCrZ8FeDEA';
const token = '7416078699:AAGk5OuX341sFtgWOBySiCw3p0-4ZRDnIoA';

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Simple command to start the bot
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome! I am your bot. How can I help you today?');
});

// Handle any message received
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  const userName = msg.from.first_name;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Go to Website',
            url: 'http://127.0.0.1:5001/'  // Replace with your desired URL
          }
        ]
      ]
    }
  };
  bot.sendMessage(chatId, 'Welcome! Click the button below to visit our website.', options);

  // Bot's response logic goes here (this is where you'd train it)
//   bot.sendMessage(chatId, `You said: ${userName}`);
     console.log(`New User Is Connected Name is ${userName}`);
});

