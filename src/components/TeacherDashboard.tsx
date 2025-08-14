import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, BarChart3, MessageCircle, X } from 'lucide-react';
import { userFlowTracker } from '../services/userFlowTracker';
import AttendancePage from './AttendancePage';
import CourseSelectionPage from './CourseSelectionPage';
import CurrentItemsPage from './CurrentItemsPage';
import { AnalyticsPage } from './AnalyticsPage';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [showAdviceBox, setShowAdviceBox] = useState(false);

  useEffect(() => {
    // Start tracking the teacher dashboard
    userFlowTracker.startPageTracking('Teacher Dashboard', '/teacher-dashboard');
    
    return () => {
      userFlowTracker.endPageTracking();
    };
  }, []);

  const handleTabChange = (tab: string) => {
    userFlowTracker.trackInteraction('tab_changed', {
      previousTab: activeTab,
      newTab: tab
    });
    setActiveTab(tab);
  };

  const handleAdviceClick = () => {
    userFlowTracker.trackInteraction('advice_box_opened', {
      currentTab: activeTab
    });
    setShowAdviceBox(true);
  };

  const handleAdviceClose = () => {
    userFlowTracker.trackInteraction('advice_box_closed', {
      currentTab: activeTab
    });
    setShowAdviceBox(false);
  };

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'courses', label: 'Course Selection', icon: BookOpen },
    { id: 'current-items', label: 'Current Items', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendancePage />;
      case 'courses':
        return <CourseSelectionPage />;
      case 'current-items':
        return <CurrentItemsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <AttendancePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
            </div>
            <button
              onClick={onLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      {/* Floating AI Advice Button */}
      <button
        onClick={handleAdviceClick}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
        title="Get AI Advice"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* ChatGPT Advice Box */}
      {showAdviceBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">AI Teaching Assistant</h3>
              <button
                onClick={handleAdviceClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <ChatGPTAdviceBox 
                dashboardType="teacher"
                currentContext={activeTab}
                onClose={handleAdviceClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};