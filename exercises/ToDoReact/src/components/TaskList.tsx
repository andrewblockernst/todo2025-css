import React from "react";
import TaskItem from "./TaskItem";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import Pagination from "./Pagination";
import { useTasks } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";

const TaskList: React.FC = () => {
  const { currentPage, setCurrentPage } = useClientStore();
  const { data, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-amber-200 bg-amber-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  if (!data || data.tasks.length === 0) {
    return (
      <div className="p-10 text-center text-amber-200 bg-amber-950">
        No tasks available yet :P
      </div>
    );
  }

  return (
    <div className="bg-amber-950">
      {/* Task List */}
      <ul className="space-y-2 p-4">
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TaskList;
