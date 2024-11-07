CREATE TABLE tbl_logs (
    error_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(255) NOT NULL,
    route VARCHAR(255),
    input_params JSON NULL,
    error_message VARCHAR(255) NOT NULL,
    stack_trace TEXT,
    -- outgoing BOOLEAN NOT NULL,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    userid VARCHAR(255)
);
