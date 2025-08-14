import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader } from './DashboardHeader';
import { Search, Edit3, Trash2, Plus, X, Save, Eye, BarChart3, ExternalLink, Users, BookOpen, FileText, UserPlus } from 'lucide-react';

export function UserDashboard() {
  const navigate = useNavigate();
  
  const {
    occupations,
    selectedOccupation,
    mode,
    searchQuery,
    showDropdown,
    editingItem,
    editForm,
    showAddForm,
    addForm,
    currentOccupation,
    filteredOccupations,
    setSearchQuery,
    setShowDropdown,
    setEditForm,
    setAddForm,
    handleSelectOccupation,
    toggleMode,
    handleEditItem,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteItem,
    handleAddItem,
    handleItemClick,
    setShowAddForm
  } = useDashboard();

  // Handle item click with internal navigation
  const handleItemClickWithNavigation = (item: any) => {
    if (item.link === '/attendance') {
      navigate('/attendance');
    } else if (item.link === '/grades') {
      navigate('/grades');
    } else if (item.link === '/assignments') {
      navigate('/assignments');
    } else if (item.link === '/students') {
      navigate('/students');
    } else if (item.link === '/analytics') {
      navigate('/analytics');
    } else if (item.link === '/current-items') {
      navigate('/current-items');
    } else if (item.link && item.link.startsWith('http')) {
      // External link - use the original handler
      handleItemClick(item);
    } else if (item.link) {
      // Internal link - could be expanded for other internal pages
      console.log('Internal navigation to:', item.link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <DashboardHeader
        currentOccupation={currentOccupation}
        mode={mode}
        onToggleMode={toggleMode}
        onShowAddForm={() => setShowAddForm(true)}
      />



      {/* Occupation Selector */}
      <div className="max-w-7xl mx-auto px-8 mb-8">
        <div className="relative">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search occupations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {currentOccupation.name}
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredOccupations.map((occupation) => (
                <button
                  key={occupation.id}
                  onClick={() => handleSelectOccupation(occupation.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <div className={`w-8 h-8 rounded-lg bg-${occupation.color}-100 flex items-center justify-center`}>
                    {occupation.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{occupation.name}</div>
                    <div className="text-sm text-gray-500">{occupation.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentOccupation.features.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-${item.color}-500 ${
                item.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              {editingItem === item.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Title"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Description"
                    rows={3}
                  />
                  <input
                    type="text"
                    value={editForm.metric}
                    onChange={(e) => setEditForm({ ...editForm, metric: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Metric"
                  />
                  <input
                    type="text"
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Link (optional)"
                  />
                </div>
              ) : (
                // Display Mode
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    {mode === 'edit' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">{item.metric}</div>
                    {item.status === 'completed' && (
                      <div className="flex items-center text-green-600 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center">
                    {item.link && (
                      <button
                        onClick={() => handleItemClickWithNavigation(item)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Item Form */}
        {showAddForm && mode === 'edit' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Item</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Title"
                />
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Description"
                  rows={3}
                />
                <input
                  type="text"
                  value={addForm.metric}
                  onChange={(e) => setAddForm({ ...addForm, metric: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Metric"
                />
                <input
                  type="text"
                  value={addForm.link}
                  onChange={(e) => setAddForm({ ...addForm, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Link (optional)"
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
