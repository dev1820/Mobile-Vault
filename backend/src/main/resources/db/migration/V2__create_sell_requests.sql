CREATE TABLE sell_requests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    phone_company VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    condition_rating INTEGER NOT NULL,
    storage_capacity VARCHAR(40) NOT NULL,
    sim_status VARCHAR(30) NOT NULL,
    repair_status VARCHAR(30) NOT NULL,
    accessories VARCHAR(30) NOT NULL,
    device_serial_number VARCHAR(120) NOT NULL,
    device_details TEXT NOT NULL,
    expected_price_rupees NUMERIC(12, 2) NOT NULL,
    video_path VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_sell_requests_status ON sell_requests (status);

CREATE TABLE sell_request_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sell_request_id BIGINT NOT NULL REFERENCES sell_requests (id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_sell_request_images_sell_request_id ON sell_request_images (sell_request_id);
