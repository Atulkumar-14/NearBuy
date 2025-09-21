-- SQL Queries to add test data for shops near Bhopal, India
-- This data will help test the nearby shop features

-- First, let's add some shop owners
INSERT INTO Shop_Owners (owner_name, phone, email) VALUES
('Rajesh Sharma', '9826012345', 'rajesh.sharma@gmail.com'),
('Priya Patel', '9826023456', 'priya.patel@yahoo.com'),
('Amit Singh', '9826034567', 'amit.singh@hotmail.com'),
('Sunita Verma', '9826045678', 'sunita.verma@gmail.com'),
('Manoj Kumar', '9826056789', 'manoj.kumar@rediffmail.com'),
('Anita Desai', '9826067890', 'anita.desai@gmail.com'),
('Vikram Malhotra', '9826078901', 'vikram.malhotra@yahoo.com'),
('Pooja Gupta', '9826089012', 'pooja.gupta@gmail.com');

-- Now let's add shops with real Bhopal locations
-- New Market area (23.2599, 77.4126)
INSERT INTO Shops (shop_name, owner_id, shop_image, created_at) VALUES
('Sharma General Store', 1, 'https://images.unsplash.com/photo-1604719312563-3baf5b2b3b7f?w=400', GETDATE()),
('Patel Electronics', 2, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE()),
('Singh Kirana Shop', 3, 'https://images.unsplash.com/photo-1604719312563-3baf5b2b3b7f?w=400', GETDATE()),
('Verma Stationery', 4, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE()),
('Kumar Mobile Shop', 5, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE()),
('Desai Fashion Store', 6, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE()),
('Malhotra Medical Store', 7, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE()),
('Gupta Sweet Shop', 8, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE());

-- Add addresses for these shops with real Bhopal coordinates
INSERT INTO Shop_Address (shop_id, city, country, pincode, landmark, area, latitude, longitude) VALUES
-- Shops near New Market (23.2599, 77.4126) - within 1km radius
(1, 'Bhopal', 'India', '462003', 'Near New Market Police Station', 'New Market', 23.2599, 77.4126),
(2, 'Bhopal', 'India', '462003', 'Opposite TT Nagar Stadium', 'TT Nagar', 23.2585, 77.4142),
(3, 'Bhopal', 'India', '462003', 'Near Manohar Dairy', 'New Market', 23.2612, 77.4110),
(4, 'Bhopal', 'India', '462003', 'Close to Board Office', 'Board Office Colony', 23.2578, 77.4155),

-- Shops near MP Nagar (23.2311, 77.4415) - about 4km from New Market
(5, 'Bhopal', 'India', '462011', 'Near DB Mall', 'MP Nagar Zone 1', 23.2311, 77.4415),
(6, 'Bhopal', 'India', '462011', 'Opposite Chetak Bridge', 'MP Nagar Zone 2', 23.2298, 77.4432),
(7, 'Bhopal', 'India', '462011', 'Near Zone 1 Market', 'MP Nagar Zone 1', 23.2325, 77.4400),
(8, 'Bhopal', 'India', '462011', 'Close to Ashima Mall', 'MP Nagar Zone 2', 23.2285, 77.4448);

-- Add shop timings (default: 9 AM to 9 PM)
INSERT INTO Shop_Timings (shop_id, day, open_time, close_time) VALUES
-- Sharma General Store
(1, 'Monday', '09:00:00', '21:00:00'),
(1, 'Tuesday', '09:00:00', '21:00:00'),
(1, 'Wednesday', '09:00:00', '21:00:00'),
(1, 'Thursday', '09:00:00', '21:00:00'),
(1, 'Friday', '09:00:00', '21:00:00'),
(1, 'Saturday', '09:00:00', '21:00:00'),
(1, 'Sunday', '10:00:00', '20:00:00'),

-- Patel Electronics
(2, 'Monday', '10:00:00', '20:00:00'),
(2, 'Tuesday', '10:00:00', '20:00:00'),
(2, 'Wednesday', '10:00:00', '20:00:00'),
(2, 'Thursday', '10:00:00', '20:00:00'),
(2, 'Friday', '10:00:00', '20:00:00'),
(2, 'Saturday', '10:00:00', '20:00:00'),
(2, 'Sunday', '11:00:00', '19:00:00'),

-- Singh Kirana Shop
(3, 'Monday', '08:00:00', '22:00:00'),
(3, 'Tuesday', '08:00:00', '22:00:00'),
(3, 'Wednesday', '08:00:00', '22:00:00'),
(3, 'Thursday', '08:00:00', '22:00:00'),
(3, 'Friday', '08:00:00', '22:00:00'),
(3, 'Saturday', '08:00:00', '22:00:00'),
(3, 'Sunday', '08:00:00', '22:00:00'),

-- Verma Stationery
(4, 'Monday', '09:30:00', '19:30:00'),
(4, 'Tuesday', '09:30:00', '19:30:00'),
(4, 'Wednesday', '09:30:00', '19:30:00'),
(4, 'Thursday', '09:30:00', '19:30:00'),
(4, 'Friday', '09:30:00', '19:30:00'),
(4, 'Saturday', '09:30:00', '19:30:00'),
(4, 'Sunday', 'CLOSED', 'CLOSED'),

