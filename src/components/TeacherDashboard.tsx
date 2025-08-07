import React from 'react';
import { 
  Bell, Settings, LogOut, Search, ChevronDown,
  Save, X, Briefcase
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader } from './DashboardHeader';
import { EditForm } from '../types/dashboard';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const {
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

  const handleFormChange = (
    form: EditForm,
    setForm: React.Dispatch<React.SetStateAction<EditForm>>,
    field: keyof EditForm,
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = (form: EditForm) => {
    return form.title.trim() && form.description.trim() && form.metric.trim();
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fefffe 0%, #f8f9fa 100%)' }}>
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50 smooth-transition">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 nature-gradient rounded-full flex items-center justify-center mr-6 organic-shape">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold nature-heading">Career Exploration Platform</h1>
                <p className="text-sm nature-subtext font-medium">Professional Development Workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button className="p-3 text-green-600 hover:text-green-800 smooth-transition rounded-full hover:bg-green-50">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-3 text-green-600 hover:text-green-800 smooth-transition rounded-full hover:bg-green-50">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center px-6 py-3 text-green-700 hover:bg-green-50 organic-button bg-white border border-green-200 smooth-transition"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {/* Autocomplete Occupation Selector */}
          <div className="nature-card bg-white/90 p-8 organic-shape ivy-accent">
            <h2 className="text-2xl font-bold nature-heading mb-6">Select Your Career Path</h2>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-green-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 150);
                  }}
                  className="w-full pl-12 pr-12 p-5 text-lg font-medium bg-green-50/50 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition"
                  placeholder={`${currentOccupation.name} – ${currentOccupation.role}`}
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-green-500 pointer-events-none" />
              </div>
              
              {showDropdown && filteredOccupations.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-green-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto"
                     onMouseDown={(e) => e.preventDefault()}>
                  {filteredOccupations.map((occupation) => (
                    <button
                      key={occupation.id}
                      onClick={() => handleSelectOccupation(occupation.id)}
                      className={`w-full px-6 py-4 text-left hover:bg-green-50 flex items-center space-x-4 border-b border-green-100 last:border-b-0 smooth-transition first:rounded-t-2xl last:rounded-b-2xl ${
                        occupation.id === currentOccupation.id ? 'bg-green-100 border-l-4 border-l-green-500' : ''
                      }`}
                    >
                      <div className="p-3 rounded-xl soft-gradient">
                        {occupation.icon}
                      </div>
                      <div>
                        <div className="font-semibold nature-heading">
                          {occupation.name} – {occupation.role}
                        </div>
                        <div className="text-sm nature-subtext">{occupation.title}</div>
                      </div>
                      {occupation.id === currentOccupation.id && (
                        <div className="ml-auto">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Current Selection Display */}
              <div className="mt-4 p-4 bg-green-50/50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg soft-gradient">
                    {currentOccupation.icon}
                  </div>
                  <div>
                    <div className="font-semibold nature-heading">
                      Currently Selected: {currentOccupation.name} – {currentOccupation.role}
                    </div>
                    <div className="text-sm nature-subtext">{currentOccupation.title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Dashboard */}
          <div className="nature-card bg-white/90 overflow-hidden organic-shape">
            {/* Dashboard Header */}
            <DashboardHeader
              currentOccupation={currentOccupation}
              mode={mode}
              onToggleMode={toggleMode}
              onShowAddForm={() => setShowAddForm(true)}
            />

            {/* Add New Item Form */}
            {showAddForm && mode === 'edit' && (
              <div className="p-8 soft-gradient border-b border-green-100">
                <h4 className="text-xl font-semibold nature-heading mb-6">Add New Dashboard Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <input
                    type="text"
                    placeholder="Title"
                    value={addForm.title}
                    onChange={(e) => handleFormChange(addForm, setAddForm, 'title', e.target.value)}
                    className="p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition bg-white/80"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={addForm.description}
                    onChange={(e) => handleFormChange(addForm, setAddForm, 'description', e.target.value)}
                    className="p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition bg-white/80"
                  />
                  <input
                    type="text"
                    placeholder="Metric"
                    value={addForm.metric}
                    onChange={(e) => handleFormChange(addForm, setAddForm, 'metric', e.target.value)}
                    className="p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition bg-white/80"
                  />
                  <input
                    type="url"
                    placeholder="Link (optional)"
                    value={addForm.link}
                    onChange={(e) => handleFormChange(addForm, setAddForm, 'link', e.target.value)}
                    className="p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition bg-white/80"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleAddItem}
                    disabled={!isFormValid(addForm)}
                    className="flex items-center organic-button nature-gradient text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setAddForm({ title: '', description: '', metric: '', link: '' });
                    }}
                    className="flex items-center organic-button bg-gray-500 text-white hover:bg-gray-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Dashboard Content */}
            <div className="p-8" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentOccupation.features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`nature-card bg-white/95 p-8 smooth-transition ${
                      feature.status === 'completed' 
                        ? 'status-completed' 
                        : feature.status === 'pending' && feature.link
                        ? 'status-pending'
                        : 'border-l-4 border-green-200'
                    }`}
                  >
                    {editingItem === feature.id && mode === 'edit' ? (
                      <div className="space-y-5">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => handleFormChange(editForm, setEditForm, 'title', e.target.value)}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition"
                          placeholder="Title"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => handleFormChange(editForm, setEditForm, 'description', e.target.value)}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 resize-none smooth-transition"
                          rows={3}
                          placeholder="Description"
                        />
                        <input
                          type="text"
                          value={editForm.metric}
                          onChange={(e) => handleFormChange(editForm, setEditForm, 'metric', e.target.value)}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition"
                          placeholder="Metric"
                        />
                        <input
                          type="url"
                          value={editForm.link}
                          onChange={(e) => handleFormChange(editForm, setEditForm, 'link', e.target.value)}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 smooth-transition"
                          placeholder="Link (optional)"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveEdit}
                            disabled={!isFormValid(editForm)}
                            className="flex items-center px-4 py-2 nature-gradient text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm smooth-transition"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 text-sm smooth-transition"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            {feature.icon}
                            <button
                              onClick={() => handleItemClick(feature)}
                              className={`text-xl font-bold ml-4 text-left smooth-transition ${
                                mode === 'preview' && feature.link
                                  ? feature.status === 'completed'
                                    ? 'text-green-700 hover:text-green-900 cursor-pointer underline decoration-2 underline-offset-2'
                                    : 'text-orange-700 hover:text-orange-900 cursor-pointer underline decoration-2 underline-offset-2'
                                  : 'nature-heading'
                              }`}
                            >
                              {feature.title}
                              {mode === 'preview' && feature.link && (
                                <span className="ml-3 text-lg">
                                  {feature.status === 'completed' ? '✓' : '!'}
                                </span>
                              )}
                            </button>
                          </div>
                          {mode === 'edit' && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleEditItem(feature)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 smooth-transition text-sm font-medium shadow-md hover:shadow-lg"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(feature.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 smooth-transition text-sm font-medium shadow-md hover:shadow-lg"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="nature-subtext mb-6 leading-relaxed">{feature.description}</p>
                        <div className="soft-gradient p-4 rounded-xl">
                          <div className="text-sm text-green-800 font-semibold">
                            {feature.metric}
                          </div>
                        </div>
                        {mode === 'preview' && feature.link && (
                          <div className={`mt-4 text-sm font-medium ${
                            feature.status === 'completed' 
                              ? 'text-green-700' 
                              : 'text-orange-700'
                          }`}>
                            {feature.status === 'completed' 
                              ? '✓ Completed - Click to reopen' 
                              : '! Action needed - Click title to complete'
                            }
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}