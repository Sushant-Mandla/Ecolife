




const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const Message = require("./models/Message");
const aiRoutes = require("./routes/ai");
const zeroWasteRoutes = require("./routes/zeroWaste");
const carbonRoutes = require("./routes/carbon");
const greenHomeRoutes = require("./routes/greenHomeRoutes");
const gardeningRoutes = require("./routes/gardeningRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const energyConservationRoutes = require("./routes/energyConservation");


const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 5000);

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("🟢 User Connected");

  /* ----- USER ONLINE ----- */
  socket.on("userOnline", (userId) => {
    socket.userId = userId; // VERY IMPORTANT
    onlineUsers.add(userId);
    io.emit("onlineUsers", Array.from(onlineUsers));
  });

  /* ----- SEND MESSAGE ----- */
  socket.on("sendMessage", async (data) => {
    try {
      const message = await Message.create(data);
      io.emit("receiveMessage", message);
    } catch (err) {
      console.error("Message Save Error:", err.message);
    }
  });

  /* ----- ADD REACTION ----- */
  socket.on("addReaction", async ({ messageId, reaction }) => {
    try {
      await Message.updateOne(
        { _id: messageId },
        { $pull: { reactions: { userId: reaction.userId } } }
      );

      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { reactions: reaction } },
        { new: true }
      );
      io.emit("reactionUpdated", updatedMessage);
    } catch (err) {
      console.error("Reaction Error:", err.message);
    }
  });

  socket.on("togglePin", async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId).select("pinnedBy").lean();
      if (!message) return;

      const isPinned = (message.pinnedBy || []).includes(userId);
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        isPinned
          ? { $pull: { pinnedBy: userId } }
          : { $addToSet: { pinnedBy: userId } },
        { new: true }
      );

      io.emit("messageUpdated", updatedMessage);
    } catch (err) {
      console.error("Pin toggle error:", err.message);
    }
  });

  socket.on("toggleStar", async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId).select("starredBy").lean();
      if (!message) return;

      const isStarred = (message.starredBy || []).includes(userId);
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        isStarred
          ? { $pull: { starredBy: userId } }
          : { $addToSet: { starredBy: userId } },
        { new: true }
      );

      io.emit("messageUpdated", updatedMessage);
    } catch (err) {
      console.error("Star toggle error:", err.message);
    }
  });

  /* ----- TYPING ----- */
  socket.on("typing", (userName) => {
    socket.broadcast.emit("typing", userName);
  });

  /* ----- DISCONNECT ----- */
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
    console.log("🔴 User Disconnected");
  });
});



/* ---------------- NEWS ROUTE ---------------- */
app.get("/api/news", async (req, res) => {
  try {
    const sustainabilityQuery = [
      '"sustainable living"',
      '"eco-friendly"',
      '"zero waste"',
      'sustainability',
      '"renewable energy"',
      '"green home"',
      '"climate action"',
    ].join(" OR ");

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: sustainabilityQuery,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 30,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const strictKeywords = [
      "sustainable",
      "sustainability",
      "eco",
      "zero waste",
      "renewable",
      "green living",
      "climate",
    ];

    const filteredArticles = (response.data.articles || []).filter((article) => {
      const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
      return strictKeywords.some((keyword) => text.includes(keyword));
    });

    res.json(filteredArticles);
  } catch (error) {
    console.error("News API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

/* ---------------- AUTH ROUTES ---------------- */
app.use("/api/auth", authRoutes);

/* ---------------- MESSAGE ROUTES ---------------- */
app.use("/api/messages", messageRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/zero-waste", zeroWasteRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/green-home", greenHomeRoutes);
app.use("/api/gardening", gardeningRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/energy-conservation", energyConservationRoutes);


/* ---------------- DATABASE CONNECTION ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running with Socket.io on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`ℹ️ Port ${PORT} is already in use. Another server instance is likely already running.`);
    process.exit(0);
  }

  console.error("❌ Server startup error:", error.message);
  process.exit(1);
});

  require("./utils/dailyEcoTip");