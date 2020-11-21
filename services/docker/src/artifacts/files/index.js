console.log('You have done it!!!');

let count = 0;
const interval = setInterval(() => {
  if (count > 10) {
    clearInterval(interval);
  }
  console.log('Interval is at:', count);
  count += 1;
}, 1000);
