import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import Contenedor from "./managers/product.manager.js";
import UserManager from "./managers/user.manager.js";
import db from "./db/sqlBase.js";
// Mongoose
import mongoose from "mongoose";
import chatsService from "./models/Chats.js";
import { normalize, schema } from "normalizr";

// const PORT = process.env.PORT || 8080;
const PORT = 8080;
const app = express();
const server = app.listen(PORT, () => console.log("Listening on PORT"));
const io = new Server(server); //nuestro socket deberia estar corrindo
const container = new Contenedor();
const userManager = new UserManager();

app.use(express.json());
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);

// Schema and chat normalization:
const author = new schema.Entity("authors", {}, { idAttribute: "email" });
const message = new schema.Entity(
  "messages",
  {
    author: author,
  },
  { idAttribute: "_id" }
);
const chat = new schema.Entity("chats", {
  chats: [message],
});

// Mongoose connection:
const connection = mongoose.connect(
  "mongodb+srv://joaquingarese:1a2b3c@cluster0.dcv0epl.mongodb.net/?retryWrites=true&w=majority",
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Atlas DB connected");
    }
  }
);

io.on("connection", async (socket) => {
  console.log("socket connected");
  let products = await db("products").select("*");
  let chatLog = await db("chat").select("*");
  io.emit("updateProductList", products);
  // io.emit("log", chatLog);
  io.emit(
    "log",
    normalize({ id: 1, chats: await chatsService.find({}) }, chat)
  );

  //   Chat
  socket.on(
    "message",
    // async (data) => {
    //   let date = new Date(Date.now()).toLocaleString();
    //   data.date = date;
    //   await db("chat").insert(data);
    //   let chatLog = await db("chat").select("*");
    async (data) => {
      await chatsService.create(data);
      io.emit(
        "log",
        normalize({ id: 1, chats: await chatsService.find({}) }, chat)
      );
    }
  );

  //   Show Products
  socket.on("addNewProduct", async (newProduct) => {
    await db("products").insert(newProduct);
    let allProducts = await db("products").select("*");
    io.emit("updateProductList", allProducts);
  });
});
