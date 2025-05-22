import { useEffect } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TabList from "./components/TabList";
import FilterButtons from "./components/FilterButtons";
import useTasks from "./hooks/useTasks";
import useTabs from "./hooks/useTabs";
import useFilters from "./hooks/useFilters";
import Footer from "./components/Footer";

function App() {
  const { tasks, loading: tasksLoading, error: tasksError, fetchTasks, addTask, toggleComplete, deleteTask, clearCompleted } = useTasks();
  const { tabs, activeTab, loading: tabsLoading, error: tabsError, setActiveTab, addTab } = useTabs();
  const { filter, loading: filterLoading, error: filterError, setFilter, filterTasks } = useFilters();

  useEffect(() => {
    if (activeTab) {
      fetchTasks(activeTab);
    }
  }, [activeTab, fetchTasks]);

  if (tasksLoading || tabsLoading || filterLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (tasksError || tabsError || filterError) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">
      Error: {tasksError || tabsError || filterError}
    </div>;
  }

  return (
    <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto py-2 w-full">
        <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
          <Header />
          <TaskForm onAddTask={(text) => addTask(text, activeTab)} />
          <TabList
            tabs={tabs}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            onAddTab={addTab}
          />
          <TaskList
            tasks={filterTasks(tasks[activeTab] || [])}
            onToggleComplete={(id) => toggleComplete(id, activeTab)}
            onDeleteTask={(id) => deleteTask(id, activeTab)}
          />
          <FilterButtons
            filter={filter}
            onChangeFilter={setFilter}
            onClearCompleted={() => clearCompleted(activeTab)}
          />
          <Footer/> 
        </div>
      </div>
    </div>
  );
}

export default App;