// server/server.js
import express from 'express';
import cors from 'cors';
import { pool, ensureSchema, health, getUserList, getUserBehaviorAnalysis, storeInteractions } from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await health();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      database: 'error'
    });
  }
});

// Database connection test endpoint
app.get('/api/db/test', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test, NOW() as current_time');
    res.json({
      status: 'success',
      message: 'Database connection successful',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get database tables endpoint
app.get('/api/db/tables', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME, UPDATE_TIME
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME]);
    
    res.json({
      status: 'success',
      database: process.env.DB_NAME,
      tables: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get table information',
      error: error.message
    });
  }
});

// User interactions endpoint (for the frontend)
app.post('/api/user-interactions', async (req, res) => {
  try {
    const interactions = req.body;
    const result = await storeInteractions(interactions);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to store interactions',
      error: error.message
    });
  }
});

// API endpoint for storing user interactions
app.post('/api/interactions', async (req, res) => {
  try {
    const { interactions, metadata } = req.body;
    
    if (!interactions || !Array.isArray(interactions)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid interactions data' 
      });
    }

    // Generate session ID if not provided
    const sessionId = metadata.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userId = metadata.userId || `user-${Date.now()}`;
    const userRole = metadata.userRole || 'user';

    // Transform interactions to match database schema
    const dbInteractions = interactions.map(interaction => ({
      session_id: sessionId,
      user_id: userId,
      user_name: metadata.userName || 'Unknown User',
      user_role: userRole,
      interaction_type: interaction.type,
      interaction_data: {
        ...interaction,
        sessionId,
        userId,
        userRole,
        userAgent: metadata.userAgent,
        url: metadata.url
      },
      url: metadata.url || window.location.href
    }));

    // Store in database
    const result = await storeInteractions(dbInteractions);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Stored ${result.stored} interactions`,
        sessionId,
        userId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('❌ Error storing interactions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint for getting user behavior analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const { userId, timeRange } = req.query;
    
    const analysis = await getUserBehaviorAnalysis(userId, timeRange);
    
    if (analysis) {
      res.json(analysis);
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to get analytics'
      });
    }
    
  } catch (error) {
    console.error('❌ Error getting analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const { timeRange = '7d', userId } = req.query;
    const analysis = await getUserBehaviorAnalysis(userId, timeRange);
    
    if (analysis) {
      res.json({
        status: 'success',
        data: analysis
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get analytics'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

// Get users endpoint
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUserList();
    res.json({
      status: 'success',
      users: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get users',
      error: error.message
    });
  }
});

// ChatGPT advice endpoint (placeholder)
app.post('/api/chatgpt-advice', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    // This is a placeholder - you would integrate with ChatGPT API here
    res.json({
      status: 'success',
      advice: `This is a placeholder response for: ${question}`,
      context: context
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get ChatGPT advice',
      error: error.message
    });
  }
});

// Get advice history endpoint
app.get('/api/advice-history', async (req, res) => {
  try {
    const { userId, dashboardType } = req.query;
    
    // This is a placeholder - you would query the advice_analytics table here
    res.json({
      status: 'success',
      history: [],
      userId,
      dashboardType
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get advice history',
      error: error.message
    });
  }
});

// Attendance tracking endpoint
app.post('/api/attendance', async (req, res) => {
  try {
    const attendanceData = req.body;
    
    // This is a placeholder - you would insert into attendance_tracking table here
    res.json({
      status: 'success',
      message: 'Attendance tracked successfully',
      data: attendanceData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to track attendance',
      error: error.message
    });
  }
});

// Course selection tracking endpoint
app.post('/api/course-selection', async (req, res) => {
  try {
    const courseData = req.body;
    
    // This is a placeholder - you would insert into course_selection table here
    res.json({
      status: 'success',
      message: 'Course selection tracked successfully',
      data: courseData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to track course selection',
      error: error.message
    });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔌 Initializing database connection...');
    const schemaOk = await ensureSchema();
    
    if (!schemaOk) {
      console.log('⚠️ Schema verification failed. Please run the SQL schema script first.');
      console.log('   The script should create: users, sessions, and events tables');
      process.exit(1);
    }
    
    console.log('✅ Database schema verified successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Database test: http://localhost:${PORT}/api/db/test`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();