-- SQL Queries to add product categories and products for testing
-- This will make the shop testing more realistic

-- Add product categories
INSERT INTO Product_Categories (category_name, category_description) VALUES
('Groceries', 'Daily groceries, vegetables, fruits, and household essentials'),
('Electronics', 'Mobile phones, accessories, gadgets, and electronic items'),
('Stationery', 'Books, pens, notebooks, office supplies, and educational materials'),
('Fashion', 'Clothing, accessories, footwear, and fashion items'),
('Hardware', 'Tools, construction materials, home improvement items'),
('Jewelry', 'Gold, silver, artificial jewelry, and accessories'),
('Medical', 'Medicines, health products, and pharmaceutical items'),
('Food & Sweets', 'Snacks, sweets, bakery items, and food products'),
('Books', 'Educational books, novels, magazines, and reading materials'),
('Cosmetics', 'Beauty products, personal care items, and cosmetics');

-- Add products for each category
INSERT INTO Products (product_name, category_id, brand, description, color) VALUES
-- Groceries (Category 1)
('Rice Basmati 1kg', 1, 'India Gate', 'Premium quality basmati rice', 'White'),
('Wheat Flour 5kg', 1, 'Pillsbury', 'Fresh whole wheat flour', 'Brown'),
('Sugar 1kg', 1, 'Madhur', 'Pure refined sugar', 'White'),
('Tea Leaves 250g', 1, 'Tata Tea', 'Premium tea leaves', 'Black'),
('Cooking Oil 1L', 1, 'Fortune', 'Refined sunflower oil', 'Yellow'),

-- Electronics (Category 2)
('Smartphone Samsung', 2, 'Samsung', 'Latest Android smartphone', 'Black'),
('Earphones Bluetooth', 2, 'Boat', 'Wireless Bluetooth earphones', 'Blue'),
('Power Bank 10000mAh', 2, 'Mi', 'Fast charging power bank', 'White'),
('Mobile Charger', 2, 'Realme', 'Fast charging adapter', 'Black'),
('USB Cable Type-C', 2, 'Ambrane', 'Fast charging USB cable', 'White'),

-- Stationery (Category 3)
('Notebook A4 Size', 3, 'Classmate', 'Ruled notebook 200 pages', 'Blue'),
('Ball Pen Set', 3, 'Reynolds', 'Set of 10 ball pens', 'Blue'),
('Pencil HB', 3, 'Nataraj', 'Pack of 10 pencils', 'Yellow'),
('Eraser', 3, 'Apsara', 'Soft eraser for pencil', 'White'),
('Scale 30cm', 3, 'Apsara', 'Transparent plastic scale', 'Transparent'),

-- Fashion (Category 4)
('Cotton T-Shirt', 4, 'Allen Solly', '100% cotton casual t-shirt', 'Blue'),
('Jeans Denim', 4, 'Levi''s', 'Regular fit denim jeans', 'Blue'),
('Sports Shoes', 4, 'Nike', 'Comfortable sports shoes', 'Black'),
('Cotton Shirt', 4, 'Peter England', 'Formal cotton shirt', 'White'),
('Wrist Watch', 4, 'Titan', 'Analog wrist watch', 'Silver'),

-- Hardware (Category 5)
('Hammer 500g', 5, 'Taparia', 'Steel hammer with wooden handle', 'Silver'),
('Screwdriver Set', 5, 'Taparia', 'Set of 6 screwdrivers', 'Black'),
('Pliers 8 inch', 5, 'Taparia', 'Combination pliers', 'Silver'),
('Measuring Tape', 5, 'Stanley', '5 meter measuring tape', 'Yellow'),
('LED Bulb 9W', 5, 'Philips', 'Energy efficient LED bulb', 'White'),

-- Jewelry (Category 6)
('Gold Ring', 6, 'Tanishq', '22k gold ring for women', 'Gold'),
('Silver Anklet', 6, 'PC Jeweller', 'Pure silver anklet pair', 'Silver'),
('Artificial Necklace', 6, 'Sukkhi', 'Fashion necklace set', 'Multicolor'),
('Bangles Set', 6, 'TBZ', 'Gold plated bangles', 'Gold'),
('Earrings', 6, 'Tanishq', 'Diamond stud earrings', 'Silver'),

