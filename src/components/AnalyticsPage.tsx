import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, BookOpen, FileText, Activity, Calendar, Target, Award, Database, Upload } from 'lucide-react';
import userActionTracker from '../services/userActionTracker';
import { dbService } from '../services/databaseService';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [showTrackingData, setShowTrackingData] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    userActionTracker.start();
    sessionStorage.setItem('analytics_page_start', Date.now().toString());
    
    // Check database connection
    checkDatabaseConnection();
    
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData());
      setLoading(false);
    }, 1000);
    
    return () => {
      userActionTracker.stop();
    };
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setDbStatus('checking');
      
      // Try to connect to the database API endpoint
      const response = await fetch('http://localhost:3001/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.database === 'connected') {
          setDbStatus('connected');
        } else {
          setDbStatus('disconnected');
        }
      } else {
        setDbStatus('disconnected');
      }
    } catch (error) {
      console.error('Database connection check failed:', error);
      setDbStatus('disconnected');
    }
  };

  const generateAnalyticsData = () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return {
      overview: {
        totalStudents: 247,
        totalClasses: 12,
        averageAttendance: 94.2,
        averageGrade: 87.5,
        totalAssignments: 156,
        completedAssignments: 142
      },
      trends: {
        attendance: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(now - (6 - i) * oneDay).toLocaleDateString(),
          value: Math.floor(Math.random() * 20) + 85
        })),
        grades: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(now - (6 - i) * oneDay).toLocaleDateString(),
          value: Math.floor(Math.random() * 15) + 80
        })),
        engagement: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(now - (6 - i) * oneDay).toLocaleDateString(),
          value: Math.floor(Math.random() * 20) + 75
        }))
      },
      classPerformance: [
        { name: 'Class 10A', attendance: 96.8, avgGrade: 89.2, engagement: 94.5 },
        { name: 'Class 10B', attendance: 93.4, avgGrade: 86.7, engagement: 91.2 },
        { name: 'Class 11A', attendance: 95.1, avgGrade: 88.9, engagement: 93.8 },
        { name: 'Class 11B', attendance: 91.7, avgGrade: 84.3, engagement: 88.9 },
        { name: 'Class 12A', attendance: 97.2, avgGrade: 90.1, engagement: 96.2 },
        { name: 'Class 12B', attendance: 94.6, avgGrade: 87.8, engagement: 92.4 }
      ],
      recentActivity: [
        { type: 'attendance', message: 'Class 10A marked attendance for today', time: '2 hours ago' },
        { type: 'grade', message: 'Assignment graded for Class 11B', time: '4 hours ago' },
        { type: 'assignment', message: 'New assignment posted for Class 12A', time: '6 hours ago' },
        { type: 'student', message: 'New student enrolled in Class 10B', time: '1 day ago' }
      ]
    };
  };

  const handleBackClick = () => {
    const actionSummary = userActionTracker.getActionSummary();
    const currentTime = Date.now();
    const pageStartTime = parseInt(sessionStorage.getItem('analytics_page_start') || '0');
    const pageDuration = pageStartTime > 0 ? currentTime - pageStartTime : 0;
    
    let trackingInfo = `* *Time on page* — total time spent: ${Math.round(pageDuration / 1000)} seconds

* *Scrolling* — scroll depth: ${actionSummary.scrollData.maxDepth || 0}%

* *Clicks* — any button, link, image, or element clicked (element type, ID/class, text, coordinates): ${actionSummary.actionTypes.click || 0} clicks tracked

* *Hovers* — mouse over important elements (element type, ID/class, duration): ${actionSummary.actionTypes.hover || 0} hovers tracked

* *Form usage* — field focus, changes, submissions: ${actionSummary.actionTypes.form || 0} form interactions

* *Media actions* — video/audio play, pause, seek, fullscreen, volume change: ${actionSummary.actionTypes.media || 0} media actions

* *Image actions* — view, zoom, expand, download: ${actionSummary.actionTypes.image || 0} image actions`;
    
    alert(trackingInfo);
    navigate('/');
  };

  const handleShowTrackingData = () => {
    const actionSummary = userActionTracker.getActionSummary();
    const currentTime = Date.now();
    const pageStartTime = parseInt(sessionStorage.getItem('analytics_page_start') || '0');
    const pageDuration = pageStartTime > 0 ? currentTime - pageStartTime : 0;
    
    const trackingDataForDB = {
      sessionId: `analytics-${Date.now()}`,
      userId: `teacher-${Date.now()}`,
      userRole: 'moderator',
      userName: 'Teacher User',
      pageStartTime,
      pageDuration,
      actionSummary,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    setTrackingData(trackingDataForDB);
    setShowTrackingData(true);
  };

  const handleSubmitTracking = async () => {
    if (!trackingData) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Initialize database service
      await dbService.initialize();
      
      // Prepare interactions for database
      const interactions = [];
      
      // Add page view interaction
      interactions.push({
        type: 'pageview',
        timestamp: trackingData.pageStartTime,
        url: trackingData.url,
        duration: trackingData.pageDuration
      });
      
      // Add click interactions
      if (trackingData.actionSummary.actionTypes.click > 0) {
        interactions.push({
          type: 'click',
          count: trackingData.actionSummary.actionTypes.click,
          timestamp: Date.now()
        });
      }
      
      // Add scroll interactions
      if (trackingData.actionSummary.actionTypes.scroll > 0) {
        interactions.push({
          type: 'scroll',
          maxDepth: trackingData.actionSummary.scrollData.maxDepth,
          count: trackingData.actionSummary.actionTypes.scroll,
          timestamp: Date.now()
        });
      }
      
      // Add form interactions
      if (trackingData.actionSummary.actionTypes.form > 0) {
        interactions.push({
          type: 'form',
          count: trackingData.actionSummary.actionTypes.form,
          timestamp: Date.now()
        });
      }
      
      // Store in database
      const result = await dbService.storeInteractions(interactions, {
        sessionId: trackingData.sessionId,
        userId: trackingData.userId,
        userRole: trackingData.userRole,
        userName: trackingData.userName,
        url: trackingData.url,
        userAgent: navigator.userAgent
      });
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: `✅ Tracking data uploaded successfully! Session ID: ${result.sessionId}`
        });
        
        // Wait 2 seconds then close popup
        setTimeout(() => {
          setShowTrackingData(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: `❌ Failed to upload: ${result.error}`
        });
      }
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTrackingData = () => {
    setShowTrackingData(false);
    setTrackingData(null);
    setSubmitStatus(null);
  };

  const SimpleChart = ({ data, color, height = 60 }: { data: any[], color: string, height?: number }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    
    return (
      <div className={`h-${height} flex items-end justify-between space-x-1`}>
        {data.map((item, index) => {
          const heightPercent = maxValue === minValue ? 50 : ((item.value - minValue) / (maxValue - minValue)) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  color === 'blue' ? 'bg-blue-500' :
                  color === 'green' ? 'bg-green-500' :
                  color === 'yellow' ? 'bg-yellow-500' :
                  color === 'purple' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}
                style={{ height: `${Math.max(heightPercent, 10)}%` }}
              />
              <span className="text-xs text-gray-500 mt-1">{item.date}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            {/* Database Connection Status */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Database Status:</span>
              <div className="flex items-center space-x-1">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    dbStatus === 'connected' ? 'bg-green-500' :
                    dbStatus === 'disconnected' ? 'bg-red-500' :
                    'bg-yellow-500 animate-pulse'
                  }`}
                ></div>
                <span className={`text-sm font-medium ${
                  dbStatus === 'connected' ? 'text-green-600' :
                  dbStatus === 'disconnected' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {dbStatus === 'connected' ? 'Connected' :
                   dbStatus === 'disconnected' ? 'Disconnected' :
                   'Checking...'}
                </span>
              </div>
              <button
                onClick={checkDatabaseConnection}
                className="ml-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                title="Refresh database connection status"
              >
                🔄
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your teaching performance</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="text-sm font-medium text-gray-700">Timeframe:</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Database Status Card */}
        <div className="col-span-full mb-6">
          <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
            dbStatus === 'connected' ? 'border-green-500' :
            dbStatus === 'disconnected' ? 'border-red-500' :
            'border-yellow-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-4 h-4 rounded-full ${
                    dbStatus === 'connected' ? 'bg-green-500' :
                    dbStatus === 'disconnected' ? 'bg-red-500' :
                    'bg-yellow-500 animate-pulse'
                  }`}
                ></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Database Connection</h3>
                  <p className={`text-sm ${
                    dbStatus === 'connected' ? 'text-green-600' :
                    dbStatus === 'disconnected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {dbStatus === 'connected' ? '✅ Database is connected and ready' :
                     dbStatus === 'disconnected' ? '❌ Database connection failed' :
                     '⏳ Checking database connection...'}
                  </p>
                </div>
              </div>
              <button
                onClick={checkDatabaseConnection}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+2.1%</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Students</h3>
            <div className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalStudents}</div>
            <p className="text-sm text-gray-500 mt-2">Active enrollment</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+1.8%</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Attendance</h3>
            <div className="text-3xl font-bold text-gray-900">{analyticsData.overview.averageAttendance}%</div>
            <p className="text-sm text-gray-500 mt-2">This week</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+3.2%</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Grade</h3>
            <div className="text-3xl font-bold text-gray-900">{analyticsData.overview.averageGrade}%</div>
            <p className="text-sm text-gray-500 mt-2">All subjects</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-green-600">+5.1%</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Completion Rate</h3>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round((analyticsData.overview.completedAssignments / analyticsData.overview.totalAssignments) * 100)}%
            </div>
            <p className="text-sm text-gray-500 mt-2">Assignments</p>
          </div>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
            <SimpleChart data={analyticsData.trends.attendance} color="blue" />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Trends</h3>
            <SimpleChart data={analyticsData.trends.grades} color="green" />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
            <SimpleChart data={analyticsData.trends.engagement} color="purple" />
          </div>
        </div>

        {/* Class Performance Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.classPerformance.map((classData: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classData.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classData.attendance}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classData.avgGrade}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classData.engagement}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        classData.attendance >= 95 ? 'bg-green-100 text-green-800' :
                        classData.attendance >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {classData.attendance >= 95 ? 'Excellent' :
                         classData.attendance >= 90 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  activity.type === 'attendance' ? 'bg-blue-400' :
                  activity.type === 'grade' ? 'bg-green-400' :
                  activity.type === 'assignment' ? 'bg-yellow-400' :
                  'bg-purple-400'
                }`}></div>
                <span className="text-sm text-gray-800 flex-1">{activity.message}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Tracking Data Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">User Behavior Tracking</h3>
            </div>
            <button
              onClick={handleShowTrackingData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>View & Submit Tracking Data</span>
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Track and analyze user interactions on this page. Click the button above to view current tracking data and submit it to the database.
          </p>
        </div>

        {/* Tracking Data Popup */}
        {showTrackingData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 User Tracking Data - Analytics Page
              </h3>
              
              {trackingData && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-700">Session Duration</div>
                      <div className="text-lg font-semibold text-gray-900">{Math.round(trackingData.pageDuration / 1000)}s</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-700">Total Actions</div>
                      <div className="text-lg font-semibold text-gray-900">{trackingData.actionSummary.totalActions}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="text-sm font-medium text-blue-700">Clicks</div>
                      <div className="text-lg font-semibold text-blue-900">{trackingData.actionSummary.actionTypes.click || 0}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <div className="text-sm font-medium text-green-700">Scrolls</div>
                      <div className="text-lg font-semibold text-green-900">{trackingData.actionSummary.actionTypes.scroll || 0}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded border border-purple-200">
                      <div className="text-sm font-medium text-purple-700">Forms</div>
                      <div className="text-lg font-semibold text-purple-900">{trackingData.actionSummary.actionTypes.form || 0}</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <div className="text-sm font-medium text-yellow-700">Max Scroll Depth</div>
                    <div className="text-lg font-semibold text-yellow-900">{trackingData.actionSummary.scrollData.maxDepth || 0}%</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm font-medium text-gray-700">Page URL</div>
                    <div className="text-sm text-gray-600 break-all">{trackingData.url}</div>
                  </div>
                </div>
              )}
              
              {submitStatus && (
                <div className={`p-3 rounded-lg mb-4 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitTracking}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Uploading...' : 'Submit to Database'}
                </button>
                <button
                  onClick={handleCloseTrackingData}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;