import express from 'express';
import cron from 'node-cron';
import fetch from 'node-fetch';
// import fs from 'fs';
import { Telegraf } from 'telegraf';
import { Keyboard } from 'telegram-keyboard';

const app = express();

const bot = new Telegraf('1415508876:AAHVFIgJRKvfh9FrNroM82v1h8zggGLINL4');

// cron.schedule('* * * * *', async function () {
//   const res = await fetch('https://type.fit/api/quotes');
//   const data = await res.json();
//   const randomNum = Math.floor(Math.random() * data?.length);
//   const quote = `
//     ${data[randomNum]?.text} ${data[randomNum]?.author}
//   `;

//   bot.telegram.sendMessage('280972783', quote);
// });

// cron.schedule('* * * * *', async () => {
//   bot.telegram.sendMessage('-272742710', 'Че тааааммм!!');
// });

// bot.telegram.sendMessage('-272742710', 'Адилет, бреет очко!!');

bot.command('/menu', async ({ reply }) => {
  const keyboard = Keyboard.make([
    ['фразу', 'шутку'], // First row
    ['привет', 'пока'], // Second row
  ]);

  reply('Пацанское меню', keyboard.reply());
  // await reply('Simple inline keyboard', keyboard.inline());
});

bot.hears('фразу', (ctx) => {
  const array = ['Я не ожидал от тебя брат'];

  const randomNum = Math.floor(Math.random() * array?.length);

  ctx.reply(array[randomNum]);
});

bot.hears('шутку', (ctx) => {
  const array = [
    'Аскар тащит в доту',
    'Архат, сядь на котак',
    'Э, иди нах',
    'Апай, можно пятерку. Ну, апай !!!',
    'Россия ждет',
  ];
  const randomNum = Math.floor(Math.random() * array?.length);

  ctx.reply(array[randomNum]);
});

bot.hears(/привет|ку|как дела|калай/i, (ctx) => {
  ctx.reply('Че тааааам!!!');
});

bot.command('/clear', (ctx) => {});

bot.hears(/росси/i, (ctx) => {
  ctx.reply('Россия россия!!!');
});

bot.hears(/^пока$/i, (ctx) => {
  ctx.reply('Давай до свидания');
});

bot.command('/go', (ctx) => {
  ctx.reply('get out');
});

bot.start((ctx) => {
  console.log(ctx.chat?.id);

  ctx.reply('Welcome');
});
bot.command('/quote', async (ctx) => {
  console.log(ctx.chat);

  const res = await fetch('https://type.fit/api/quotes');
  const data = await res.json();
  const randomNum = Math.floor(Math.random() * data?.length);
  const quote = `
    ${data[randomNum]?.text} ${data[randomNum]?.author}
  `;

  ctx.reply(quote);
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('message', (ctx) => {
//   console.log('cfff', ctx);
// });
bot.hears(/^hi$/i, (ctx) => ctx.reply('Hey there'));
bot.launch();

app.get('/', (req, res) => res.send('hello world'));
// Setting a cron job
// cron.schedule('*/10 * * * * *', function () {
//   // Data to write on file
//   let data = `${new Date().toUTCString()}
//                 : Server is working\n`;

//   // Appending data to logs.txt file
//   fs.appendFile('logs.txt', data, function (err) {
//     if (err) throw err;

//     console.log('Status Logged!');
//   });
// });

// function sendMail() {
//   let mailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: '<your-email>@gmail.com',
//       pass: '**********',
//     },
//   });

//   // Setting credentials
//   let mailDetails = {
//     from: '<your-email>@gmail.com',
//     to: '<user-email>@gmail.com',
//     subject: 'Test mail using Cron job',
//     text: 'Node.js cron job email' + ' testing for GeeksforGeeks',
//   };

//   // Sending Email
//   mailTransporter.sendMail(mailDetails, function (err, data) {
//     if (err) {
//       console.log('Error Occurs', err);
//     } else {
//       console.log('Email sent successfully');
//     }
//   });
// }

app.listen(5003, () => {
  console.warn(
    '\x1b[32m%s\x1b[0m',
    '[+] 🚀 Docker Server is listening on:',
    `http://localhost:5003`
  );
});
