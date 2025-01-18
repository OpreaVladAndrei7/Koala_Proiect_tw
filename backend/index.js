require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt"); // For password hashing

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: 5433, // Adjust the port based on your setup
    dialect: "postgres",
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const User = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // e.g., "student", "teacher"
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

const EventGroup = sequelize.define(
  "EventGroup",
  {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
  },
  {
    tableName: "Event_groups",
    timestamps: false,
  }
);

// Events Table
const Event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "CLOSED",
    },
    acces_code: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  {
    tableName: "Events",
    timestamps: false,
  }
);

// Attendances Table
const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    attendance_time: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "Attendances",
    timestamps: false,
  }
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is a student
    const user = await User.findOne({ where: { email } });
    if (user) {
      if (password == user.password) {
        return res.json({
          message: "Login successful!",
          user: user.type,
        });
      } else {
        return res.status(401).json({ error: "Invalid password." });
      }
    }

    // If the user is not found in either table
    return res.status(404).json({ error: "User not found." });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
