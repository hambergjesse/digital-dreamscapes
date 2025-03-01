import { Sequelize } from "sequelize";
import path from "path";

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"), // Store SQLite database file in the backend directory
  logging: false, // Disable SQL query logging
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
