import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import faker from "faker";
import { normalize, schema } from "normalizr";
import chatManager from "./db/chatService.js";

// Mongoose
import mongoose from "mongoose";

// const PORT = process.env.PORT || 8080;
const PORT = 8080;
const app = express();
const server = app.listen(PORT, () => console.log("Listening on PORT"));
const io = new Server(server); //nuestro socket deberia estar corrindo
const db = new chatManager();

app.use(express.json());
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

faker.locale = "es";
const { commerce, image } = faker;
let fakerProducts = [];
for (let i = 0; i < 5; i++) {
  fakerProducts.push({
    title: commerce.product(),
    prices: commerce.price(),
    thumbnail: image.imageUrl(),
  });
}

// Normalizing data
app.get("/normalized", async (req, res) => {
  try {
    let log = await db.getAllNormalize();
    const authors = new schema.Entity("author");
    const mensaje = new schema.Entity("messages", {
      author: authors,
    });
    const holdingSchema = new schema.Entity("holdings", {
      mensajes: [mensaje],
    });
    const normalizedData = normalize(log, holdingSchema);
    res.send(normalizedData);
    console.log("Data Normalizada = ", normalizedData);
  } catch (error) {
    console.log(error);
  }
});

io.on("connection", async (socket) => {
  console.log("socket connected");
  let chatLog = await db.getAll();
  io.emit("log", chatLog);

  socket.on("message", async (data) => {
    let date = new Date().toISOString();
    data.fecha = date;
    await db.save(data);
    let log = await db.getAll();
    io.emit("log", log);
    console.log(data);
  });
});

app.get("/", async (req, res) => {
  res.render("formulario", {
    productsFaker,
  });
});
