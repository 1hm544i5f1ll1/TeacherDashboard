import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Download, Filter, CheckCircle, XCircle, Clock, ArrowLeft, Database, Upload } from 'lucide-react';
import userActionTracker from '../services/userActionTracker';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';
import { dbService } from '../services/databaseService';
1

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late';
  rollNumber: string;
}

interface AttendanceData {
  [key: string]: Student[];
}



const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState<string>('10A');
  const [filter, setFilter] = useState<string>('all');
  const [showAdviceBox, setShowAdviceBox] = useState(false);
  const [trackingText, setTrackingText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);


  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    '10A': [
      { id: '1', name: 'Alice Johnson', status: 'present', rollNumber: '001' },
      { id: '2', name: 'Bob Smith', status: 'absent', rollNumber: '002' },
      { id: '3', name: 'Charlie Brown', status: 'present', rollNumber: '003' },
      { id: '4', name: 'Diana Prince', status: 'late', rollNumber: '004' },
      { id: '5', name: 'Edward Norton', status: 'present', rollNumber: '005' },
      { id: '6', name: 'Fiona Green', status: 'present', rollNumber: '006' },
    ],
    '10B': [
      { id: '7', name: 'George Wilson', status: 'present', rollNumber: '001' },
      { id: '8', name: 'Helen Davis', status: 'present', rollNumber: '002' },
      { id: '9', name: 'Ian Thompson', status: 'absent', rollNumber: '003' },
      { id: '10', name: 'Julia Roberts', status: 'present', rollNumber: '004' },
    ],
    '11A': [
      { id: '11', name: 'Kevin Martin', status: 'present', rollNumber: '001' },
      { id: '12', name: 'Lisa Anderson', status: 'present', rollNumber: '002' },
      { id: '13', name: 'Mike Johnson', status: 'absent', rollNumber: '003' },
      { id: '14', name: 'Nina Patel', status: 'present', rollNumber: '004' },
      { id: '15', name: 'Oliver Wilson', status: 'late', rollNumber: '005' },
    ],
    '11B': [
      { id: '16', name: 'Pamela Brown', status: 'present', rollNumber: '001' },
      { id: '17', name: 'Quentin Lee', status: 'present', rollNumber: '002' },
      { id: '18', name: 'Rachel Green', status: 'present', rollNumber: '003' },
      { id: '19', name: 'Steve Miller', status: 'absent', rollNumber: '004' },
    ],
    '12A': [
      { id: '20', name: 'Tina Turner', status: 'present', rollNumber: '001' },
      { id: '21', name: 'Ulysses Grant', status: 'present', rollNumber: '002' },
      { id: '22', name: 'Victoria White', status: 'late', rollNumber: '003' },
      { id: '23', name: 'William Black', status: 'present', rollNumber: '004' },
      { id: '24', name: 'Xavier Cruz', status: 'present', rollNumber: '005' },
    ],
    '12B': [
      { id: '25', name: 'Yolanda Young', status: 'present', rollNumber: '001' },
      { id: '26', name: 'Zachary Taylor', status: 'absent', rollNumber: '002' },
      { id: '27', name: 'Amanda Clark', status: 'present', rollNumber: '003' },
      { id: '28', name: 'Benjamin Adams', status: 'present', rollNumber: '004' },
    ]
  });

  const classes = ['10A', '10B', '11A', '11B', '12A', '12B'];

  useEffect(() => {
    // Start user action tracking
    userActionTracker.start();
    
    // Set page start time for accurate duration tracking
    const pageStartTime = Date.now();
    sessionStorage.setItem('attendance_page_start', pageStartTime.toString());
    
    // Set up real-time tracking updates
    const updateTrackingDisplay = () => {
      const actionSummary = userActionTracker.getActionSummary();
      
      // Update real-time counters
      const clicksElement = document.getElementById('tracking-clicks');
      const hoversElement = document.getElementById('tracking-hovers');
      const scrollsElement = document.getElementById('tracking-scrolls');
      const formsElement = document.getElementById('tracking-forms');
      
      if (clicksElement) clicksElement.textContent = actionSummary.actionTypes.click || 0;
      if (hoversElement) hoversElement.textContent = actionSummary.actionTypes.hover || 0;
      if (scrollsElement) scrollsElement.textContent = actionSummary.actionTypes.scroll || 0;
      if (formsElement) formsElement.textContent = actionSummary.actionTypes.form || 0;
    };
    
    // Update every second
    const trackingInterval = setInterval(updateTrackingDisplay, 1000);
    
    // Initialize tracking text on page load
    setTimeout(() => {
      updateTrackingText();
    }, 1000);
    
    return () => {
      userActionTracker.stop();
      clearInterval(trackingInterval);
    };
  }, []);

  const handleStatusChange = (studentId: string, newStatus: 'present' | 'absent' | 'late') => {
    console.log('Status change requested:', { studentId, newStatus, selectedClass });
    
    // Simple frontend-only update - no database needed
    setAttendanceData(prev => {
      const newData = {
        ...prev,
        [selectedClass]: prev[selectedClass].map(student =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      };
      
      console.log('Updated student status:', newData[selectedClass].find(s => s.id === studentId));
      return newData;
    });

    // Track changes for user tracking popup
    const currentChanges = parseInt(sessionStorage.getItem('attendance_changes') || '0');
    sessionStorage.setItem('attendance_changes', (currentChanges + 1).toString());
    
    console.log('Status updated successfully!');
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    
    // Track changes for user tracking popup
    const currentChanges = parseInt(sessionStorage.getItem('attendance_changes') || '0');
    sessionStorage.setItem('attendance_changes', (currentChanges + 1).toString());
  };

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    
    // Track changes for user tracking popup
    const currentChanges = parseInt(sessionStorage.getItem('attendance_changes') || '0');
    sessionStorage.setItem('attendance_changes', (currentChanges + 1).toString());
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    
    // Track changes for user tracking popup
    const currentChanges = parseInt(sessionStorage.getItem('attendance_changes') || '0');
    sessionStorage.setItem('attendance_changes', (currentChanges + 1).toString());
  };

  const handleExport = () => {
    userActionTracker.trackInteraction('attendance_export', {
      date: selectedDate,
      class: selectedClass
    });
    // Export functionality would go here
    alert('Attendance exported successfully!');
  };

  const handleBackClick = () => {
    // Navigate back to dashboard
    navigate('/');
  };

  const updateTrackingText = () => {
    const actionSummary = userActionTracker.getActionSummary();
    const currentTime = Date.now();
    const pageStartTime = parseInt(sessionStorage.getItem('attendance_page_start') || '0');
    const pageDuration = pageStartTime > 0 ? currentTime - pageStartTime : 0;
    
    const trackingInfo = `* *Time on page* — total time spent: ${Math.round(pageDuration / 1000)} seconds

* *Scrolling* — scroll depth: ${actionSummary.scrollData.maxDepth || 0}%

* *Clicks* — any button, link, image, or element clicked (element type, ID/class, text, coordinates): ${actionSummary.actionTypes.click || 0} clicks tracked

* *Hovers* — mouse over important elements (element type, ID/class, duration): ${actionSummary.actionTypes.hover || 0} hovers tracked

* *Form usage* — field focus, changes, submissions: ${actionSummary.actionTypes.form || 0} form interactions

* *Media actions* — video/audio play, pause, seek, fullscreen, volume change: ${actionSummary.actionTypes.media || 0} media actions

* *Image actions* — view, zoom, expand, download: ${actionSummary.actionTypes.image || 0} image actions`;
    
    setTrackingText(trackingInfo);
  };

  const handleSubmitTracking = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Initialize database service
      await dbService.initialize();
      
      const actionSummary = userActionTracker.getActionSummary();
      const currentTime = Date.now();
      const pageStartTime = parseInt(sessionStorage.getItem('attendance_page_start') || '0');
      const pageDuration = pageStartTime > 0 ? currentTime - pageStartTime : 0;
      
      // Prepare interactions for database
      const interactions = [];
      
      // Add page view interaction
      interactions.push({
        type: 'pageview',
        timestamp: pageStartTime,
        url: window.location.href,
        duration: pageDuration
      });
      
      // Add click interactions
      if (actionSummary.actionTypes.click > 0) {
        interactions.push({
          type: 'click',
          count: actionSummary.actionTypes.click,
          timestamp: Date.now()
        });
      }
      
      // Add scroll interactions
      if (actionSummary.actionTypes.scroll > 0) {
        interactions.push({
          type: 'scroll',
          maxDepth: actionSummary.scrollData.maxDepth,
          count: actionSummary.actionTypes.scroll,
          timestamp: Date.now()
        });
      }
      
      // Add form interactions
      if (actionSummary.actionTypes.form > 0) {
        interactions.push({
          type: 'form',
          count: actionSummary.actionTypes.form,
          timestamp: Date.now()
        });
      }
      
      // Add hover interactions
      if (actionSummary.actionTypes.hover > 0) {
        interactions.push({
          type: 'hover',
          count: actionSummary.actionTypes.hover,
          timestamp: Date.now()
        });
      }
      
      // Add media interactions
      if (actionSummary.actionTypes.media > 0) {
        interactions.push({
          type: 'media',
          count: actionSummary.actionTypes.media,
          timestamp: Date.now()
        });
      }
      
      // Add image interactions
      if (actionSummary.actionTypes.image > 0) {
        interactions.push({
          type: 'image',
          count: actionSummary.actionTypes.image,
          timestamp: Date.now()
        });
      }
      
      // Add attendance changes
      const attendanceChanges = parseInt(sessionStorage.getItem('attendance_changes') || '0');
      if (attendanceChanges > 0) {
        interactions.push({
          type: 'attendance_change',
          count: attendanceChanges,
          timestamp: Date.now()
        });
      }
      
      // Store in database
      const result = await dbService.storeInteractions(interactions, {
        sessionId: `attendance-${Date.now()}`,
        userId: `teacher-${Date.now()}`,
        userRole: 'moderator',
        userName: 'Teacher User',
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: `✅ Tracking data uploaded successfully! Session ID: ${result.sessionId}`
        });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'absent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'late':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const currentStudents = attendanceData[selectedClass] || [];
  const filteredStudents = currentStudents.filter(student => {
    if (filter === 'all') return true;
    return student.status === filter;
  });

  const stats = {
    total: currentStudents.length,
    present: currentStudents.filter(s => s.status === 'present').length,
    absent: currentStudents.filter(s => s.status === 'absent').length,
    late: currentStudents.filter(s => s.status === 'late').length,
  };

  const attendanceRate = stats.total > 0 ? ((stats.present + stats.late) / stats.total * 100).toFixed(1) : '0';

  // Debug logging
  console.log('Current class:', selectedClass);
  console.log('Current students:', currentStudents);
  console.log('Filtered students:', filteredStudents);
  console.log('Stats:', stats);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackClick}
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Track and manage student attendance efficiently</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Date Picker */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Test Tracking Button */}
              <button
                onClick={() => {
                  const actionSummary = userActionTracker.getActionSummary();
                  alert(`Current Tracking Status:\n\nClicks: ${actionSummary.actionTypes.click || 0}\nHovers: ${actionSummary.actionTypes.hover || 0}\nScrolls: ${actionSummary.actionTypes.scroll || 0}\nForms: ${actionSummary.actionTypes.form || 0}\nMedia: ${actionSummary.actionTypes.media || 0}\nImages: ${actionSummary.actionTypes.image || 0}\n\nTotal Actions: ${actionSummary.totalActions}`);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                🧪 Test Tracking
              </button>

              {/* Class Selector */}
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Students</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <div className="text-sm text-gray-600">Late</div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{attendanceRate}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-yellow-800">
            <strong>Debug Info:</strong> Class {selectedClass} - Total: {stats.total}, Present: {stats.present}, Absent: {stats.absent}, Late: {stats.late}
            <br />
            <strong>Changes Made:</strong> {sessionStorage.getItem('attendance_changes') || '0'}
            <br />
            <button 
              onClick={() => {
                console.log('Test button clicked');
                console.log('Current attendance data:', attendanceData[selectedClass]);
                setSelectedDate(new Date().toISOString().split('T')[0]);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Test State Update
            </button>
            <button 
              onClick={() => {
                const summary = userActionTracker.getActionSummary();
                console.log('Action Tracker Summary:', summary);
                alert(`Total Actions: ${summary.totalActions}\nClick Count: ${summary.actionTypes.click || 0}\nMax Scroll: ${summary.scrollData.maxDepth}%`);
              }}
              className="mt-2 ml-2 px-3 py-1 bg-green-500 text-white rounded text-xs"
            >
              Test Action Tracker
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Class {selectedClass} - {selectedDate}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{student.rollNumber}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Roll #{student.rollNumber}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                    {getStatusIcon(student.status)}
                    <span className="ml-1 capitalize">{student.status}</span>
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`p-2 rounded-lg transition-colors ${
                        student.status === 'present' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={`p-2 rounded-lg transition-colors ${
                        student.status === 'absent' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'late')}
                      className={`p-2 rounded-lg transition-colors ${
                        student.status === 'late' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Action Tracker Demo */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Enhanced User Tracking Demo</h3>
          <p className="text-sm text-blue-700 mb-4">Interact with these elements to see comprehensive tracking in action!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Click Tracking Demo */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">🖱️ Click Tracking</h4>
              <div className="space-y-2">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full"
                  id="demo-button-1"
                  data-tracking="primary-action"
                >
                  Primary Action Button
                </button>
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors w-full"
                  id="demo-button-2"
                  data-tracking="secondary-action"
                >
                  Secondary Action Button
                </button>
                <button 
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors w-full"
                  id="demo-button-3"
                  data-tracking="tertiary-action"
                >
                  Tertiary Action Button
                </button>
              </div>
            </div>

            {/* Form Tracking Demo */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">📝 Form Tracking</h4>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Type here to test form tracking"
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  id="demo-input-1"
                  data-tracking="form-field"
                />
                <select 
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  id="demo-select"
                  data-tracking="form-select"
                >
                  <option value="">Select an option</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
                <textarea 
                  placeholder="Type a message here..."
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  id="demo-textarea"
                  data-tracking="form-textarea"
                  rows={2}
                />
              </div>
            </div>

            {/* Hover Tracking Demo */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">🔄 Hover Tracking</h4>
              <div className="space-y-2">
                <div 
                  className="p-4 bg-yellow-100 rounded border border-yellow-300 cursor-pointer hover:bg-yellow-200 transition-colors"
                  data-tracking="hover-element-1"
                >
                  <p className="text-sm text-yellow-800">Hover over this box to test hover tracking</p>
                </div>
                <div 
                  className="p-4 bg-green-100 rounded border border-green-300 cursor-pointer hover:bg-green-200 transition-colors"
                  data-tracking="hover-element-2"
                >
                  <p className="text-sm text-green-800">Another hover element for testing</p>
                </div>
              </div>
            </div>

            {/* Scroll Tracking Demo */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">📊 Scroll Tracking</h4>
              <div className="space-y-2">
                <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-600">Scroll down to test scroll tracking</p>
                </div>
                <div className="h-32 bg-gray-300 rounded flex items-center justify-center">
                  <p className="text-gray-600">More content to scroll through</p>
                </div>
                <div className="h-32 bg-gray-400 rounded flex items-center justify-center">
                  <p className="text-gray-600">Even more content for scroll testing</p>
                </div>
              </div>
            </div>

            {/* Media Tracking Demo */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">🎵 Media Tracking</h4>
              <div className="space-y-2">
                <audio 
                  controls 
                  className="w-full"
                  id="demo-audio"
                  data-tracking="audio-element"
                >
                  <source src="data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAUAAAiSAAYGBgYJCQkJCQwMDAwMDw8PDw8SEhISEhUVFRUVGBgYGBgbGxsbGx4eHh4eISEhISEkJCQkJCcnJycnKioqKiotLS0tLTAwMDAwMzMzMzM2NjY2Njk5OTk5PT09PT0//////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAYAAAAAAAAAIkjVx9f/AAAA" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="text-center">
                  <button 
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    onClick={() => {
                      const audio = document.getElementById('demo-audio') as HTMLAudioElement;
                      if (audio) {
                        audio.play();
                      }
                    }}
                  >
                    Play Audio
                  </button>
                </div>
              </div>
            </div>

            {/* Image Tracking Demo */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">🖼️ Image Tracking</h4>
              <div className="space-y-2">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlbW8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo="
                  alt="Demo Image"
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  id="demo-image"
                  data-tracking="demo-image"
                />
                <div className="text-center">
                  <button 
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                    onClick={() => {
                      const img = document.getElementById('demo-image');
                      if (img) {
                        img.style.transform = img.style.transform === 'scale(1.2)' ? 'scale(1)' : 'scale(1.2)';
                      }
                    }}
                  >
                    Zoom Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Tracking Display */}
          <div className="mt-6 p-4 bg-white rounded border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-3">📊 Real-time Tracking Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600" id="tracking-clicks">0</div>
                <div className="text-gray-600">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600" id="tracking-hovers">0</div>
                <div className="text-gray-600">Hovers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600" id="tracking-scrolls">0</div>
                <div className="text-gray-600">Scrolls</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600" id="tracking-forms">0</div>
                <div className="text-gray-600">Forms</div>
              </div>
            </div>
          </div>
        </div>



        {/* ChatGPT Advice Box */}
        <div className="mt-8">
          <button
            onClick={() => setShowAdviceBox(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>Get AI Teaching Advice</span>
          </button>
        </div>

        {showAdviceBox && (
          <ChatGPTAdviceBox
            dashboardType="teacher"
            currentContext="attendance"
            onClose={() => setShowAdviceBox(false)}
          />
        )}

        {/* User Tracking Data Section - Moved to top for visibility */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">User Behavior Tracking</h3>
            </div>
            <button
              onClick={updateTrackingText}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              🔄 Update Tracking Data
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Tracking Data:
              </label>
              <textarea
                value={trackingText}
                onChange={(e) => setTrackingText(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Click 'Update Tracking Data' to see current tracking information..."
                readOnly
              />
            </div>
            
            {submitStatus && (
              <div className={`p-3 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleSubmitTracking}
                disabled={isSubmitting || !trackingText}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Uploading...' : 'Submit to Database'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendancePage;