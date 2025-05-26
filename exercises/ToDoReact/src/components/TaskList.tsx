import React, { useRef, useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { useTasks } from "../hooks/useTasks";
import { ChevronsDown } from "lucide-react";

const TaskList: React.FC = () => {
  const { data, isLoading, error } = useTasks();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScrollable = () => {
      if (listRef.current && containerRef.current) {
        const listHeight = listRef.current.scrollHeight;
        const containerHeight = containerRef.current.clientHeight;
        const scrollTop = containerRef.current.scrollTop;

        const hasHiddenContent =
          listHeight > containerHeight &&
          scrollTop < listHeight - containerHeight - 20;

        setShowScrollButton(hasHiddenContent);
      }
    };

    if (data?.tasks) {
      setTimeout(checkScrollable, 100);
    }

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollable);
      return () => container.removeEventListener("scroll", checkScrollable);
    }
  }, [data?.tasks]);

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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
    //TASK LIST CONTAINER WITH SCROLL
    <div className="bg-amber-950 relative">
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-64 relative"
        style={{ scrollBehavior: "smooth" }}
      >
        <ul ref={listRef} className="space-y-2 mb-6">
          {data.tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      </div>

      {/*BUTTON MORE TASKS*/}
      {showScrollButton && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-950 via-amber-950/90 to-transparent pt-8 pb-4">
          <div className="flex justify-center">
            <button
              onClick={handleScrollToBottom}
              className="bg-amber-700 hover:bg-amber-600 text-white px-2 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 border border-amber-500"
            >
              <ChevronsDown />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
