const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const binanceRoutes = require("./routes/binanceRoutes");
const botRoutes = require("./routes/botRoutes");
app.use("/api", require("./routes/botRoutes"));

app.use("/api", binanceRoutes);
app.use("/api", botRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
