# 🎓 Teacher Dashboard - Career Exploration Platform

A comprehensive analytics platform with MySQL database integration for tracking user interactions and generating AI-powered insights.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (or use Docker)
- npm

### 1. Clone and Install
```bash
npm install
```

### 2. MySQL Database Setup (Choose One Option)

#### Option A: Local MySQL Installation
```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Windows
# Download from: https://dev.mysql.com/downloads/mysql/
```

#### Option B: Docker MySQL (Recommended for Development)
```bash
# Start MySQL with Docker
docker-compose up -d

# Or run MySQL container directly
docker run --name mysql-analytics \
  -e MYSQL_ROOT_PASSWORD=rootpw \
  -e MYSQL_DATABASE=user_interactions_db \
  -e MYSQL_USER=tracker_user \
  -e MYSQL_PASSWORD=your_secure_password_here \
  -p 3306:3306 \
  -d mysql:8 \
  --default-authentication-plugin=mysql_native_password
```

#### Create Database and User (If using local MySQL)
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE user_interactions_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with secure password
CREATE USER 'tracker_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON user_interactions_db.* TO 'tracker_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify connection
\q
SHOW TABLES;
```

#### Database Schema (Auto-created by application)
The application automatically creates these tables:

```sql
-- User interactions table
CREATE TABLE user_interactions (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  user_name VARCHAR(255),
  user_role VARCHAR(100),
  interaction_type VARCHAR(100) NOT NULL,
  interaction_data JSON,
  url VARCHAR(500),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_timestamp (timestamp)
);

-- User sessions table
CREATE TABLE user_sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  user_name VARCHAR(255),
  user_role VARCHAR(100),
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  total_interactions INTEGER DEFAULT 0,
  session_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User analytics table
CREATE TABLE user_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(100),
  analysis_date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  avg_session_duration FLOAT DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  behavior_patterns JSON,
  user_needs JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_date (user_id, analysis_date)
);
```

### 3. Environment Configuration

The `.env` file is already created with these settings:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tracker_user
DB_PASSWORD=your_secure_password_here
DB_NAME=user_interactions_db
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

**Important**: Update `DB_PASSWORD` in `.env` to match your MySQL password!

### 4. Start the Application

#### Start Full Stack (Recommended)
```bash
npm run dev:full
```
This starts both the backend API server and React frontend.

#### Or Start Separately
```bash
# Terminal 1: Start backend API
npm run server

# Terminal 2: Start frontend
npm run dev
```

### 5. Verify Setup

1. **Check API**: Visit `http://localhost:3001/` - Should show API info
2. **Check Database**: Visit `http://localhost:3001/api/health` - Should show `{"status":"OK","database":{"connected":true}}`
3. **Open App**: Visit `http://localhost:5173` - Main application
4. **View Analytics**: Click "Analytics" button in top navigation
5. **Seed Database**: Click "Seed Database" to populate with 500 sample interactions
6. **Analyze Data**: Use "Start Interaction Analysis" to see real MySQL data

## 🔧 Testing the Setup

### Quick Test Commands
```bash
# Test API health
curl http://localhost:3001/api/health

# Should return: {"status":"OK","database":{"connected":true,"status":"Connected to MySQL"}}

# Test root endpoint
curl http://localhost:3001/

# Should return API information and available endpoints
```

### Troubleshooting
- **Connection refused**: Make sure MySQL is running (`brew services start mysql` or `docker-compose up -d`)
- **Access denied**: Check username/password in `.env` file
- **Database not found**: Make sure `user_interactions_db` database exists
- **Port 3306 in use**: Stop other MySQL instances or change port in `.env`

## 📊 Features

### Real-Time User Interaction Tracking
- ✅ **Click Tracking**: Button clicks, navigation, feature usage
- ✅ **Scroll Behavior**: Content engagement patterns  
- ✅ **Form Interactions**: Input field usage, form submissions
- ✅ **Page Views**: Navigation and time-on-page metrics
- ✅ **Session Analytics**: User journey and behavior patterns

### MySQL Database Integration
- ✅ **Automatic Schema Creation**: Tables created on first run
- ✅ **Batch Processing**: Efficient interaction storage
- ✅ **Real-time Analytics**: Live data analysis and insights
- ✅ **User Management**: Track individual user behavior
- ✅ **Performance Optimized**: Indexed queries for fast analytics

### AI-Powered Analytics
- ✅ **Behavior Pattern Recognition**: Identify user types and needs
- ✅ **Engagement Scoring**: Calculate user engagement metrics
- ✅ **Personalized Insights**: User-specific recommendations
- ✅ **Trend Analysis**: Track usage patterns over time
- ✅ **AI Recommendations**: Data-driven optimization suggestions

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```
Returns database connection status and system health.

### Store Interactions
```
POST /api/user-interactions
Content-Type: application/json

