const Redis = require("ioredis");

const client = new Redis({
  port: 6379,
  host: "127.0.0.1",
});
client.on("connect", () => {
  console.log("connected to redis");
});

// for (let i = 0; i < 10; i++) {
//   client.set(`foo_${i}`, i + 1, "EX", 10, (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });
// }
// client.del("foo", (err) => {
//   if (err) {
//     console.log(err);
//   }
// });
// const client = redis.createClient({
//   port: 6379,
//   host: "127.0.0.1",
// });

// client.on("connect", () => {
//   console.log("client connected to redis");
// });

// client.on("ready", () => {
//   console.log("client connected to redis and ready to use");
// });
// client.on("error", (err) => {
//   console.log(err.messge);
// });

// client.on("end", () => {
//   console.log("client disconnected from redis");
// });

// process.on("SIGINT", () => {
//   client.quit();
// });

module.exports = client;
