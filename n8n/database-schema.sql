-- ============================================
-- NFLIX Database Schema for N8N Workflows
-- ============================================
-- This file contains the database schema required for the N8N workflows
-- to function properly. Execute this script on your database before
-- activating the workflows.

-- ============================================
-- Table: users
-- ============================================
-- Stores user information and credit balance
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  credits_balance INT DEFAULT 100 NOT NULL,
  tier VARCHAR(50) DEFAULT 'Normal',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: projects
-- ============================================
-- Stores all video projects created by users
CREATE TABLE IF NOT EXISTS projects (
  project_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  brief TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration VARCHAR(10) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  email VARCHAR(255),
  cultural_references JSON,
  credits_required INT DEFAULT 50 NOT NULL,
  credits_deducted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_tier (tier),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: queue_management
-- ============================================
-- Manages the processing queue for different types of tasks
CREATE TABLE IF NOT EXISTS queue_management (
  queue_id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  queue_type VARCHAR(50) NOT NULL COMMENT 'scenario, montage, revision',
  priority INT NOT NULL DEFAULT 5 COMMENT '1=highest (Premium), 5=normal',
  status VARCHAR(50) DEFAULT 'queued' NOT NULL COMMENT 'queued, processing, completed, failed',
  metadata JSON COMMENT 'Additional data for processing',
  retry_count INT DEFAULT 0,
  error_message TEXT NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_queue_type (queue_type),
  INDEX idx_priority_status (priority, status),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: credit_transactions
-- ============================================
-- Tracks all credit transactions for auditing purposes
CREATE TABLE IF NOT EXISTS credit_transactions (
  transaction_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  project_id VARCHAR(255) NULL,
  transaction_type VARCHAR(50) NOT NULL COMMENT 'debit, credit, refund',
  amount INT NOT NULL,
  balance_before INT NOT NULL,
  balance_after INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL,

  INDEX idx_user_id (user_id),
  INDEX idx_project_id (project_id),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: workflow_logs
-- ============================================
-- Logs workflow executions for debugging and monitoring
CREATE TABLE IF NOT EXISTS workflow_logs (
  log_id VARCHAR(255) PRIMARY KEY,
  workflow_name VARCHAR(100) NOT NULL,
  execution_id VARCHAR(255),
  project_id VARCHAR(255) NULL,
  user_id VARCHAR(255) NULL,
  status VARCHAR(50) NOT NULL COMMENT 'success, error, warning',
  node_name VARCHAR(100),
  message TEXT,
  error_details JSON,
  execution_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,

  INDEX idx_workflow_name (workflow_name),
  INDEX idx_execution_id (execution_id),
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Initial Data / Sample Data
-- ============================================

-- Sample user for testing
INSERT INTO users (user_id, email, username, credits_balance, tier) VALUES
  ('user_test_001', 'test@nflix.io', 'Test User', 500, 'Premium'),
  ('user_test_002', 'demo@nflix.io', 'Demo User', 100, 'Normal')
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ============================================
-- Stored Procedures
-- ============================================

-- Procedure to check and deduct credits
DELIMITER //
CREATE PROCEDURE check_and_deduct_credits(
  IN p_user_id VARCHAR(255),
  IN p_project_id VARCHAR(255),
  IN p_credits_required INT,
  OUT p_success BOOLEAN,
  OUT p_current_balance INT
)
BEGIN
  DECLARE v_balance INT;

  -- Get current balance
  SELECT credits_balance INTO v_balance
  FROM users
  WHERE user_id = p_user_id
  FOR UPDATE;

  SET p_current_balance = v_balance;

  -- Check if sufficient credits
  IF v_balance >= p_credits_required THEN
    -- Deduct credits
    UPDATE users
    SET credits_balance = credits_balance - p_credits_required
    WHERE user_id = p_user_id;

    -- Log transaction
    INSERT INTO credit_transactions (
      transaction_id,
      user_id,
      project_id,
      transaction_type,
      amount,
      balance_before,
      balance_after,
      description
    ) VALUES (
      CONCAT('txn_', UUID()),
      p_user_id,
      p_project_id,
      'debit',
      p_credits_required,
      v_balance,
      v_balance - p_credits_required,
      CONCAT('Credits deducted for project ', p_project_id)
    );

    -- Mark project as debited
    UPDATE projects
    SET credits_deducted = TRUE
    WHERE project_id = p_project_id;

    SET p_success = TRUE;
    SET p_current_balance = v_balance - p_credits_required;
  ELSE
    SET p_success = FALSE;
  END IF;
END //
DELIMITER ;

-- Procedure to get next queue item
DELIMITER //
CREATE PROCEDURE get_next_queue_item(
  IN p_queue_type VARCHAR(50)
)
BEGIN
  SELECT
    queue_id,
    project_id,
    user_id,
    queue_type,
    priority,
    metadata
  FROM queue_management
  WHERE queue_type = p_queue_type
    AND status = 'queued'
  ORDER BY priority ASC, created_at ASC
  LIMIT 1
  FOR UPDATE;
END //
DELIMITER ;

-- Procedure to update queue status
DELIMITER //
CREATE PROCEDURE update_queue_status(
  IN p_queue_id VARCHAR(255),
  IN p_status VARCHAR(50),
  IN p_error_message TEXT
)
BEGIN
  UPDATE queue_management
  SET
    status = p_status,
    error_message = p_error_message,
    started_at = CASE
      WHEN p_status = 'processing' THEN CURRENT_TIMESTAMP
      ELSE started_at
    END,
    completed_at = CASE
      WHEN p_status IN ('completed', 'failed') THEN CURRENT_TIMESTAMP
      ELSE completed_at
    END,
    updated_at = CURRENT_TIMESTAMP
  WHERE queue_id = p_queue_id;

  -- Update project status if queue is completed
  IF p_status = 'completed' THEN
    UPDATE projects p
    JOIN queue_management q ON p.project_id = q.project_id
    SET p.status = CASE q.queue_type
      WHEN 'scenario' THEN 'scenario_ready'
      WHEN 'montage' THEN 'montage_ready'
      WHEN 'revision' THEN 'revision_ready'
    END,
    p.updated_at = CURRENT_TIMESTAMP
    WHERE q.queue_id = p_queue_id;
  END IF;
END //
DELIMITER ;

-- ============================================
-- Views
-- ============================================

-- View for queue statistics
CREATE OR REPLACE VIEW queue_statistics AS
SELECT
  queue_type,
  status,
  priority,
  COUNT(*) as count,
  AVG(TIMESTAMPDIFF(SECOND, created_at, COALESCE(completed_at, CURRENT_TIMESTAMP))) as avg_processing_time_seconds,
  MIN(created_at) as oldest_item,
  MAX(created_at) as newest_item
FROM queue_management
GROUP BY queue_type, status, priority;

-- View for user credit summary
CREATE OR REPLACE VIEW user_credit_summary AS
SELECT
  u.user_id,
  u.email,
  u.credits_balance,
  COUNT(DISTINCT p.project_id) as total_projects,
  COUNT(DISTINCT CASE WHEN p.status = 'pending' THEN p.project_id END) as pending_projects,
  SUM(CASE WHEN ct.transaction_type = 'debit' THEN ct.amount ELSE 0 END) as total_spent,
  SUM(CASE WHEN ct.transaction_type = 'credit' THEN ct.amount ELSE 0 END) as total_added
FROM users u
LEFT JOIN projects p ON u.user_id = p.user_id
LEFT JOIN credit_transactions ct ON u.user_id = ct.user_id
GROUP BY u.user_id, u.email, u.credits_balance;

-- ============================================
-- Triggers
-- ============================================

-- Trigger to log project creation
DELIMITER //
CREATE TRIGGER after_project_insert
AFTER INSERT ON projects
FOR EACH ROW
BEGIN
  INSERT INTO workflow_logs (
    log_id,
    workflow_name,
    project_id,
    user_id,
    status,
    node_name,
    message
  ) VALUES (
    CONCAT('log_', UUID()),
    'Module_Router_Main',
    NEW.project_id,
    NEW.user_id,
    'success',
    'Save_To_Database',
    CONCAT('Project created: ', NEW.project_id)
  );
END //
DELIMITER ;

-- ============================================
-- Indexes for Performance
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_queue_processing ON queue_management(queue_type, status, priority, created_at);
CREATE INDEX idx_project_user_status ON projects(user_id, status, created_at);
CREATE INDEX idx_credits_user_type ON credit_transactions(user_id, transaction_type, created_at);

-- ============================================
-- End of Schema
-- ============================================

-- To verify the schema, run:
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE projects;
-- DESCRIBE queue_management;
-- DESCRIBE credit_transactions;
-- DESCRIBE workflow_logs;
