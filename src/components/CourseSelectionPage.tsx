import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Plus, Edit, Trash2, Filter, Search } from 'lucide-react';
import { userFlowTracker } from '../services/userFlowTracker';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  studentCount: number;
  maxCapacity: number;
  status: 'active' | 'inactive' | 'full';
  schedule: string;
  credits: number;
}

const CourseSelectionPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Advanced Mathematics',
      code: 'MATH301',
      description: 'Advanced calculus and mathematical analysis',
      instructor: 'Dr. Sarah Johnson',
      studentCount: 28,
      maxCapacity: 30,
      status: 'active',
      schedule: 'Mon, Wed, Fri 10:00-11:00',
      credits: 4
    },
    {
      id: '2',
      name: 'Physics Laboratory',
      code: 'PHYS201',
      description: 'Hands-on physics experiments and analysis',
      instructor: 'Prof. Michael Chen',
      studentCount: 20,
      maxCapacity: 25,
      status: 'active',
      schedule: 'Tue, Thu 14:00-16:00',
      credits: 3
    },
    {
      id: '3',
      name: 'English Literature',
      code: 'ENG101',
      description: 'Classical and modern literature analysis',
      instructor: 'Dr. Emily Davis',
      studentCount: 35,
      maxCapacity: 35,
      status: 'full',
      schedule: 'Mon, Wed, Fri 09:00-10:00',
      credits: 3
    },
    {
      id: '4',
      name: 'Computer Programming',
      code: 'CS102',
      description: 'Introduction to programming concepts',
      instructor: 'Mr. David Wilson',
      studentCount: 15,
      maxCapacity: 30,
      status: 'active',
      schedule: 'Tue, Thu 11:00-12:30',
      credits: 4
    },
    {
      id: '5',
      name: 'Art History',
      code: 'ART201',
      description: 'Survey of art movements and styles',
      instructor: 'Dr. Lisa Brown',
      studentCount: 0,
      maxCapacity: 25,
      status: 'inactive',
      schedule: 'Wed, Fri 13:00-14:30',
      credits: 2
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAdviceBox, setShowAdviceBox] = useState(false);

  useEffect(() => {
    userFlowTracker.startPageTracking('Course Selection Page', '/course-selection');
    
    return () => {
      userFlowTracker.endPageTracking();
    };
  }, []);

  const handleCourseClick = (course: Course) => {
    userFlowTracker.trackInteraction('course_clicked', {
      courseId: course.id,
      courseName: course.name,
      courseStatus: course.status,
      studentCount: course.studentCount
    });
  };

  const handleEditCourse = (course: Course) => {
    userFlowTracker.trackInteraction('course_edit_started', {
      courseId: course.id,
      courseName: course.name
    });
    // Edit functionality would go here
    alert(`Editing course: ${course.name}`);
  };

  const handleDeleteCourse = (course: Course) => {
    userFlowTracker.trackInteraction('course_deleted', {
      courseId: course.id,
      courseName: course.name,
      studentCount: course.studentCount
    });
    
    setCourses(courses.filter(c => c.id !== course.id));
  };

  const handleFilterChange = (newFilter: string) => {
    userFlowTracker.trackInteraction('course_filter_changed', {
      previousFilter: filter,
      newFilter
    });
    setFilter(newFilter);
  };

  const handleAddCourse = () => {
    userFlowTracker.trackInteraction('add_course_clicked', {});
    alert('Add new course functionality would open here');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'full':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.status === 'active').length,
    full: courses.filter(c => c.status === 'full').length,
    inactive: courses.filter(c => c.status === 'inactive').length,
    totalStudents: courses.reduce((sum, c) => sum + c.studentCount, 0)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Manage courses, enrollment, and scheduling</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full</p>
                <p className="text-2xl font-bold text-red-600">{stats.full}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Search */}
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  <option value="active">Active</option>
                  <option value="full">Full</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Add Course Button */}
            <button
              onClick={handleAddCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-mono">{course.code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{course.instructor}</span>
                </div>

                {/* Enrollment */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Enrollment</span>
                    <span className={`font-medium ${getCapacityColor(course.studentCount, course.maxCapacity)}`}>
                      {course.studentCount}/{course.maxCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        course.studentCount >= course.maxCapacity 
                          ? 'bg-red-500' 
                          : course.studentCount >= course.maxCapacity * 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((course.studentCount / course.maxCapacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Schedule & Credits */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Schedule:</span>
                    <span className="text-gray-900">{course.schedule}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Credits:</span>
                    <span className="text-gray-900">{course.credits}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCourse(course);
                    }}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course);
                    }}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filter !== 'all' 
                ? "No courses match your current filters."
                : "You don't have any courses yet. Add one to get started!"
              }
            </p>
            <button
              onClick={handleAddCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Course
            </button>
          </div>
        )}
      </div>

      {/* Floating AI Advice Button */}
      <button
        onClick={() => setShowAdviceBox(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
        title="Get AI Advice"
      >
        <BookOpen className="w-6 h-6" />
      </button>

      {/* ChatGPT Advice Modal */}
      {showAdviceBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <ChatGPTAdviceBox
              dashboardType="Course Selection"
              onClose={() => setShowAdviceBox(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSelectionPage;