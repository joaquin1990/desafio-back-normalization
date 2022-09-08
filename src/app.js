import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import Contenedor from "./managers/product.manager.js";
import UserManager from "./managers/user.manager.js";
import db from "./db/sqlBase.js";

// const PORT = process.env.PORT || 8080;
const PORT = 8080;
const app = express();
const server = app.listen(PORT, () => console.log("Listening on PORT"));
const io = new Server(server); //nuestro socket deberia estar corrindo
const container = new Contenedor();
const userManager = new UserManager();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  console.log("socket connected");
  let products = await db("products").select("*");
  let chatLog = await db("chat").select("*");
  io.emit("updateProductList", products);
  io.emit("log", chatLog);

  //   Chat
  socket.on("message", async (data) => {
    let date = new Date(Date.now()).toLocaleString();
    data.date = date;
    await db("chat").insert(data);
    let chatLog = await db("chat").select("*");
    io.emit("log", chatLog);
  });

  //   Show Products
  socket.on("addNewProduct", async (newProduct) => {
    await db("products").insert(newProduct);
    let allProducts = await db("products").select("*");
    io.emit("updateProductList", allProducts);
  });
});
