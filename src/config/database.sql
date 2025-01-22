CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(255) NOT NULL,
  image_path VARCHAR(255),
  created_by INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  refresh_token TEXT
);
