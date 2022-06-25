const app = require("./app");
const server = require("http").createServer(app);
const PORT = 8080;
const port = process.env.PORT || PORT;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});