{
  "interactions": [
    {
      "id": "interaction_123",
      "sessionId": "session_456", 
      "userId": "user_789",
      "userName": "John Doe",
      "userRole": "teacher",
      "type": "click",
      "data": { "element": "button", "action": "save" },
      "url": "/dashboard",
      "timestamp": 1703123456789
    }
  ],
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "timestamp": 1703123456789
  }
}
```

### Get User Analytics
```
GET /api/analytics/behavior?userId=user_123&timeRange=30d
```
Returns comprehensive user behavior analysis.

### Get User Insights
```
GET /api/analytics/insights?userId=user_123
```
Returns AI-generated insights and recommendations.

### Get User List
```
GET /api/users
```
Returns list of all tracked users with interaction counts.

### Seed Sample Data
```
POST /api/seed-data
```
Populates database with sample interactions for testing.

## 🗄️ Database Management

### Backup Database
```bash
mysqldump -u tracker_user -p user_interactions_db > backup.sql
```

### Restore Database
```bash
mysql -u tracker_user -p user_interactions_db < backup.sql
```

### Monitor Performance
```sql
-- Check table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'user_interactions_db';

-- Check recent interactions
SELECT COUNT(*) as total_interactions,
       COUNT(DISTINCT user_id) as unique_users,
       COUNT(DISTINCT session_id) as unique_sessions
FROM user_interactions 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
```

## 🔒 Security Considerations

### Database Security
- Use strong passwords for database users
- Limit database user privileges to necessary operations only
- Enable MySQL SSL connections in production
- Regular security updates for MySQL server

### Application Security
- Validate all input data before database insertion
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for API endpoints
- Sanitize user data in JSON fields

### Privacy Compliance
- Hash or anonymize user IDs where possible
- Implement data retention policies
- Provide user data deletion capabilities
- Ensure GDPR/CCPA compliance for user data

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-secure-production-password
VITE_API_URL=https://your-domain.com
```

### Build and Deploy
```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

### MySQL Production Setup
- Use connection pooling for better performance
- Set up database replication for high availability
- Configure automated backups
- Monitor database performance and optimize queries

## 📈 Analytics Dashboard Features

### User Selection
- **All Users**: View aggregated analytics across all users
- **Individual Users**: Analyze specific user behavior patterns
- **Role-based Filtering**: Filter by user roles (Teacher, CEO, IT Specialist, etc.)

### Real-time Metrics
- **Total Interactions**: All captured user interactions
- **Engagement Score**: AI-calculated engagement percentage
- **Session Analytics**: User session duration and patterns
- **Behavior Patterns**: Click patterns, scroll behavior, time distribution

### AI Insights
- **User Needs Identification**: Automatically identify user behavior types
- **Personalized Recommendations**: Tailored suggestions for UX improvements
- **Trend Analysis**: Track changes in user behavior over time
- **Performance Optimization**: Data-driven recommendations for platform improvements

## 🛠️ Development

### Project Structure
```
├── src/
│   ├── components/          # React components
│   ├── services/           # API and tracking services
│   ├── types/              # TypeScript type definitions
│   └── data/               # Mock data and utilities
├── server/
│   ├── database.js         # MySQL database service
│   └── server.js           # Express API server
├── .env                    # Environment configuration
└── README.md              # This file
```

### Adding New Analytics
1. **Track New Interactions**: Add tracking calls in `userInteractionTracker.js`
2. **Store in Database**: Interactions automatically stored via API
3. **Create Analysis**: Add analysis logic in `database.js`
4. **Display Results**: Update `AnalyticsPage.tsx` to show new metrics

### Debugging
- **Check Logs**: Server logs show database operations and errors
- **Health Endpoint**: Use `/api/health` to verify database connection
- **Browser Console**: Frontend logs show tracking and API calls
- **MySQL Logs**: Check MySQL error logs for database issues

## 📞 Support

For issues or questions:
1. Check the browser console for frontend errors
2. Check server logs for backend errors  
3. Verify database connection with health endpoint
4. Ensure all environment variables are set correctly
5. Check MySQL server status and logs

## 🎯 Next Steps

1. **Seed Database**: Click "Seed Database" to populate with sample data
2. **Explore Analytics**: Navigate through different users and time ranges
3. **Monitor Real Usage**: Watch live interactions as users navigate
4. **Customize Insights**: Modify AI analysis logic for your specific needs
5. **Scale Up**: Add more sophisticated analytics and machine learning models