import fs from "fs";
import __dirname from "../utils.js";

const path = __dirname + "/files/items.json";
class Contenedor {
  getAll = async () => {
    try {
      if (fs.existsSync(path)) {
        let fileData = await fs.promises.readFile(path, "utf8");
        let items = JSON.parse(fileData);
        return items;
      } else {
        return [];
      }
    } catch (error) {
      console.log("Cannot read File : " + error);
    }
  };

  save = async (item) => {
    try {
      console.log("hola");
      let items = await this.getAll();
      console.log(items);
      if (items.length === 0) {
        item.id = 1;
        items.push(item);
        await fs.promises.writeFile(path, JSON.stringify(items, null, "\t"));
        console.log(`El id del item agregado es el "${item.id}", items:`);
        console.log(items);
      } else {
        item.id = items[items.length - 1].id + 1;
        items.push(item);
        await fs.promises.writeFile(path, JSON.stringify(items, null, "\t"));
        console.log(`El id del item agregado es el "${item.id}", items:`);
        console.log(items);
      }
    } catch (error) {
      console.log("Cannot write file: " + error);
    }
  };

  getById = async (number) => {
    try {
      const allProducts = await this.getAll();
      if (allProducts.id != number) {
        console.log(allProducts.find((element) => element.id === number));
        return allProducts.find((element) => element.id === number);
      } else {
        console.log("null");
      }
    } catch (error) {
      console.log("Hay un error: " + error);
    }
  };
  deleteById = async (number) => {
    try {
      let items = await this.getAll();
      let findItem = items.find((item) => item.id == number);
      let newItems = items.filter((item) => item.id != number);
      if (findItem) {
        await fs.promises.writeFile(path, JSON.stringify(newItems, null, "\t"));
        console.log("Se ha eliminado el siguiente item: ");
        console.log(findItem);
      } else {
        console.log(`El id "${number}" no existe!`);
      }
    } catch (error) {
      console.log("Cannot delete item: " + error);
    }
  };

  deleteAll = async () => {
    try {
      let items = await this.getAll();
      items = [];
      await fs.promises.writeFile(path, JSON.stringify(items, null, "\t"));
      console.log("Se han eliminado todos los items");
    } catch (error) {}
  };

  update = async (obj) => {
    let allProducts = await this.getAll();
    let id = obj.id;
    let title = obj.title;
    let price = obj.price;
    let thumbnail = obj.thumbnail;
    allProducts.map(function (item) {
      if (item.id == id) {
        item.title = title;
        item.price = price;
        item.thumbnail = thumbnail;
      }
    });
    await fs.promises.writeFile(path, JSON.stringify(allProducts, null, "\t"));
    return allProducts;
  };
}

export default Contenedor;
