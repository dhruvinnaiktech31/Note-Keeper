import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { URL } from "./db.js";
import { useNavigate } from "react-router-dom";


export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTodo, setSelectedTodo] = useState(null); 
  const [editedDesc, setEditedDesc] = useState(""); 
  const navigate = useNavigate();

  // Fetch notes
  const showAllData = async () => {
    try {
      const { data } = await URL.get("/Todolist");
      setTodos(data?.Todolist || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    showAllData();
  }, []);

  // Filtering logic
  const filterTodos = (todo) => {
    const now = new Date();
    const todoDate = new Date(todo.createdAt);
    const diffDays = Math.floor((now - todoDate) / (1000 * 60 * 60 * 24));

    if (filter === "recent" && diffDays <= 1) return true;
    if (filter === "week" && diffDays > 1 && diffDays <= 7) return true;
    if (filter === "month" && diffDays > 7 && diffDays <= 30) return true;
    if (filter === "older" && diffDays > 30) return true;
    if (filter === "all") return true;
    return false;
  };

  const displayedTodos = todos.filter(
    (todo) =>
      (todo.Title.toLowerCase().includes(search.toLowerCase()) ||
        todo.Discription.toLowerCase().includes(search.toLowerCase())) &&
      filterTodos(todo)
  );

  // Save updated description
  const saveTodo = async () => {
    try {
      await URL.put("/todoupdate", {
        Id: selectedTodo._id,
        Title: selectedTodo.Title,
        Discription: editedDesc,
      });
      setSelectedTodo(null);
      showAllData();
    } catch (err) {
      console.error(err);
    }
  };
const deleteTodo = async (id) => {
    try {
      await URL.post("/tododelete", { Id: id });
      showAllData();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-teal-50 to-white">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mr-6 mb-8 text-center text-purple-700 drop-shadow">
        ✨ NOTE-KEEPER
      </h1>

      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/add-note")}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition"
        >
          <MdAdd size={20} />
        </button>

        {/* Search + Filter */}
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All</option>
            <option value="recent">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="older">Older</option>
          </select>
        </div>
      </div>

      {/* Todos List */}
      <div
        className="w-full max-w-5xl bg-white shadow-lg rounded-lg divide-y overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "495px" }}
      >
        {displayedTodos.length > 0 ? (
          displayedTodos.map((todo) => (
            <div
              key={todo._id}
              className="flex justify-between items-center p-3 hover:bg-purple-50 cursor-pointer transition"
              onClick={() => {
                setSelectedTodo(todo);
                setEditedDesc(todo.Discription);
              }}
            >
              {/* 1. Title & Description */}
              <div className="flex-1 min-w-[150px]">
                <h3 className="font-semibold text-teal-700">{todo.Title}</h3>
                <p
                  className="text-gray-600 text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: todo.Discription }}
                />
              </div>

              {/* 2. Date & Time */}
              <div className="text-sm text-gray-500 px-4 min-w-[160px] whitespace-nowrap">
                {new Date(todo.createdAt).toLocaleString()}
              </div>

              {/* 3. Edit & Delete icons */}
              <div
                className="flex gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <MdEdit
                  className="text-purple-600 cursor-pointer hover:scale-110 transition"
                  size={22} 
                     onClick={() => navigate(`/edit-note/${todo._id}`, { state: todo })}
                />
                <MdDelete
                  className="text-red-500 cursor-pointer hover:scale-110 transition"
                  size={22} onClick={() => deleteTodo(todo._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No todos found</p>
        )}
      </div>

      {/* Modal for full Todo */}
      {selectedTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full border-t-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-4 text-teal-700">
              {selectedTodo.Title}
            </h2>

            {/* Editable content */}
            <div
              contentEditable
              suppressContentEditableWarning={true}
              className="border p-3 rounded min-h-[100px] bg-purple-50 focus:outline-none"
              onInput={(e) => setEditedDesc(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: editedDesc }}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedTodo(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveTodo}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

          </>
  );
}
