CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT REFERENCES products (id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    product_price_rupees NUMERIC(12, 2) NOT NULL,
    advance_amount_rupees NUMERIC(12, 2) NOT NULL,
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_notes TEXT,
    payment_proof_path VARCHAR(500) NOT NULL,
    payment_reference VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_product_id ON orders (product_id);
