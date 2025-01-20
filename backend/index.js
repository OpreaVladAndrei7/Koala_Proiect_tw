require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: 5433,
    dialect: "postgres",
  }
);

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
    type: { type: DataTypes.STRING, allowNull: false },
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

const Event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Event_groups",
        key: "group_id",
      },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "CLOSED",
    },
    access_code: { type: DataTypes.STRING, unique: true, allowNull: false },
    repetition: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Once",
    },
  },
  {
    tableName: "Events",
    timestamps: false,
  }
);

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Events",
        key: "event_id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    attendance_time: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "Attendances",
    timestamps: false,
  }
);

Event.belongsTo(EventGroup, { foreignKey: "group_id" });

EventGroup.hasMany(Event, { foreignKey: "group_id" });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      if (password == user.password) {
        return res.json({
          message: "Login successful!",
          type: user.type,
          user_id: user.user_id,
        });
      } else {
        return res.status(401).json({ error: "Invalid password." });
      }
    }

    return res.status(404).json({ error: "User not found." });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
});

app.get("/api/event_groups", async (req, res) => {
  try {
    const groups = await EventGroup.findAll();
    res.json(groups);
  } catch (error) {
    console.error("Error fetching event groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/event_groups", async (req, res) => {
  try {
    const { name } = req.body;
    const newGroup = await EventGroup.create({ name });
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating event group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.findAll({ include: EventGroup });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const {
      name,
      description,
      dateStart,
      timeStart,
      dateEnd,
      timeEnd,
      repetition,
      groupId,
      accessCode,
    } = req.body;

    const start_time = new Date(`${dateStart}T${timeStart}:00`);
    const end_time = new Date(`${dateEnd}T${timeEnd}:00`);
    const generatedAccessCode =
      accessCode || Math.random().toString(36).substring(2, 8).toUpperCase();

    const newEvent = await Event.create({
      name,
      description,
      start_time,
      end_time,
      repetition,
      access_code: generatedAccessCode,
      group_id: groupId,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/attendees", async (req, res) => {
  try {
    const attendees = await Attendance.findAll();
    res.json(attendees);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/attendees", async (req, res) => {
  try {
    const { event_id, user_id, attendance_time } = req.body;
    const newAttendee = await Attendance.create({
      event_id,
      user_id,
      attendance_time,
    });
    res.status(201).json(newAttendee);
  } catch (error) {
    console.error("Error creating attendee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/events/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    event.status = status;
    await event.save();

    res.json({ message: "Event status updated successfully.", event });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/attendances/submit", async (req, res) => {
  const { accessCode, userId } = req.body;

  if (!accessCode || !userId) {
    return res
      .status(400)
      .json({ error: "Access code and user ID are required." });
  }
  try {
    const event = await Event.findOne({ where: { access_code: accessCode } });

    if (!event) {
      return res.status(404).json({ error: "Invalid access code." });
    }
    const existingAttendance = await Attendance.findOne({
      where: { user_id: userId, event_id: event.event_id },
    });
    if (existingAttendance) {
      return res
        .status(400)
        .json({ error: "Attendance already marked for this event." });
    }
    const newAttendance = await Attendance.create({
      user_id: userId,
      event_id: event.event_id,
      attendance_time: new Date(),
    });

    res.status(201).json({
      message: "Attendance marked successfully.",
      eventName: event.name,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
