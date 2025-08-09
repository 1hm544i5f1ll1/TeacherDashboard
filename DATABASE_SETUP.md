# 🗄️ SQL Database Setup Guide

## Local Database Setup Options

### Option 1: SQLite (Recommended for Development)

SQLite is perfect for local development and testing. It's file-based and requires no server setup.

#### Installation & Setup:

```bash
# Install SQLite (if not already installed)
# On macOS
brew install sqlite

# On Ubuntu/Debian
sudo apt-get install sqlite3

# On Windows
# Download from: https://www.sqlite.org/download.html
```

#### Create Database:

```bash
# Create database file
sqlite3 user_interactions.db

# Or create with Node.js
npm install sqlite3
```

#### SQL Schema:

```sql
-- Create user_interactions table
CREATE TABLE user_interactions (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    user_role VARCHAR(100),
    interaction_type VARCHAR(100) NOT NULL,
    interaction_data JSON,
    url VARCHAR(500),
    timestamp BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    user_role VARCHAR(100),
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    total_interactions INTEGER DEFAULT 0,
    session_data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_analytics table
CREATE TABLE user_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(255) NOT NULL,
    user_role VARCHAR(100),
    analysis_date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    avg_session_duration FLOAT DEFAULT 0,
    engagement_score FLOAT DEFAULT 0,
    behavior_patterns JSON,
    user_needs JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX idx_user_interactions_timestamp ON user_interactions(timestamp);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_date ON user_analytics(analysis_date);
```

### Option 2: PostgreSQL (Recommended for Production)

PostgreSQL is excellent for production environments with advanced features.

#### Installation:

```bash
# On macOS
brew install postgresql
brew services start postgresql

# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# On Windows
# Download from: https://www.postgresql.org/download/windows/
```

#### Setup Database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE user_interactions_db;
CREATE USER tracker_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE user_interactions_db TO tracker_user;

# Connect to your database
\c user_interactions_db
```

#### PostgreSQL Schema:

```sql
-- Enable JSON extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_interactions table
CREATE TABLE user_interactions (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    user_role VARCHAR(100),
    interaction_type VARCHAR(100) NOT NULL,
    interaction_data JSONB,
    url VARCHAR(500),
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    user_role VARCHAR(100),
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    total_interactions INTEGER DEFAULT 0,
    session_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_analytics table
CREATE TABLE user_analytics (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_role VARCHAR(100),
    analysis_date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    avg_session_duration FLOAT DEFAULT 0,
    engagement_score FLOAT DEFAULT 0,
    behavior_patterns JSONB,
    user_needs JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX idx_user_interactions_timestamp ON user_interactions(timestamp);
CREATE INDEX idx_user_interactions_data ON user_interactions USING GIN (interaction_data);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_date ON user_analytics(analysis_date);
```

### Option 3: MySQL (Alternative)

#### Installation:

```bash
# On macOS
brew install mysql
brew services start mysql

# On Ubuntu/Debian
sudo apt-get install mysql-server
sudo systemctl start mysql

# Secure installation
sudo mysql_secure_installation
```

#### Setup:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database and user
CREATE DATABASE user_interactions_db;
CREATE USER 'tracker_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON user_interactions_db.* TO 'tracker_user'@'localhost';
FLUSH PRIVILEGES;

USE user_interactions_db;
```

## 🔧 Node.js Database Connection

### Install Database Drivers:

```bash
# For SQLite
npm install sqlite3

# For PostgreSQL
npm install pg

# For MySQL
npm install mysql2

# For ORM (optional)
npm install sequelize
# or
npm install prisma
```

### Connection Examples:

#### SQLite Connection:

```javascript
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./user_interactions.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Example query
db.all("SELECT * FROM user_interactions WHERE user_id = ?", ['user123'], (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(rows);
  }
});
```

#### PostgreSQL Connection:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'tracker_user',
  host: 'localhost',
  database: 'user_interactions_db',
  password: 'your_secure_password',
  port: 5432,
});

// Example query
pool.query('SELECT * FROM user_interactions WHERE user_id = $1', ['user123'])
  .then(res => console.log(res.rows))
  .catch(err => console.error(err));
```

## 🚀 Integration with Your App

### 1. Initialize Tracking:

```javascript
import { userTracker } from './services/userInteractionTracker.js';
import { dbService } from './services/databaseService.js';

// Initialize database
await dbService.initialize();

// Start tracking for a user
userTracker.init('user123', 'teacher');
```

### 2. Track Custom Events:

```javascript
// Track dashboard interactions
userTracker.trackDashboardEvent('dashboard_switch', {
  fromDashboard: 'teacher',
  toDashboard: 'ceo',
  switchTime: Date.now()
});

// Track feature usage
userTracker.trackDashboardEvent('feature_used', {
  feature: 'gradebook',
  duration: 30000,
  completed: true
});
```

### 3. Analyze Data:

```javascript
// Get user behavior analysis
const analysis = await dbService.analyzeUserBehavior('user123', '7d');

// Generate insights
const insights = await dbService.generateInsights('user123');

console.log('User Insights:', insights);
```

## 📊 Sample Queries for Analysis

### Most Popular Features:

```sql
SELECT 
    JSON_EXTRACT(interaction_data, '$.dashboardItem') as feature,
    COUNT(*) as usage_count
FROM user_interactions 
WHERE interaction_type = 'click' 
    AND JSON_EXTRACT(interaction_data, '$.dashboardItem') IS NOT NULL
GROUP BY feature
ORDER BY usage_count DESC;
```

### User Engagement by Role:

```sql
SELECT 
    user_role,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_interactions,
    AVG(CASE 
        WHEN interaction_type = 'time_on_page' 
        THEN JSON_EXTRACT(interaction_data, '$.timeSpent') 
    END) as avg_time_spent
FROM user_interactions
GROUP BY user_role;
```

### Session Analysis:

```sql
SELECT 
    session_id,
    user_role,
    COUNT(*) as interactions_per_session,
    MIN(timestamp) as session_start,
    MAX(timestamp) as session_end,
    (MAX(timestamp) - MIN(timestamp)) / 1000 as session_duration_seconds
FROM user_interactions
GROUP BY session_id, user_role
ORDER BY session_duration_seconds DESC;
```

## 🔒 Security Considerations

1. **Data Privacy**: Ensure compliance with GDPR/CCPA
2. **Anonymization**: Consider hashing user IDs
3. **Retention**: Implement data retention policies
4. **Access Control**: Restrict database access
5. **Encryption**: Use encrypted connections

## 📈 Performance Tips

1. **Batch Inserts**: Insert interactions in batches
2. **Indexes**: Create appropriate indexes for queries
3. **Partitioning**: Consider table partitioning for large datasets
4. **Archiving**: Archive old data regularly
5. **Monitoring**: Monitor database performance

## 🧪 Testing

```javascript
// Test database connection
async function testDatabase() {
  try {
    await dbService.initialize();
    
    // Test storing interactions
    const testInteractions = [{
      id: 'test_1',
      sessionId: 'test_session',
      userId: 'test_user',
      userRole: 'teacher',
      type: 'click',
      data: { element: 'button' },
      timestamp: Date.now()
    }];
    
    const result = await dbService.storeInteractions(testInteractions);
    console.log('Test result:', result);
    
    // Test analysis
    const analysis = await dbService.analyzeUserBehavior();
    console.log('Analysis test:', analysis);
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();
```

This setup provides a comprehensive foundation for tracking user interactions and analyzing behavior patterns to understand user needs and optimize your dashboard accordingly.