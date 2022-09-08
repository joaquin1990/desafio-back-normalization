import { Router } from "express";
import Contenedor from "../managers/product.manager.js";

const container = new Contenedor();
const router = Router();

router.get("/", async (req, res) => {
  let products = await container.getAll();
  res.render("home", {
    products,
  });
});

export default router;
