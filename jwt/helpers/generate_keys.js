const crypto = require("crypto");

const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");

console.table({ key1, key2 });

console.log(`secret ${process.env.ACCESS_TOKEN}`);
console.log(`refresh: ${process.env.REFRESH_TOKEN}`);
console.log(`mongo: ${process.env.MONGODB_URI}`);
console.log(`port: ${process.env.PORT}`);
