CREATE TABLE complaints (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    order_number VARCHAR(100) NOT NULL,
    complaint_type VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    video_path VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_complaints_status ON complaints (status);

CREATE TABLE complaint_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    complaint_id BIGINT NOT NULL REFERENCES complaints (id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_complaint_images_complaint_id ON complaint_images (complaint_id);
