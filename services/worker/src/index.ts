import express from 'express';
import cron from 'node-cron';
import fs from 'fs';

const app = express();

// Setting a cron job
cron.schedule('*/10 * * * * *', function () {
  // Data to write on file
  let data = `${new Date().toUTCString()}  
                : Server is working\n`;

  // Appending data to logs.txt file
  fs.appendFile('logs.txt', data, function (err) {
    if (err) throw err;

    console.log('Status Logged!');
  });
});

app.listen(3000);
