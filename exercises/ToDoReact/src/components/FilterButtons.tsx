import React, { useRef } from "react";
import { useClientStore } from "../store/clientStore";
import { useClearCompleted } from "../hooks/useTasks";

const FilterButtons: React.FC = () => {
  const { filter, setFilter, activeTab } = useClientStore();
  const clearCompletedMutation = useClearCompleted();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleConfirm = () => {
    clearCompletedMutation.mutate(activeTab);
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
  };

  //CLOSE DIALOG CLICKING OUTSIDE
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  };

  //CLOSE DIALOG WITH ESCAPE 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      dialogRef.current?.close();
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      <button
        onClick={() => setFilter("all")}
        className={`px-3 py-1 rounded border border-amber-200 transition-colors ${
          filter === "all"
            ? "bg-amber-200 text-amber-900"
            : "bg-medium-wood text-slate-100 hover:bg-amber-800"
        }`}
      >
        All
      </button>

      <button
        onClick={() => setFilter("active")}
        className={`px-3 py-1 rounded border border-amber-200 transition-colors ${
          filter === "active"
            ? "bg-amber-200 text-amber-900"
            : "bg-medium-wood text-slate-100 hover:bg-amber-800"
        }`}
      >
        Pending
      </button>

      <button
        onClick={() => setFilter("completed")}
        className={`px-3 py-1 rounded border border-amber-200 transition-colors ${
          filter === "completed"
            ? "bg-amber-200 text-amber-900"
            : "bg-medium-wood text-slate-100 hover:bg-amber-800"
        }`}
      >
        Completed
      </button>

      <button
        onClick={openDialog}
        disabled={clearCompletedMutation.isPending}
        className="px-3 py-1 rounded border border-amber-200 bg-red-700 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
      >
        {clearCompletedMutation.isPending ? "Clearing..." : "Clear Completed"}
      </button>

      {/*DIALOG POP TO CLEAR THE COMPLETED TASKS*/}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onKeyDown={handleKeyDown}
        className="irish-pub-dialog backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="bg-orange-950 border-4 border-amber-300 rounded-lg p-6 max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-amber-100 mb-3">
              You sure you want to clear all completed tasks?
            </p>
            <div className="bg-amber-900/50 p-4 rounded border border-amber-600">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">📋</span>
                <p className="text-amber-200 font-bold">Tab: "{activeTab}"</p>
              </div>
              <p className="text-amber-300 text-sm">
                The completed tasks will be removed from the list.
              </p>
            </div>
            <p className="text-amber-300 text-sm mt-3">
              This action cannot be undone. Are you sure?
            </p>
          </div>

          {/*BUTTONS*/}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-700 border-2 border-amber-400 text-amber-100 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={clearCompletedMutation.isPending}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 border-2 border-red-400 text-red-100 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {clearCompletedMutation.isPending
                ? "Cleaning..."
                : "Clear Completed"}
            </button>
          </div>

          {/*FOOTER*/}
          <div className="mt-4 text-center">
            <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full opacity-60"></div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default FilterButtons;
