CREATE TABLE device_requests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category VARCHAR(20) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    budget_rupees NUMERIC(12, 2),
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_device_requests_status ON device_requests (status);
