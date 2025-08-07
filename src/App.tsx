import React from 'react';
import { TeacherDashboard } from './components/TeacherDashboard';

function App() {
  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherDashboard onLogout={handleLogout} />
    </div>
  );
}

export default App;