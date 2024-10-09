require('dotenv').config(); // Import dotenv to manage environment variables
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
// const mongoose = require('./src/config/dbConfig'); // Import mongoose
const adminRoutes = require('./src/routes/adminRoutes'); // Import admin routes
const userRoutes = require('./src/routes/userRoutes'); // Import admin routes

const Admin = require('./src/models/adminModel');
const User = require('./src/models/userModel');

const app = express();
const cros = require('cors');
app.use(cros());


const ejs = require('ejs');

app.use(bodyParser.json());
app.set('view engine', 'ejs');
  
// Handle GET request to root URL


app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  const user = Admin.findOne({telegramId:id}).then((user) => {
    if(user){
      res.render('index', { user: user });
    }else{
      res.send("User not found");
      // res.render('index', { user: null });
    }
  })
});
  // res.render('index', { name: 'Home' });

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.get('/style.css', (req, res) => {
  console.log("d");
  res.sendFile(__dirname + '\/views/style.css');
});
app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '\/views/script.js');
});
//send request to routes

app.use('/admin', adminRoutes);
app.use('/userinfo', userRoutes);


app.get('/users',async (req, res) =>{
  try {
    const users = await Admin.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
})
app.get('/users/:id',async (req, res) =>{
  const id = req.params.id;
  try {
    const users = await Admin.findOne({telegramId:id});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle Telegram authentication
// app.post('/auth/telegram', (req, res) => {
//   const { hash, ...data } = req.body;

//   // Your bot token or a secret key, which should be configured in Telegram
//   const secret = process.env.TELEGRAM_BOT_TOKEN; // Use environment variable for secret
//   const dataCheck = Object.keys(data)
//     .filter(key => key !== 'hash')
//     .map(key => `${key}=${data[key]}`)
//     .sort()
//     .join('\n');
//   const secretHash = crypto.createHmac('sha256', secret)
//     .update(dataCheck)
//     .digest('hex');

//   if (hash !== secretHash) {
//     return res.status(400).send('Invalid hash');
//   }

//   // User is authenticated
//   res.send('User authenticated');
// });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use admin routes
// app.use('/admin', adminRoutes); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










const TelegramBot = require('node-telegram-bot-api');
// const { url } = require('inspector');
// Replace with your Bot Token
const token = '7416078699:AAGk5OuX341sFtgWOBySiCw3p0-4ZRDnIoA';

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Simple command to start the bot
bot.onText(/\/start/, (msg) => {
  // bot.sendMessage(msg.chat.id, 'Welcome! I am your bot. How can I help you today?');
  var userID = msg.from.id + msg.from.first_name+msg.from.last_name;
  User.findOne({userId:userID}).then((user) => {
    console.log(user);
    if(user){
      bot.sendMessage(msg.chat.id, `Welcome ${user.firstname}!`);
      bot.sendMessage(msg.chat.id, 'Verifing user').then((msg) => {
        bot.deleteMessage(msg.chat.id, msg.message_id);
      } );
      const url = `http://127.0.0.1:5000/`+user.telegramId;
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Go to Website',
                url: url  // Replace with your desired URL
              }
            ]
          ]
        }
      };
      setTimeout(() => {
        bot.sendMessage(msg.chat.id, 'Click the button below to visit our website.', options);
      }, 2000);
      // bot.sendMessage(msg.chat.id, 'Welcome! Click the button below to visit our website.', options);
    }else{
      bot.sendMessage(msg.chat.id, `You are not Register!`);

      bot.sendMessage(msg.chat.id, 'Do you want to register?', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Yes',
                callback_data: 'yes'
              },
              {
                text: 'No',
                callback_data: 'no'
              }
            ]
          ]
        }
      });
      
      bot.on('callback_query', (callbackQuery) => {
        const data = callbackQuery.data;
        if (data === 'yes') {
          
            bot.sendMessage(msg.chat.id, 'Please send your contact by pressing your contact', {
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "📲 Shere phone number",
                      request_contact: true,
                    },
                  ],
                ],
              },
            });

            bot.on('contact', (msg) => {
              console.log(msg);
              bot.sendMessage(msg.chat.id, `Your contact has been received!`,{
                reply_markup: {
                  remove_keyboard: true,
                  force_reply: false,
                }
              });
              bot.sendMessage(msg.chat.id, `Welcome ${msg.contact.first_name}! your verification is in process..`);

              bot.deleteMessage(msg.chat.id, msg.message_id);
              
              
            });





            bot.sendMessage(msg.chat.id, 'Please send your contact by pressing your contact');
            const url = `http://127.0.0.1:5000/`+user.telegramId;
            const options = {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Go to Website',
                      url: url  // Replace with your desired URL
                    }
                  ]
                ]
              }
            };
            setTimeout(() => {
              bot.sendMessage(msg.chat.id, 'Click the button below to visit our website.', options);
            }, 2000);
            
            
        } else {
          bot.sendMessage(msg.chat.id, 'Thank you for your time!');
        }
        
      });
      // const options = {
      //       reply_markup: {
      //         inline_keyboard: [
      //           [
      //             {
      //               text: 'Go to Website',
      //               url: 'http://127.0.0.1:3000/'  // Replace with your desired URL
      //             }
      //           ]
      //         ]
      //       }
      //     };
      //     bot.sendMessage(chatId, 'Welcome! Click the button below to visit our website.', options);

      










    }
  }).catch((err) => {
    console.log(err);
  });


  
  












  // Admin.findOne({id:msg.contact}).then((user) => {
  //   if(user){
  //     bot.sendMessage(msg.chat.id, `Welcome ${user.id}!`);
  //   }else{
  //     bot.sendMessage(msg.chat.id, `User not found`);
  //   }
  // }).catch((err) => {
  //   console.log(err);
  // });

  // bot.sendMessage(msg.chat.id, 'Please send your contact by pressing your contact', {
  //   reply_markup: {
  //     keyboard: [
  //       [
  //         {
  //           text: "📲 Shere phone number",
  //           request_contact: true,
  //         },
  //       ],
  //     ],
  //     one_time_keyboard: true,
  //   },
  // });
  // bot.on('contact', (msg) => {
  //   console.log(msg.contact);
  //   bot.sendMessage(msg.chat.id, `Your contact has been received!`);
  //   bot.deleteMessage(msg.chat.id, msg.message_id);
  // });
  
  //find user in db 
  //if user exist then send message to user
  // Admin.findOne({id:msg.contact
  // console.log(msg);
  // bot.reply("Please send your contact by pressing your contact", {
  //   reply_markup: {
  //     keyboard: [
  //       [
  //         {
  //           text: "📲 Send phone number",
  //           request_contact: true,
  //         },
  //       ],
  //     ],
  //     one_time_keyboard: true,
  //   },
  // })
});


// Handle any message received
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const userMessage = msg.text;
//   const userName = msg.from.first_name;

//   const options = {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: 'Go to Website',
//             url: 'http://127.0.0.1:3000/'  // Replace with your desired URL
//           }
//         ]
//       ]
//     }
//   };
//   bot.sendMessage(chatId, 'Welcome! Click the button below to visit our website.', options);

//   // Bot's response logic goes here (this is where you'd train it)
// //   bot.sendMessage(chatId, `You said: ${userName}`);
//      console.log(`New User Is Connected Name is ${userName}`);
// });