-- Kumar Mobile Shop
(5, 'Monday', '10:30:00', '21:00:00'),
(5, 'Tuesday', '10:30:00', '21:00:00'),
(5, 'Wednesday', '10:30:00', '21:00:00'),
(5, 'Thursday', '10:30:00', '21:00:00'),
(5, 'Friday', '10:30:00', '21:00:00'),
(5, 'Saturday', '10:30:00', '21:00:00'),
(5, 'Sunday', '11:00:00', '20:00:00'),

-- Desai Fashion Store
(6, 'Monday', '11:00:00', '20:30:00'),
(6, 'Tuesday', '11:00:00', '20:30:00'),
(6, 'Wednesday', '11:00:00', '20:30:00'),
(6, 'Thursday', '11:00:00', '20:30:00'),
(6, 'Friday', '11:00:00', '20:30:00'),
(6, 'Saturday', '11:00:00', '20:30:00'),
(6, 'Sunday', '12:00:00', '19:30:00'),

-- Malhotra Medical Store
(7, 'Monday', '08:30:00', '21:30:00'),
(7, 'Tuesday', '08:30:00', '21:30:00'),
(7, 'Wednesday', '08:30:00', '21:30:00'),
(7, 'Thursday', '08:30:00', '21:30:00'),
(7, 'Friday', '08:30:00', '21:30:00'),
(7, 'Saturday', '08:30:00', '21:30:00'),
(7, 'Sunday', '09:00:00', '21:00:00'),

-- Gupta Sweet Shop
(8, 'Monday', '09:00:00', '22:00:00'),
(8, 'Tuesday', '09:00:00', '22:00:00'),
(8, 'Wednesday', '09:00:00', '22:00:00'),
(8, 'Thursday', '09:00:00', '22:00:00'),
(8, 'Friday', '09:00:00', '22:00:00'),
(8, 'Saturday', '09:00:00', '22:00:00'),
(8, 'Sunday', '09:00:00', '22:00:00');

-- Additional shops in different areas for better testing
INSERT INTO Shop_Owners (owner_name, phone, email) VALUES
('Ramesh Jain', '9826090123', 'ramesh.jain@gmail.com'),
('Sneha Agarwal', '9826101234', 'sneha.agarwal@yahoo.com'),
('Alok Tiwari', '9826112345', 'alok.tiwari@hotmail.com'),
('Meena Singh', '9826123456', 'meena.singh@gmail.com');

-- More shops with varied locations
INSERT INTO Shops (shop_name, owner_id, shop_image, created_at) VALUES
('Jain Book Depot', 9, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', GETDATE()),
('Agarwal Jewelry', 10, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', GETDATE()),
('Tiwari Hardware Store', 11, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE()),
('Singh Cosmetic Shop', 12, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', GETDATE());

-- Addresses for additional shops
INSERT INTO Shop_Address (shop_id, city, country, pincode, landmark, area, latitude, longitude) VALUES
-- Near 10 No. Market (23.2644, 77.3988) - about 2km from New Market
(9, 'Bhopal', 'India', '462003', 'Near 10 No. Bus Stop', '10 No. Market', 23.2644, 77.3988),

-- Near Bittan Market (23.2087, 77.4612) - about 6km from New Market
(10, 'Bhopal', 'India', '462016', 'Opposite Bittan Market', 'Bittan Market', 23.2087, 77.4612),

-- Near Habibganj (23.2290, 77.4500) - about 5km from New Market
(11, 'Bhopal', 'India', '462024', 'Near Habibganj Railway Station', 'Habibganj', 23.2290, 77.4500),

-- Near Arera Colony (23.2156, 77.4256) - about 4km from New Market
(12, 'Bhopal', 'India', '462016', 'Close to Arera Colony Market', 'Arera Colony', 23.2156, 77.4256);

-- Add timings for additional shops (simplified - all days same timing)
INSERT INTO Shop_Timings (shop_id, day, open_time, close_time)
SELECT shop_id, day, '09:00:00', '20:00:00'
FROM (
    SELECT 9 as shop_id UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
) s
CROSS JOIN (
    SELECT 'Monday' as day UNION SELECT 'Tuesday' UNION SELECT 'Wednesday' 
    UNION SELECT 'Thursday' UNION SELECT 'Friday' UNION SELECT 'Saturday' UNION SELECT 'Sunday'
) d;

-- Test queries to verify the data
-- Check all shops with their coordinates
SELECT s.shop_name, sa.area, sa.latitude, sa.longitude,
       SQRT(POWER(sa.latitude - 23.2599, 2) + POWER(sa.longitude - 77.4126, 2)) * 111000 as distance_from_new_market_meters
FROM Shops s
JOIN Shop_Address sa ON s.shop_id = sa.shop_id
ORDER BY distance_from_new_market_meters;

-- Find shops within 5km radius of New Market (23.2599, 77.4126)
SELECT s.shop_name, sa.area, sa.latitude, sa.longitude,
       SQRT(POWER(sa.latitude - 23.2599, 2) + POWER(sa.longitude - 77.4126, 2)) * 111000 as distance_meters
FROM Shops s
JOIN Shop_Address sa ON s.shop_id = sa.shop_id
WHERE SQRT(POWER(sa.latitude - 23.2599, 2) + POWER(sa.longitude - 77.4126, 2)) * 111000 <= 5000
ORDER BY distance_meters;