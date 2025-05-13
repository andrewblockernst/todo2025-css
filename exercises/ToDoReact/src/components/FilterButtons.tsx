import React from 'react';

interface FilterButtonsProps {
  filter: string;
  onChangeFilter: (filter: 'all' | 'active' | 'completed') => void;
  onClearCompleted: () => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ filter, onChangeFilter, onClearCompleted }) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onChangeFilter('all');
                }}
                className={`px-3 py-1 rounded border border-amber-200 transition-colors ${
                    filter === 'all'
                        ? 'bg-amber-200 text-guinness'
                        : 'bg-medium-wood text-slate-100 hover:bg-amber-800'
                }`}
                data-filter="all"
            >
                All
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onChangeFilter('active');
                }}
                className={`px-3 py-1 rounded border border-amber-200 transition-colors ${
                    filter === 'active'
                        ? 'bg-amber-200 text-guinness'
                        : 'bg-medium-wood text-slate-100 hover:bg-amber-800'
                }`}
                data-filter="active"
            >
                Pending
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onChangeFilter('completed');
                }}
                className={`px-3 py-1 rounded border border-amber-200 transition-colors ${
                    filter === 'completed'
                        ? 'bg-amber-200 text-guinness'
                        : 'bg-medium-wood text-slate-100 hover:bg-amber-800'
                }`}
                data-filter="completed"
            >
                Completed
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onClearCompleted();
                }}
                className="px-3 py-1 rounded border hover:bg-amber-800 border-amber-200 bg-dark-red hover:bg-red-head text-slate-100 hover:text-guinness transition-colors"
            >
                Clear Completed
            </button>
        </div>
    );
};

export default FilterButtons;