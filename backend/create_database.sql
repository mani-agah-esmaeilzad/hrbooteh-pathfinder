-- =====================================================
-- hrbooteh Database Setup for XAMPP MySQL
-- =====================================================
-- Run this script in phpMyAdmin or MySQL command line
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS hrbooteh_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE hrbooteh_db;

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_is_active (is_active)
);

-- =====================================================
-- Assessments Table
-- =====================================================
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_type VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    status ENUM('active', 'completed') DEFAULT 'active',
    analysis JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assessments_user_id (user_id),
    INDEX idx_assessments_type (assessment_type),
    INDEX idx_assessments_status (status)
);

-- =====================================================
-- Assessment Messages Table
-- =====================================================
CREATE TABLE IF NOT EXISTS assessment_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    INDEX idx_messages_assessment_id (assessment_id),
    INDEX idx_messages_sender (sender),
    INDEX idx_messages_created_at (created_at)
);

-- =====================================================
-- Insert Sample Data (Optional)
-- =====================================================

-- Sample user (password is "testpassword123" hashed with bcrypt)
INSERT IGNORE INTO users (email, full_name, hashed_password) VALUES 
('admin@hrbooteh.com', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LQv3c1yqBWVHxkd0L');

-- Sample assessment types reference
/*
Assessment Types:
- independence (استقلال)
- confidence (اعتماد به نفس)
- negotiation (مهارت‌های مذاکره)
- leadership (مهارت‌های رهبری)
- communication (مهارت‌های ارتباطی)
*/

-- =====================================================
-- Verification Queries
-- =====================================================
-- Uncomment to verify tables were created successfully
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE assessments;
-- DESCRIBE assessment_messages;

-- Show current database
SELECT 'Database created successfully!' as message;
SELECT DATABASE() as current_database;
