const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/images", express.static("src/public/images"));
app.use(cors(corsOptions));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
