import knex from "knex";

const mysqloptions = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "base_knex",
  },
};
const sqliteOptions = {
  client: "sqlite3",
  connection: { filename: "./sqliteDatabase.sqlite" },
  useNullAsDefault: true,
};
let db = knex(sqliteOptions);

try {
  let exists = await db.schema.hasTable("products");
  if (exists) {
    console.log("Tabla de Productos Encontrada");
  } else {
    await db.schema.createTable("products", (table) => {
      table.primary("id");
      table.increments("id");
      table.string("title", 30);
      table.integer("price");
      table.string("thumbnail", 300);
    });
  }
  let chat = await db.schema.hasTable("chat");
  if (chat) {
    console.log("Chat encontrado");
  } else {
    await db.schema.createTable("chat", (table) => {
      table.string("user");
      table.string("message");
      table.string("date");
    });
  }
} catch (error) {
  console.log(error);
}

export default db;
