import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserDashboard } from './components/UserDashboard';
import AttendancePage from './components/AttendancePage';
import GradesPage from './components/GradesPage';
import AssignmentsPage from './components/AssignmentsPage';
import StudentsPage from './components/StudentsPage';
import AnalyticsPage from './components/AnalyticsPage';
import CurrentItemsPage from './components/CurrentItemsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/current-items" element={<CurrentItemsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;