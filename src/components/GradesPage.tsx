import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Download, Filter, CheckCircle, XCircle, Clock, ArrowLeft, BookOpen, TrendingUp, Award } from 'lucide-react';
import userActionTracker from '../services/userActionTracker';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';

interface Student {
  id: string;
  name: string;
  grade: number;
  rollNumber: string;
  subject: string;
  lastUpdated: string;
}

interface GradesData {
  [key: string]: Student[];
}

const GradesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState<string>('10A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [filter, setFilter] = useState<string>('all');
  const [showAdviceBox, setShowAdviceBox] = useState(false);

  const [gradesData, setGradesData] = useState<GradesData>({
    '10A': [
      { id: '1', name: 'Alice Johnson', grade: 85, rollNumber: '001', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '2', name: 'Bob Smith', grade: 92, rollNumber: '002', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '3', name: 'Charlie Brown', grade: 78, rollNumber: '003', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '4', name: 'Diana Prince', grade: 95, rollNumber: '004', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '5', name: 'Edward Norton', grade: 88, rollNumber: '005', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '6', name: 'Fiona Green', grade: 91, rollNumber: '006', subject: 'Mathematics', lastUpdated: '2024-01-15' },
    ],
    '10B': [
      { id: '7', name: 'George Wilson', grade: 87, rollNumber: '001', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '8', name: 'Helen Davis', grade: 93, rollNumber: '002', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '9', name: 'Ian Thompson', grade: 76, rollNumber: '003', subject: 'Mathematics', lastUpdated: '2024-01-15' },
      { id: '10', name: 'Julia Roberts', grade: 89, rollNumber: '004', subject: 'Mathematics', lastUpdated: '2024-01-15' },
    ],
  });

  const classes = ['10A', '10B', '11A', '11B', '12A', '12B'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

  useEffect(() => {
    userActionTracker.start();
    const pageStartTime = Date.now();
    sessionStorage.setItem('grades_page_start', pageStartTime.toString());
    
    return () => {
      userActionTracker.stop();
    };
  }, []);

  const handleGradeChange = (studentId: string, newGrade: number) => {
    setGradesData(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass].map(student =>
        student.id === studentId ? { ...student, grade: newGrade, lastUpdated: new Date().toISOString().split('T')[0] } : student
      )
    }));

    const currentChanges = parseInt(sessionStorage.getItem('grades_changes') || '0');
    sessionStorage.setItem('grades_changes', (currentChanges + 1).toString());
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const currentChanges = parseInt(sessionStorage.getItem('grades_changes') || '0');
    sessionStorage.setItem('grades_changes', (currentChanges + 1).toString());
  };

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    const currentChanges = parseInt(sessionStorage.getItem('grades_changes') || '0');
    sessionStorage.setItem('grades_changes', (currentChanges + 1).toString());
  };

  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    const currentChanges = parseInt(sessionStorage.getItem('grades_changes') || '0');
    sessionStorage.setItem('grades_changes', (currentChanges + 1).toString());
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const currentChanges = parseInt(sessionStorage.getItem('grades_changes') || '0');
    sessionStorage.setItem('grades_changes', (currentChanges + 1).toString());
  };

  const handleExport = () => {
    alert('Grades exported successfully!');
  };

  const handleBackClick = () => {
    const actionSummary = userActionTracker.getActionSummary();
    const currentTime = Date.now();
    const pageStartTime = parseInt(sessionStorage.getItem('grades_page_start') || '0');
    const pageDuration = pageStartTime > 0 ? currentTime - pageStartTime : 0;
    
    let trackingInfo = `* *Time on page* — total time spent: ${Math.round(pageDuration / 1000)} seconds

* *Scrolling* — scroll depth: ${actionSummary.scrollData.maxDepth || 0}%

* *Clicks* — any button, link, image, or element clicked (element type, ID/class, text, coordinates): ${actionSummary.actionTypes.click || 0} clicks tracked

* *Hovers* — mouse over important elements (element type, ID/class, duration): ${actionSummary.actionTypes.hover || 0} hovers tracked

* *Form usage* — field focus, changes, submissions: ${actionSummary.actionTypes.form || 0} form interactions

* *Media actions* — video/audio play, pause, seek, fullscreen, volume change: ${actionSummary.actionTypes.media || 0} media actions

* *Image actions* — view, zoom, expand, download: ${actionSummary.actionTypes.image || 0} image actions`;
    
    alert(trackingInfo);
    
    // Navigate back to dashboard
    navigate('/');
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-50 text-green-700 border-green-200';
    if (grade >= 80) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade >= 70) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getGradeIcon = (grade: number) => {
    if (grade >= 90) return <Award className="w-5 h-5 text-green-500" />;
    if (grade >= 80) return <TrendingUp className="w-5 h-5 text-blue-500" />;
    if (grade >= 70) return <BookOpen className="w-5 h-5 text-yellow-500" />;
    return <BookOpen className="w-5 h-5 text-red-500" />;
  };

  const currentStudents = gradesData[selectedClass] || [];
  const filteredStudents = currentStudents.filter(student => {
    if (filter === 'all') return true;
    if (filter === 'excellent') return student.grade >= 90;
    if (filter === 'good') return student.grade >= 80 && student.grade < 90;
    if (filter === 'average') return student.grade >= 70 && student.grade < 80;
    if (filter === 'needs_improvement') return student.grade < 70;
    return true;
  });

  const stats = {
    total: currentStudents.length,
    excellent: currentStudents.filter(s => s.grade >= 90).length,
    good: currentStudents.filter(s => s.grade >= 80 && s.grade < 90).length,
    average: currentStudents.filter(s => s.grade >= 70 && s.grade < 80).length,
    needsImprovement: currentStudents.filter(s => s.grade < 70).length,
  };

  const averageGrade = stats.total > 0 ? (currentStudents.reduce((sum, s) => sum + s.grade, 0) / stats.total).toFixed(1) : '0';

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grades Management</h1>
          <p className="text-gray-600">Track and manage student grades efficiently</p>
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

              {/* Subject Selector */}
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
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
                  <option value="all">All Grades</option>
                  <option value="excellent">Excellent (90+)</option>
                  <option value="good">Good (80-89)</option>
                  <option value="average">Average (70-79)</option>
                  <option value="needs_improvement">Needs Improvement (&lt;70)</option>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.excellent}</div>
            <div className="text-sm text-gray-600">Excellent</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.good}</div>
            <div className="text-sm text-gray-600">Good</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.average}</div>
            <div className="text-sm text-gray-600">Average</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.needsImprovement}</div>
            <div className="text-sm text-gray-600">Needs Improvement</div>
          </div>
        </div>

        {/* Average Grade */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{averageGrade}%</div>
            <div className="text-sm text-gray-600">Class Average Grade</div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Class {selectedClass} - {selectedSubject} - {selectedDate}</h2>
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
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(student.grade)}`}>
                    {getGradeIcon(student.grade)}
                    <span className="ml-1">{student.grade}%</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={student.grade}
                      onChange={(e) => handleGradeChange(student.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Updated: {student.lastUpdated}
                  </div>
                </div>
              </div>
            ))}
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
            currentContext="grades"
            onClose={() => setShowAdviceBox(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GradesPage;