-- Medical (Category 7)
('Pain Relief Balm', 7, 'Amrutanjan', 'Pain relief balm 50g', 'White'),
('Cough Syrup', 7, 'Benadryl', 'Cough relief syrup 100ml', 'Brown'),
('Vitamin Tablets', 7, 'Revital', 'Multivitamin tablets pack', 'Red'),
('Hand Sanitizer', 7, 'Dettol', 'Hand sanitizer 500ml', 'Transparent'),
('Face Mask', 7, 'Venus', 'Pack of 50 surgical masks', 'Blue'),

-- Food & Sweets (Category 8)
('Milk Cake 500g', 8, 'Bikaner', 'Fresh milk cake sweet', 'Brown'),
('Samosa', 8, 'Local', 'Fresh vegetable samosa', 'Golden'),
('Jalebi 250g', 8, 'Local', 'Crispy jalebi sweet', 'Orange'),
('Namkeen Mixture', 8, 'Haldiram', 'Spicy namkeen mixture', 'Yellow'),
('Biscuits Cream', 8, 'Parle', 'Cream biscuits pack', 'Orange'),

-- Books (Category 9)
('NCERT Mathematics', 9, 'NCERT', 'Class 10 mathematics textbook', 'Blue'),
('English Grammar Book', 9, 'Wren & Martin', 'Comprehensive English grammar', 'Red'),
('Science Practical', 9, 'Full Marks', 'Science practical notebook', 'Green'),
('Story Book', 9, 'Penguin', 'Collection of short stories', 'Multicolor'),
('Dictionary', 9, 'Oxford', 'English to Hindi dictionary', 'Blue'),

-- Cosmetics (Category 10)
('Face Cream 50g', 10, 'Ponds', 'Moisturizing face cream', 'Pink'),
('Shampoo 200ml', 10, 'Dove', 'Nourishing shampoo', 'White'),
('Soap 100g', 10, 'Lux', 'Beauty soap bar', 'Pink'),
('Lipstick', 10, 'Lakme', 'Matte finish lipstick', 'Red'),
('Nail Polish', 10, 'Maybelline', 'Long lasting nail polish', 'Pink');

