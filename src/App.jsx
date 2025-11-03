import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Edit2,
  Plus,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [editDateTime, setEditDateTime] = useState({ date: "", time: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await window.storage.get("todo-tasks");
      if (result?.value) {
        setTasks(JSON.parse(result.value));
      }
    } catch (error) {
      console.log("No existing tasks found");
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await window.storage.set("todo-tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  };

  const addTask = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        date: dateTime.date,
        time: dateTime.time,
        createdAt: new Date().toISOString(),
      };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveTasks(newTasks);
      setInputValue("");
      setDateTime({ date: "", time: "" });
    }
  };

  const toggleComplete = (id) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
    setEditDateTime({ date: task.date || "", time: task.time || "" });
  };

  const saveEdit = () => {
    const newTasks = tasks.map((task) =>
      task.id === editingId
        ? {
            ...task,
            text: editValue,
            date: editDateTime.date,
            time: editDateTime.time,
          }
        : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
    setEditingId(null);
    setEditValue("");
    setEditDateTime({ date: "", time: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditDateTime({ date: "", time: "" });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-1 sm:mb-2">
            My Tasks
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Organize your day, one task at a time
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600">
              {stats.total}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">
              {stats.active}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Done</div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none text-base sm:text-lg"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg sm:rounded-xl flex-1">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  value={dateTime.date}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, date: e.target.value })
                  }
                  className="flex-1 focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg sm:rounded-xl flex-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="time"
                  value={dateTime.time}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, time: e.target.value })
                  }
                  className="flex-1 focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>
            <button
              onClick={addTask}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Task
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-2 sm:space-y-3 pb-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-8 sm:p-12 text-center">
              <div className="text-gray-400 text-base sm:text-lg">
                {filter === "completed"
                  ? "No completed tasks yet"
                  : "No tasks yet. Add one above!"}
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                {editingId === task.id ? (
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-indigo-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none text-base sm:text-lg"
                      autoFocus
                    />
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg sm:rounded-xl flex-1">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="date"
                          value={editDateTime.date}
                          onChange={(e) =>
                            setEditDateTime({
                              ...editDateTime,
                              date: e.target.value,
                            })
                          }
                          className="flex-1 focus:outline-none text-sm sm:text-base"
                        />
                      </div>
                      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg sm:rounded-xl flex-1">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="time"
                          value={editDateTime.time}
                          onChange={(e) =>
                            setEditDateTime({
                              ...editDateTime,
                              time: e.target.value,
                            })
                          }
                          className="flex-1 focus:outline-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg sm:rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg sm:rounded-xl font-medium hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95 pt-1 sm:pt-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400 hover:text-indigo-600" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-base sm:text-lg break-words ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {task.text}
                      </div>
                      {(task.date || task.time) && (
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                          {task.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              {new Date(task.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          )}
                          {task.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              {task.time}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 active:scale-95"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
