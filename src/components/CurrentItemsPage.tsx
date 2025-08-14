import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, SortAsc, CheckCircle, Clock, AlertCircle, Star, ArrowLeft } from 'lucide-react';
import userActionTracker from '../services/userActionTracker';
import ChatGPTAdviceBox from './ChatGPTAdviceBox';

interface CurrentItem {
  id: string;
  title: string;
  type: 'task' | 'assignment' | 'project' | 'meeting';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  dueDate: string;
  description: string;
}

const CurrentItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CurrentItem[]>([
    {
      id: '1',
      title: 'Grade Math Assignments',
      type: 'task',
      status: 'pending',
      priority: 'high',
      progress: 0,
      dueDate: '2024-01-15',
      description: 'Grade 30 math assignments for Class 10A'
    },
    {
      id: '2',
      title: 'Prepare Science Lesson Plan',
      type: 'assignment',
      status: 'in-progress',
      priority: 'medium',
      progress: 65,
      dueDate: '2024-01-18',
      description: 'Create lesson plan for Chapter 5: Chemical Reactions'
    },
    {
      id: '3',
      title: 'Parent-Teacher Meeting',
      type: 'meeting',
      status: 'pending',
      priority: 'high',
      progress: 0,
      dueDate: '2024-01-20',
      description: 'Quarterly parent-teacher conference'
    },
    {
      id: '4',
      title: 'Update Student Records',
      type: 'task',
      status: 'completed',
      priority: 'low',
      progress: 100,
      dueDate: '2024-01-12',
      description: 'Update attendance and grade records'
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [showAdviceBox, setShowAdviceBox] = useState(false);

  useEffect(() => {
    userActionTracker.start();
    // Track page start time for accurate duration calculation
    sessionStorage.setItem('current_items_page_start', Date.now().toString());
    
    return () => {
      userActionTracker.stop();
    };
  }, []);

  const handleItemClick = (item: CurrentItem) => {
    // Track interaction with userActionTracker
    console.log('Item clicked:', item.title);
  };

  const handleStatusChange = (itemId: string, newStatus: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Track interaction with userActionTracker
      console.log('Status changed:', item.title, 'from', item.status, 'to', newStatus);

      setItems(items.map(i => 
        i.id === itemId 
          ? { ...i, status: newStatus as CurrentItem['status'], progress: newStatus === 'completed' ? 100 : i.progress }
          : i
      ));
    }
  };

  const handleFilterChange = (newFilter: string) => {
    // Track interaction with userActionTracker
    console.log('Filter changed to:', newFilter);
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: string) => {
    // Track interaction with userActionTracker
    console.log('Sort changed to:', newSort);
    setSortBy(newSort);
  };

  const handleAddItem = () => {
    // Track interaction with userActionTracker
    console.log('Add item clicked');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'progress':
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => {
                const actionSummary = userActionTracker.getActionSummary();
                const currentTime = Date.now();
                const pageStartTime = parseInt(sessionStorage.getItem('current_items_page_start') || '0');
                const pageDuration = pageStartTime > 0 ? currentTime - pageStartTime : 0;
                
                let trackingInfo = `* *Time on page* — total time spent: ${Math.round(pageDuration / 1000)} seconds

* *Scrolling* — scroll depth: ${actionSummary.scrollData.maxDepth || 0}%

* *Clicks* — any button, link, image, or element clicked (element type, ID/class, text, coordinates): ${actionSummary.actionTypes.click || 0} clicks tracked

* *Hovers* — mouse over important elements (element type, ID/class, duration): ${actionSummary.actionTypes.hover || 0} hovers tracked

* *Form usage* — field focus, changes, submissions: ${actionSummary.actionTypes.form || 0} form interactions

* *Media actions* — video/audio play, pause, seek, fullscreen, volume change: ${actionSummary.actionTypes.media || 0} media actions

* *Image actions* — view, zoom, expand, download: ${actionSummary.actionTypes.image || 0} image actions`;
                
                alert(trackingInfo);
                navigate('/');
              }}
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Items</h1>
          <p className="text-gray-600">Manage your tasks, assignments, and upcoming activities</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="progress">Progress</option>
                </select>
              </div>
            </div>

            {/* Add Item Button */}
            <button
              onClick={handleAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {item.type}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                  <select
                    value={item.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(item.id, e.target.value);
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You don't have any current items. Add one to get started!"
                : `No items match the "${filter}" filter.`
              }
            </p>
            <button
              onClick={handleAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Item
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
        <Star className="w-6 h-6" />
      </button>

      {/* ChatGPT Advice Modal */}
      {showAdviceBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <ChatGPTAdviceBox
              dashboardType="Current Items"
              onClose={() => setShowAdviceBox(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentItemsPage;