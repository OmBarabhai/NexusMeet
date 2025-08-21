import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";


import cors from "cors";
import "dotenv/config";



const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// Corrected the typo in 'process'
app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb", extended: true }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);



app.get("/home", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  try {
    // const connectionDb = await mongoose.connect(
    //   MONGODB_URI
    // );
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MONGO connected DB Host: ${connectionDb.connection.host}`);

    // Server listens directly to the port
    server.listen(app.get("port"), () => {
      console.log(`listening on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

start();
