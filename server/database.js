// server/database.js
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the parent directory (project root)
config({ path: join(__dirname, '..', '.env'), override: true, debug: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

async function ensureSchema() {
  // The schema is already created by the SQL script you provided
  // Just verify the tables exist
  try {
    const [tables] = await pool.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('users', 'sessions', 'events')
    `, [process.env.DB_NAME]);
    
    if (tables.length === 3) {
      console.log('✅ All required tables exist: users, sessions, events');
      return true;
    } else {
      console.log('⚠️ Some tables are missing. Please run the SQL schema script first.');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
    return false;
  }
}

async function health() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows[0].ok === 1;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Get user list
async function getUserList() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.user_id,
        u.role,
        u.created_at,
        COUNT(DISTINCT s.session_id) as total_sessions,
        COUNT(e.event_id) as total_events,
        MAX(s.started_at) as last_session
      FROM users u
      LEFT JOIN sessions s ON u.user_id = s.user_id
      LEFT JOIN events e ON s.session_id = e.session_id
      GROUP BY u.user_id, u.role, u.created_at
      ORDER BY u.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('❌ Failed to get user list:', error.message);
    return [];
  }
}

// Get user behavior analysis
async function getUserBehaviorAnalysis(userId = null, timeRange = '7d') {
  try {
    const timeRanges = {
      '1d': '1 DAY',
      '7d': '7 DAY',
      '30d': '30 DAY'
    };
    
    const timeFilter = timeRanges[timeRange] || '7 DAY';
    
    let userCondition = '';
    let params = [];
    
    if (userId) {
      userCondition = 'AND u.user_id = ?';
      params.push(userId);
    }

    // Get basic stats
    const [basicStats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT u.user_id) as unique_users,
        COUNT(DISTINCT s.session_id) as unique_sessions,
        COUNT(e.event_id) as total_events
      FROM users u
      LEFT JOIN sessions s ON u.user_id = s.user_id
      LEFT JOIN events e ON s.session_id = e.session_id
      WHERE s.started_at >= DATE_SUB(NOW(), INTERVAL ${timeFilter})
      ${userCondition}
    `, params);

    // Get event types breakdown
    const [eventTypes] = await pool.execute(`
      SELECT 
        e.type,
        COUNT(*) as count
      FROM events e
      JOIN sessions s ON e.session_id = s.session_id
      JOIN users u ON s.user_id = u.user_id
      WHERE s.started_at >= DATE_SUB(NOW(), INTERVAL ${timeFilter})
      ${userCondition}
      GROUP BY e.type
      ORDER BY count DESC
    `, params);

    // Get popular pages
    const [popularPages] = await pool.execute(`
      SELECT 
        e.url,
        COUNT(*) as count
      FROM events e
      JOIN sessions s ON e.session_id = s.session_id
      JOIN users u ON s.user_id = u.user_id
      WHERE e.type = 'pageview' 
      AND s.started_at >= DATE_SUB(NOW(), INTERVAL ${timeFilter})
      ${userCondition}
      GROUP BY e.url
      ORDER BY count DESC
      LIMIT 10
    `, params);

    // Get user roles breakdown
    const [userRoles] = await pool.execute(`
      SELECT 
        u.role,
        COUNT(DISTINCT u.user_id) as count
      FROM users u
      JOIN sessions s ON u.user_id = s.user_id
      WHERE s.started_at >= DATE_SUB(NOW(), INTERVAL ${timeFilter})
      ${userCondition}
      GROUP BY u.role
    `, params);

    return {
      totalEvents: basicStats[0].total_events,
      uniqueUsers: basicStats[0].unique_users,
      uniqueSessions: basicStats[0].unique_sessions,
      eventTypes: eventTypes.reduce((acc, item) => {
        acc[item.type] = item.count;
        return acc;
      }, {}),
      popularPages: popularPages.reduce((acc, item) => {
        acc[item.url] = item.count;
        return acc;
      }, {}),
      userRoles: userRoles.reduce((acc, item) => {
        acc[item.role] = item.count;
        return acc;
      }, {}),
      timeRange: timeRange
    };
  } catch (error) {
    console.error('❌ Failed to get user behavior analysis:', error.message);
    return null;
  }
}

// Store user interactions (compatible with existing frontend)
async function storeInteractions(interactions) {
  try {
    const results = [];
    
    for (const interaction of interactions) {
      const { session_id, user_id, user_name, user_role, interaction_type, interaction_data, url } = interaction;
      
      // Map old interaction types to new event types
      let eventType = 'custom';
      let props = { ...interaction_data, original_type: interaction_type };
      
      switch (interaction_type) {
        case 'click':
          eventType = 'click';
          props = { ...props, action: 'click' };
          break;
        case 'page_view':
          eventType = 'pageview';
          break;
        case 'scroll':
          eventType = 'scroll';
          break;
        case 'time_on_page':
          eventType = 'custom';
          props = { ...props, duration_ms: interaction_data.timeSpent };
          break;
        default:
          eventType = 'custom';
      }

      // Insert or update user if needed
      if (user_id) {
        await pool.execute(`
          INSERT IGNORE INTO users (user_id, role, created_at) 
          VALUES (?, ?, NOW())
        `, [user_id, user_role || 'user']);
      }

      // Insert or update session if needed
      if (session_id) {
        await pool.execute(`
          INSERT IGNORE INTO sessions (session_id, user_id, started_at, entry_url, user_agent) 
          VALUES (?, ?, NOW(), ?, ?)
        `, [session_id, user_id, url, interaction_data.userAgent || 'Unknown']);
      }

      // Insert event
      const [result] = await pool.execute(`
        INSERT INTO events (event_id, session_id, user_id, ts, type, url, props) 
        VALUES (?, ?, ?, NOW(), ?, ?, ?)
      `, [
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        session_id,
        user_id,
        eventType,
        url,
        JSON.stringify(props)
      ]);
      
      results.push({ id: result.insertId, status: 'success' });
    }
    
    return { success: true, stored: interactions.length, results };
  } catch (error) {
    console.error('❌ Failed to store interactions:', error.message);
    return { success: false, error: error.message };
  }
}

export { pool, ensureSchema, health, getUserList, getUserBehaviorAnalysis, storeInteractions };