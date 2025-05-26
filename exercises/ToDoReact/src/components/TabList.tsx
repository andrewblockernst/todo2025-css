import React, { useState } from "react";
import TabItem from "./TabItem";
import { useClientStore } from "../store/clientStore";
import { useAddTab } from "../hooks/useTabs";

interface TabListProps {
  tabs: string[];
}

const TabList: React.FC<TabListProps> = ({ tabs }) => {
  const { activeTab, setActiveTab, isAddingTab, setIsAddingTab } =
    useClientStore();
  const [newTabName, setNewTabName] = useState("");
  const addTabMutation = useAddTab();

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTabName.trim()) {
      addTabMutation.mutate(newTabName.trim(), {
        onSuccess: () => {
          setNewTabName("");
          setIsAddingTab(false);
        },
      });
    }
  };

  const handleCancelAdd = () => {
    setNewTabName("");
    setIsAddingTab(false);
  };

  return (
    <div className="border-t-2 border-b-2 border-amber-700 p-2">
      <div className="flex overflow-x-auto items-center gap-2">
        {/* Lista de pestañas existentes */}
        <ul className="flex space-x-1">
          {tabs.map((tab) => (
            <TabItem
              key={tab}
              name={tab}
              isActive={activeTab === tab}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab);
              }}
            />
          ))}
        </ul>

        {isAddingTab ? (
          <form onSubmit={handleAddTab} className="flex items-center gap-2">
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Tab name..."
              className="bg-amber-100 px-2 py-1 text-sm rounded focus:outline-none focus:ring focus:ring-amber-500"
              autoFocus
              disabled={addTabMutation.isPending}
            />
            <button
              type="submit"
              disabled={addTabMutation.isPending || !newTabName.trim()}
              className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 text-sm rounded"
            >
              {addTabMutation.isPending ? "..." : "✓"}
            </button>
            <button
              type="button"
              onClick={handleCancelAdd}
              className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 text-sm rounded"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsAddingTab(true);
            }}
            className="hover:bg-amber-800 text-slate-100 font-bold px-3 py-1 rounded text-sm border border-amber-200 whitespace-nowrap"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default TabList;
