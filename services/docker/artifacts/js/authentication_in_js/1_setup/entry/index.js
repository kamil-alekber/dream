console.log('hello world');

let count = 0;

setInterval(() => {
  console.log('interval entry', count);
  count += 1;
}, 2000);
