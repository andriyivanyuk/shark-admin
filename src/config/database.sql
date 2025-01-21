CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(255) NOT NULL
);
