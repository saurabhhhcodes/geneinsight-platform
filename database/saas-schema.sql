-- GeneInsight Platform SaaS Database Schema
-- Multi-tenant architecture with organizations, users, subscriptions, and usage tracking

-- Organizations (Tenants)
CREATE TABLE organizations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    logo_url VARCHAR(500),
    plan_type ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    max_users INT DEFAULT 5,
    max_analyses_per_month INT DEFAULT 100,
    max_storage_gb INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_plan_type (plan_type),
    INDEX idx_created_at (created_at)
);

-- Users with multi-tenant support
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    organization_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('owner', 'admin', 'member', 'viewer') DEFAULT 'member',
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Subscriptions
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    organization_id VARCHAR(36) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    plan_type ENUM('free', 'pro', 'enterprise') NOT NULL,
    status ENUM('active', 'canceled', 'past_due', 'unpaid', 'trialing') DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    trial_start TIMESTAMP NULL,
    trial_end TIMESTAMP NULL,
    canceled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_stripe_subscription_id (stripe_subscription_id),
    INDEX idx_status (status),
    INDEX idx_current_period_end (current_period_end)
);

-- Usage tracking
CREATE TABLE usage_records (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    organization_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    resource_type ENUM('analysis', 'storage', 'api_call', 'export') NOT NULL,
    quantity INT DEFAULT 1,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_user_id (user_id),
    INDEX idx_resource_type (resource_type),
    INDEX idx_created_at (created_at)
);

-- Enhanced analyses table with multi-tenancy
CREATE TABLE analyses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    organization_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255),
    sequence_type ENUM('DNA', 'RNA', 'PROTEIN') NOT NULL,
    sequence_data TEXT NOT NULL,
    analysis_type ENUM('basic', 'comprehensive', 'structure_only') DEFAULT 'basic',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    results JSON,
    error_message TEXT,
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- API keys for programmatic access
CREATE TABLE api_keys (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    organization_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSON,
    last_used TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_user_id (user_id),
    INDEX idx_key_prefix (key_prefix),
    INDEX idx_is_active (is_active)
);

-- Invitations for team members
CREATE TABLE invitations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    organization_id VARCHAR(36) NOT NULL,
    invited_by_user_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member', 'viewer') DEFAULT 'member',
    token VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('pending', 'accepted', 'expired') DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_status (status)
);

-- Insert default data
INSERT INTO organizations (id, name, slug, plan_type, max_users, max_analyses_per_month, max_storage_gb) VALUES
('org-demo-001', 'Demo Organization', 'demo-org', 'free', 5, 100, 1),
('org-research-001', 'Research Lab', 'research-lab', 'pro', 25, 1000, 10);

INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role, email_verified) VALUES
('user-demo-001', 'org-demo-001', 'demo@geneinsight.com', '$2b$10$demo.hash.placeholder', 'Demo', 'User', 'owner', TRUE),
('user-research-001', 'org-research-001', 'researcher@geneinsight.com', '$2b$10$research.hash.placeholder', 'Dr. Sarah', 'Chen', 'owner', TRUE),
('user-admin-001', 'org-demo-001', 'admin@geneinsight.com', '$2b$10$admin.hash.placeholder', 'Admin', 'User', 'admin', TRUE);
