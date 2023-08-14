const {createServer} =  require("http");
const app = require("./app");
const PORT = 8000;

createServer(app).listen(PORT,()=>console.log(`Server Up and Running on Port ${PORT}...`));