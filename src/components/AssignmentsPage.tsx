import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Download, Filter, CheckCircle, XCircle, Clock, ArrowLeft, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import userActionTracker from '../services/userActionTracker';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  class: string;
  status: 'active' | 'completed' | 'overdue';
  submissions: number;
  totalStudents: number;
}

const AssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState<string>('10A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [filter, setFilter] = useState<string>('all');
  const [showAdviceBox, setShowAdviceBox] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Algebra Fundamentals',
      description: 'Complete exercises 1-20 from Chapter 3',
      dueDate: '2024-01-20',
      subject: 'Mathematics',
      class: '10A',
      status: 'active',
      submissions: 15,
      totalStudents: 25
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      description: 'Write a report on the pendulum experiment',
      dueDate: '2024-01-18',
      subject: 'Physics',
      class: '10A',
      status: 'overdue',
      submissions: 8,
      totalStudents: 25
    },
    {
      id: '3',
      title: 'Essay on Shakespeare',
      description: 'Analyze the themes in Hamlet',
      dueDate: '2024-01-25',
      subject: 'English',
      class: '10A',
      status: 'active',
      submissions: 12,
      totalStudents: 25
    }
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    class: ''
  });

  const classes = ['10A', '10B', '11A', '11B', '12A', '12B'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

  useEffect(() => {
    userActionTracker.start();
    const pageStartTime = Date.now();
    sessionStorage.setItem('assignments_page_start', pageStartTime.toString());
    
    return () => {
      userActionTracker.stop();
    };
  }, []);

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.description && newAssignment.dueDate && newAssignment.subject && newAssignment.class) {
      const assignment: Assignment = {
        id: Date.now().toString(),
        ...newAssignment,
        status: 'active',
        submissions: 0,
        totalStudents: 25
      };
      setAssignments([...assignments, assignment]);
      setNewAssignment({ title: '', description: '', dueDate: '', subject: '', class: '' });
      setShowAddForm(false);
      
      const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
      sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      subject: assignment.subject,
      class: assignment.class
    });
    setShowAddForm(true);
  };

  const handleUpdateAssignment = () => {
    if (editingAssignment && newAssignment.title && newAssignment.description && newAssignment.dueDate && newAssignment.subject && newAssignment.class) {
      setAssignments(assignments.map(a => 
        a.id === editingAssignment.id 
          ? { ...a, ...newAssignment }
          : a
      ));
      setEditingAssignment(null);
      setNewAssignment({ title: '', description: '', dueDate: '', subject: '', class: '' });
      setShowAddForm(false);
      
      const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
      sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
    }
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
    sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
  };

  const handleStatusChange = (id: string, status: 'active' | 'completed' | 'overdue') => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status } : a
    ));
    const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
    sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
    sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
  };

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
    sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
  };

  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
    sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const currentChanges = parseInt(sessionStorage.getItem('assignments_changes') || '0');
    sessionStorage.setItem('assignments_changes', (currentChanges + 1).toString());
  };

  const handleExport = () => {
    alert('Assignments exported successfully!');
  };

  const handleBackClick = () => {
    const actionSummary = userActionTracker.getActionSummary();
    const currentTime = Date.now();
    const pageStartTime = parseInt(sessionStorage.getItem('assignments_page_start') || '0');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'active') return assignment.status === 'active';
    if (filter === 'completed') return assignment.status === 'completed';
    if (filter === 'overdue') return assignment.status === 'overdue';
    return true;
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
  };

  const submissionRate = assignments.length > 0 ? (assignments.reduce((sum, a) => sum + a.submissions, 0) / (assignments.reduce((sum, a) => sum + a.totalStudents, 0)) * 100).toFixed(1) : '0';

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments Management</h1>
          <p className="text-gray-600">Create and manage student assignments efficiently</p>
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
                <FileText className="w-5 h-5 text-gray-500" />
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
                  <option value="all">All Assignments</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Add Assignment Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Assignment
              </button>

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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Assignments</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        {/* Submission Rate */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{submissionRate}%</div>
            <div className="text-sm text-gray-600">Overall Submission Rate</div>
          </div>
        </div>

        {/* Add/Edit Assignment Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={newAssignment.class}
                onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <textarea
                placeholder="Assignment Description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={editingAssignment ? handleUpdateAssignment : handleAddAssignment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAssignment(null);
                  setNewAssignment({ title: '', description: '', dueDate: '', subject: '', class: '' });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Assignments - {selectedClass}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1 capitalize">{assignment.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Subject: {assignment.subject}</span>
                      <span>Class: {assignment.class}</span>
                      <span>Due: {assignment.dueDate}</span>
                      <span>Submissions: {assignment.submissions}/{assignment.totalStudents}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={assignment.status}
                      onChange={(e) => handleStatusChange(assignment.id, e.target.value as 'active' | 'completed' | 'overdue')}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <button
                      onClick={() => handleEditAssignment(assignment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
            currentContext="assignments"
            onClose={() => setShowAdviceBox(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
