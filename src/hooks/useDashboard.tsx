import { useState } from 'react';
import { Occupation, DashboardItem, EditForm, DashboardMode } from '../types/dashboard';
import { getInitialOccupations } from '../data/occupations';

export function useDashboard() {
  const [occupations, setOccupations] = useState<Occupation[]>(getInitialOccupations());
  const [selectedOccupation, setSelectedOccupation] = useState('teacher');
  const [mode, setMode] = useState<DashboardMode>('preview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: '',
    description: '',
    metric: '',
    link: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>({
    title: '',
    description: '',
    metric: '',
    link: ''
  });

  const currentOccupation = occupations.find(occ => occ.id === selectedOccupation) || occupations[0];
  const filteredOccupations = occupations.filter(occ =>
    occ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    occ.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOccupation = (occupationId: string) => {
    setSelectedOccupation(occupationId);
    setSearchQuery('');
    setShowDropdown(false);
    setMode('preview');
    resetForms();
  };

  const toggleMode = () => {
    setMode(prev => prev === 'preview' ? 'edit' : 'preview');
    resetForms();
  };

  const resetForms = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setEditForm({ title: '', description: '', metric: '', link: '' });
    setAddForm({ title: '', description: '', metric: '', link: '' });
  };

  const handleEditItem = (item: DashboardItem) => {
    setEditingItem(item.id);
    setEditForm({
      title: item.title,
      description: item.description,
      metric: item.metric,
      link: item.link || ''
    });
  };

  const handleSaveEdit = () => {
    setOccupations(prev => prev.map(occ => {
      if (occ.id === selectedOccupation) {
        return {
          ...occ,
          features: occ.features.map(feature => {
            if (feature.id === editingItem) {
              return {
                ...feature,
                title: editForm.title,
                description: editForm.description,
                metric: editForm.metric,
                link: editForm.link || undefined
              };
            }
            return feature;
          })
        };
      }
      return occ;
    }));
    setEditingItem(null);
    setEditForm({ title: '', description: '', metric: '', link: '' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({ title: '', description: '', metric: '', link: '' });
  };

  const handleDeleteItem = (itemId: string) => {
    setOccupations(prev => prev.map(occ => {
      if (occ.id === selectedOccupation) {
        return {
          ...occ,
          features: occ.features.filter(feature => feature.id !== itemId)
        };
      }
      return occ;
    }));
  };

  const handleAddItem = () => {
    const newItem: DashboardItem = {
      id: Date.now().toString(),
      icon: <div className={`h-8 w-8 bg-${currentOccupation.color}-600 rounded`}></div>,
      title: addForm.title,
      description: addForm.description,
      metric: addForm.metric,
      color: currentOccupation.color,
      link: addForm.link || undefined
    };

    setOccupations(prev => prev.map(occ => {
      if (occ.id === selectedOccupation) {
        return {
          ...occ,
          features: [...occ.features, newItem]
        };
      }
      return occ;
    }));

    setAddForm({ title: '', description: '', metric: '', link: '' });
    setShowAddForm(false);
  };

  const handleItemClick = (item: DashboardItem) => {
    if (mode === 'preview' && item.link) {
      // Mark item as completed when link is clicked
      setOccupations(prev => prev.map(occ => {
        if (occ.id === selectedOccupation) {
          return {
            ...occ,
            features: occ.features.map(feature => {
              if (feature.id === item.id) {
                return { ...feature, status: 'completed' as const };
              }
              return feature;
            })
          };
        }
        return occ;
      }));
      window.open(item.link, '_blank');
    }
  };

  return {
    // State
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
    
    // Actions
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
  };
}