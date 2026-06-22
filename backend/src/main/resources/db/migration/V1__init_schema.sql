-- Create tables
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 10,
    price NUMERIC(12, 2) NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    transaction_type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed Categories
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Electronic components, devices, and accessories'),
    ('Office Supplies', 'Stationery, paper products, and office essentials'),
    ('Hardware Tools', 'Hand tools, power tools, and workshop equipment'),
    ('Safety Equipment', 'Personal protective equipment and safety gear'),
    ('Packaging Materials', 'Boxes, tapes, wrapping and shipping supplies')
ON CONFLICT (name) DO NOTHING;

-- Seed Products
INSERT INTO products (sku, name, quantity, minimum_stock, price, category_id) VALUES
    ('ELEC-001', 'Laptop Dell XPS 15', 45, 10, 1299.99, 1),
    ('ELEC-002', 'Monitor LG 27" 4K', 32, 8, 549.99, 1),
    ('ELEC-003', 'Wireless Keyboard Logitech MX', 78, 20, 89.99, 1),
    ('ELEC-004', 'USB-C Hub 7-Port', 5, 15, 49.99, 1),
    ('ELEC-005', 'Webcam Logitech C920', 12, 10, 79.99, 1),
    ('OFFC-001', 'A4 Paper Ream 500 Sheets', 200, 50, 8.99, 2),
    ('OFFC-002', 'Ballpoint Pen Box (50pcs)', 150, 30, 12.99, 2),
    ('OFFC-003', 'Stapler Heavy Duty', 3, 10, 24.99, 2),
    ('OFFC-004', 'Sticky Notes 3x3" (12 pads)', 85, 20, 15.99, 2),
    ('OFFC-005', 'Manila Folders (100pcs)', 60, 25, 18.99, 2),
    ('HDWR-001', 'Cordless Drill 20V', 18, 5, 129.99, 3),
    ('HDWR-002', 'Socket Wrench Set 40pc', 22, 8, 89.99, 3),
    ('HDWR-003', 'Digital Caliper 6"', 9, 10, 34.99, 3),
    ('SAFE-001', 'Safety Helmet Class E', 4, 20, 29.99, 4),
    ('SAFE-002', 'Safety Gloves Cut-Resistant L', 35, 40, 14.99, 4),
    ('SAFE-003', 'Safety Goggles Clear Lens', 2, 25, 12.99, 4),
    ('PACK-001', 'Shipping Box 12x10x8" (25pcs)', 120, 30, 32.99, 5),
    ('PACK-002', 'Bubble Wrap Roll 48"x250ft', 8, 10, 59.99, 5),
    ('PACK-003', 'Packing Tape 2" x 110yd (6pk)', 55, 20, 22.99, 5),
    ('PACK-004', 'Stretch Wrap 18" x 1500ft', 3, 10, 44.99, 5)
ON CONFLICT (sku) DO NOTHING;

-- Seed Transactions
INSERT INTO inventory_transactions (product_id, transaction_type, quantity, notes, created_at) VALUES
    (1, 'IN', 50, 'Initial stock receipt from Dell supplier', NOW() - INTERVAL '30 days'),
    (2, 'IN', 40, 'Initial stock receipt from LG supplier', NOW() - INTERVAL '28 days'),
    (6, 'IN', 500, 'Bulk order from paper supplier', NOW() - INTERVAL '25 days'),
    (1, 'OUT', 5, 'Issued to IT department', NOW() - INTERVAL '20 days'),
    (3, 'OUT', 2, 'Issued to Finance team', NOW() - INTERVAL '18 days'),
    (14, 'IN', 50, 'Safety equipment restock', NOW() - INTERVAL '15 days'),
    (4, 'OUT', 10, 'Shipped to branch office', NOW() - INTERVAL '12 days'),
    (11, 'IN', 20, 'Power tools reorder', NOW() - INTERVAL '10 days'),
    (16, 'OUT', 23, 'Issued for construction project', NOW() - INTERVAL '8 days'),
    (20, 'OUT', 7, 'Packaging for outbound shipment', NOW() - INTERVAL '5 days'),
    (8, 'OUT', 7, 'Issued to admin', NOW() - INTERVAL '4 days'),
    (13, 'OUT', 1, 'Quality check measurement', NOW() - INTERVAL '3 days'),
    (17, 'IN', 100, 'Restocked from local supplier', NOW() - INTERVAL '2 days'),
    (15, 'ADJUSTMENT', 35, 'Physical inventory count adjustment', NOW() - INTERVAL '1 day'),
    (2, 'OUT', 8, 'Delivered to warehouse office', NOW() - INTERVAL '12 hours');
