import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Download, Filter, CheckCircle, XCircle, Clock, ArrowLeft, UserPlus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import userActionTracker from '../services/userActionTracker';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'graduated';
}

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('10A');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAdviceBox, setShowAdviceBox] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      rollNumber: '001',
      class: '10A',
      email: 'alice.johnson@school.com',
      phone: '+1-555-0101',
      address: '123 Main St, City, State',
      parentName: 'John Johnson',
      parentPhone: '+1-555-0102',
      joinDate: '2023-09-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'Bob Smith',
      rollNumber: '002',
      class: '10A',
      email: 'bob.smith@school.com',
      phone: '+1-555-0103',
      address: '456 Oak Ave, City, State',
      parentName: 'Jane Smith',
      parentPhone: '+1-555-0104',
      joinDate: '2023-09-01',
      status: 'active'
    },
    {
      id: '3',
      name: 'Charlie Brown',
      rollNumber: '003',
      class: '10A',
      email: 'charlie.brown@school.com',
      phone: '+1-555-0105',
      address: '789 Pine Rd, City, State',
      parentName: 'Lucy Brown',
      parentPhone: '+1-555-0106',
      joinDate: '2023-09-01',
      status: 'active'
    },
    {
      id: '4',
      name: 'Diana Prince',
      rollNumber: '004',
      class: '10A',
      email: 'diana.prince@school.com',
      phone: '+1-555-0107',
      address: '321 Elm St, City, State',
      parentName: 'Queen Hippolyta',
      parentPhone: '+1-555-0108',
      joinDate: '2023-09-01',
      status: 'active'
    }
  ]);

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    class: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: '',
    joinDate: '',
    status: 'active' as 'active' | 'inactive' | 'graduated'
  });

  const classes = ['10A', '10B', '11A', '11B', '12A', '12B'];

  useEffect(() => {
    userActionTracker.start();
    const pageStartTime = Date.now();
    sessionStorage.setItem('students_page_start', pageStartTime.toString());
    
    return () => {
      userActionTracker.stop();
    };
  }, []);

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.rollNumber && newStudent.class && newStudent.email) {
      const student: Student = {
        id: Date.now().toString(),
        ...newStudent
      };
      setStudents([...students, student]);
      setNewStudent({
        name: '',
        rollNumber: '',
        class: '',
        email: '',
        phone: '',
        address: '',
        parentName: '',
        parentPhone: '',
        joinDate: '',
        status: 'active'
      });
      setShowAddForm(false);
      
      const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
      sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      rollNumber: student.rollNumber,
      class: student.class,
      email: student.email,
      phone: student.phone,
      address: student.address,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      joinDate: student.joinDate,
      status: student.status
    });
    setShowAddForm(true);
  };

  const handleUpdateStudent = () => {
    if (editingStudent && newStudent.name && newStudent.rollNumber && newStudent.class && newStudent.email) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...newStudent }
          : s
      ));
      setEditingStudent(null);
      setNewStudent({
        name: '',
        rollNumber: '',
        class: '',
        email: '',
        phone: '',
        address: '',
        parentName: '',
        parentPhone: '',
        joinDate: '',
        status: 'active'
      });
      setShowAddForm(false);
      
      const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
      sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
    sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive' | 'graduated') => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status } : s
    ));
    const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
    sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
  };

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
    sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
    sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const currentChanges = parseInt(sessionStorage.getItem('students_changes') || '0');
    sessionStorage.setItem('students_changes', (currentChanges + 1).toString());
  };

  const handleExport = () => {
    alert('Students data exported successfully!');
  };

  const handleBackClick = () => {
    const actionSummary = userActionTracker.getActionSummary();
    const currentTime = Date.now();
    const pageStartTime = parseInt(sessionStorage.getItem('students_page_start') || '0');
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
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'graduated':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'graduated':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesClass = student.class === selectedClass;
    const matchesFilter = filter === 'all' || student.status === filter;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.includes(searchQuery) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClass && matchesFilter && matchesSearch;
  });

  const stats = {
    total: filteredStudents.length,
    active: filteredStudents.filter(s => s.status === 'active').length,
    inactive: filteredStudents.filter(s => s.status === 'inactive').length,
    graduated: filteredStudents.filter(s => s.status === 'graduated').length,
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students Management</h1>
          <p className="text-gray-600">Manage student information and records efficiently</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Search */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
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

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Add Student Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Add Student
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
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.graduated}</div>
            <div className="text-sm text-gray-600">Graduated</div>
          </div>
        </div>

        {/* Add/Edit Student Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={newStudent.rollNumber}
                onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newStudent.class}
                onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Parent Name"
                value={newStudent.parentName}
                onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Parent Phone"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={newStudent.joinDate}
                onChange={(e) => setNewStudent({ ...newStudent, joinDate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newStudent.status}
                onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value as 'active' | 'inactive' | 'graduated' })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
              <textarea
                placeholder="Address"
                value={newStudent.address}
                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                rows={2}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingStudent(null);
                  setNewStudent({
                    name: '',
                    rollNumber: '',
                    class: '',
                    email: '',
                    phone: '',
                    address: '',
                    parentName: '',
                    parentPhone: '',
                    joinDate: '',
                    status: 'active'
                  });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Students - Class {selectedClass}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">{student.status}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Roll #:</span>
                          <span>{student.rollNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Parent:</span>
                          <span>{student.parentName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{student.parentPhone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{student.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Joined: {student.joinDate}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={student.status}
                      onChange={(e) => handleStatusChange(student.id, e.target.value as 'active' | 'inactive' | 'graduated')}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                    </select>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
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
            currentContext="students"
            onClose={() => setShowAdviceBox(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