-- Add product images
INSERT INTO Product_Images (product_id, image_url) VALUES
-- Sample images for first few products
(1, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300'),
(2, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300'),
(3, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'),
(4, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300'),
(5, 'https://images.unsplash.com/photo-1556909114-44a76b67e6e3?w=300'),
(6, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'),
(7, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'),
(8, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300'),
(9, 'https://images.unsplash.com/photo-1550009158-94ae827ab5d2?w=300'),
(10, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300');

-- Add shop products (products available in each shop)
-- Sharma General Store (Shop 1) - Groceries
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(1, 1, 120.00, 50),  -- Rice 1kg
(1, 2, 180.00, 30),  -- Wheat Flour 5kg
(1, 3, 45.00, 100),  -- Sugar 1kg
(1, 4, 85.00, 25),   -- Tea Leaves 250g
(1, 5, 110.00, 40);  -- Cooking Oil 1L

-- Patel Electronics (Shop 2) - Electronics
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(2, 6, 15000.00, 5),   -- Smartphone Samsung
(2, 7, 1299.00, 15),   -- Earphones Bluetooth
(2, 8, 899.00, 20),    -- Power Bank 10000mAh
(2, 9, 299.00, 30),    -- Mobile Charger
(2, 10, 199.00, 50);   -- USB Cable Type-C

-- Singh Kirana Shop (Shop 3) - Mixed groceries and food
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(3, 1, 115.00, 40),    -- Rice 1kg
(3, 3, 43.00, 80),     -- Sugar 1kg
(3, 31, 120.00, 25),   -- Milk Cake 500g
(3, 34, 80.00, 30),    -- Namkeen Mixture
(3, 35, 25.00, 60);    -- Biscuits Cream

-- Verma Stationery (Shop 4) - Stationery and books
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(4, 11, 45.00, 25),    -- Notebook A4 Size
(4, 12, 50.00, 40),    -- Ball Pen Set
(4, 13, 30.00, 35),    -- Pencil HB
(4, 14, 5.00, 100),    -- Eraser
(4, 36, 150.00, 15);   -- NCERT Mathematics

-- Kumar Mobile Shop (Shop 5) - Electronics and accessories
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(5, 6, 14500.00, 8),   -- Smartphone Samsung
(5, 8, 849.00, 25),    -- Power Bank 10000mAh
(5, 9, 279.00, 40),    -- Mobile Charger
(5, 7, 1199.00, 20);   -- Earphones Bluetooth

-- Desai Fashion Store (Shop 6) - Fashion items
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(6, 16, 799.00, 15),   -- Cotton T-Shirt
(6, 17, 1299.00, 10),  -- Jeans Denim
(6, 18, 2499.00, 8),   -- Sports Shoes
(6, 19, 899.00, 12),   -- Cotton Shirt
(6, 20, 3999.00, 5);   -- Wrist Watch

-- Malhotra Medical Store (Shop 7) - Medical items
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(7, 26, 45.00, 50),    -- Pain Relief Balm
(7, 27, 85.00, 30),    -- Cough Syrup
(7, 28, 150.00, 25),   -- Vitamin Tablets
(7, 29, 75.00, 40),    -- Hand Sanitizer
(7, 30, 150.00, 35);   -- Face Mask

-- Gupta Sweet Shop (Shop 8) - Food and sweets
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(8, 31, 110.00, 20),   -- Milk Cake 500g
(8, 32, 15.00, 80),    -- Samosa
(8, 33, 60.00, 25),    -- Jalebi 250g
(8, 34, 75.00, 30),    -- Namkeen Mixture
(8, 35, 22.00, 50);    -- Biscuits Cream

-- Additional shops products
-- Jain Book Depot (Shop 9) - Books and stationery
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(9, 36, 145.00, 20),   -- NCERT Mathematics
(9, 37, 250.00, 15),   -- English Grammar Book
(9, 38, 180.00, 12),   -- Science Practical
(9, 11, 42.00, 30),    -- Notebook A4 Size
(9, 12, 48.00, 45);    -- Ball Pen Set

-- Agarwal Jewelry (Shop 10) - Jewelry items
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(10, 21, 25000.00, 3),  -- Gold Ring
(10, 22, 3500.00, 8),   -- Silver Anklet
(10, 23, 899.00, 15),   -- Artificial Necklace
(10, 24, 1200.00, 10),  -- Bangles Set
(10, 25, 4500.00, 6);   -- Earrings

-- Test queries to verify the data
-- Check products available in each shop
SELECT s.shop_name, p.product_name, pc.category_name, sp.price, sp.stock
FROM Shop_Product sp
JOIN Shops s ON sp.shop_id = s.shop_id
JOIN Products p ON sp.product_id = p.product_id
JOIN Product_Categories pc ON p.category_id = pc.category_id
ORDER BY s.shop_name, p.product_name;

-- Find shops selling specific product categories near a location
SELECT s.shop_name, sa.area, sa.latitude, sa.longitude, pc.category_name, COUNT(p.product_id) as product_count
FROM Shops s
JOIN Shop_Address sa ON s.shop_id = sa.shop_id
JOIN Shop_Product sp ON s.shop_id = sp.shop_id
JOIN Products p ON sp.product_id = p.product_id
JOIN Product_Categories pc ON p.category_id = pc.category_id
WHERE SQRT(POWER(sa.latitude - 23.2599, 2) + POWER(sa.longitude - 77.4126, 2)) * 111000 <= 5000
GROUP BY s.shop_name, sa.area, sa.latitude, sa.longitude, pc.category_name
ORDER BY s.shop_name;