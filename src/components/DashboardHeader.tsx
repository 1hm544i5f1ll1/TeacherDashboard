import React from 'react';
import { Eye, Edit, Plus } from 'lucide-react';
import { DashboardMode, Occupation } from '../types/dashboard';

interface DashboardHeaderProps {
  currentOccupation: Occupation;
  mode: DashboardMode;
  onToggleMode: () => void;
  onShowAddForm: () => void;
}

export function DashboardHeader({ 
  currentOccupation, 
  mode, 
  onToggleMode, 
  onShowAddForm 
}: DashboardHeaderProps) {
  return (
    <div className="p-8 nature-gradient text-white relative overflow-hidden">
      {/* Organic background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl">🌿</div>
        <div className="absolute bottom-4 left-4 text-4xl">🍃</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">🌱</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-6 organic-shape">
            {currentOccupation.icon}
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">{currentOccupation.title}</h3>
            <p className="text-green-100 font-medium">
              {currentOccupation.name} - Professional Development & Career Growth
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onToggleMode}
            className="bg-white/90 backdrop-blur-sm text-green-800 hover:bg-white organic-button flex items-center space-x-3 font-semibold"
          >
            {mode === 'preview' ? (
              <>
                <Edit className="h-5 w-5" />
                <span>Edit Mode</span>
              </>
            ) : (
              <>
                <Eye className="h-5 w-5" />
                <span>Preview Mode</span>
              </>
            )}
          </button>
          {mode === 'edit' && (
            <button
              onClick={onShowAddForm}
              className="bg-white/90 backdrop-blur-sm text-green-800 hover:bg-white organic-button flex items-center space-x-3 font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Item</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}