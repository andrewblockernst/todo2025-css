import React from 'react';

interface TabItemProps {
  name: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const TabItem: React.FC<TabItemProps> = ({ name, isActive, onClick }) => {
  return (
    <li className="inline-block">
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 capitalize rounded-t ${
          isActive
            ? 'bg-dark-wood text-amber-200 font-medium'
            : 'bg-medium-wood text-slate-100 hover:bg-amber-800'
        }`}
      >
        {name}
      </button>
    </li>
  );
};

export default TabItem;