import app from "./app.js";
import { sequelize } from "./database/database.js";

async function main() {
  try {
    await sequelize.sync({ force: false });
    await sequelize.authenticate();
    app.listen(3000);
    console.log("Servidor ejecutando en el puerto 3000");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
