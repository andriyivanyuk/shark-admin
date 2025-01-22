const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UsersController {
  async registerUser(req, res) {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const result = await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, role]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const tokens = await this.generateTokens(user);
      res.json({
        message: "Login successful",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error generating tokens", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  logoutUser = async (req, res) => {
    try {
      const userId = req.user.id;
      await pool.query("UPDATE users SET refresh_token = NULL WHERE id = $1", [
        userId,
      ]);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh Token is required" });

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
        decoded.userId,
      ]);
      const user = userResult.rows[0];

      if (!user || user.refresh_token !== refreshToken) {
        return res.status(403).json({ message: "Refresh token is not valid" });
      }

      const tokens = await this.generateTokens(user);
      await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
        tokens.refreshToken,
        user.id,
      ]);

      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  generateTokens = async (user) => {
    try {
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error generating JWT:", error);
      throw new Error("Failed to generate tokens.");
    }
  };
}

module.exports = new UsersController();
