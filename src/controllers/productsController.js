const db = require("../config/db");

class ProductsController {
  async addProduct(req, res) {
    const { title, description, price, category, customFields } = req.body;
    const imagePath = `images/${req.file.filename}`;
    const fields = JSON.parse(req.body.customFields || "{}");
    try {
      const result = await db.query(
        "INSERT INTO products (title, description, image_path, price, category, custom_fields) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, description, imagePath, price, category, JSON.stringify(fields)]
      );
      console.log(req.body);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProducts(req, res) {
    try {
      const result = await db.query("SELECT * FROM products");
      res.json(result.rows);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ProductsController();
