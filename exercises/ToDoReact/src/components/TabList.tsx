import React, { useState } from 'react';
import TabItem from './TabItem';

interface TabListProps {
  tabs: string[];
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onAddTab: (name: string) => void;
}

const TabList: React.FC<TabListProps> = ({ tabs, activeTab, onChangeTab, onAddTab }) => {
  const [newTabName, setNewTabName] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault(); // Evita la recarga de página
    
    if (newTabName.trim()) {
      onAddTab(newTabName);
      setNewTabName('');
      setIsAddingTab(false);
    }
  };

  return (
    <div className="bg-medium-wood border-t-2 border-b-2 border-amber-700 p-2">
      <div className="flex overflow-x-auto items-center">
        <ul className="flex space-x-1">
          {tabs.map(tab => (
            <TabItem
              key={tab}
              name={tab}
              isActive={activeTab === tab}
              onClick={(e) => {
                e.preventDefault();
                onChangeTab(tab);
              }}
            />
          ))}
        </ul>
        
        {isAddingTab ? (
          <form onSubmit={handleAddTab} className="flex ml-2">
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Tab name..."
              className="w-32 px-2 py-1 text-sm rounded-l-md focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 text-sm rounded-r-md"
            >
              ✓
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsAddingTab(true);
            }}
            className="bg-dark-wood hover:bg-amber-800 text-slate-100 font-bold px-3 py-1 mx-2 rounded text-sm border border-amber-200"
          >
            + New List
          </button>
        )}
      </div>
    </div>
  );
};

export default TabList;