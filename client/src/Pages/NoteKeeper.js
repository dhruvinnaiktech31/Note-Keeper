import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { baseURL } from "./dbInstances.js";

export default function NoteKeeper() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ Title: "", Discription: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch notes
  const showAllData = async () => {
    try {
      const { data } = await baseURL.get("/Notelist");
      setNotes(data?.Notelist || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    showAllData();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Note
  const addNote = async (e) => {
    e.preventDefault();
    if (!form.Title || !form.Discription) return;

    try {
      if (editId) {
  await baseURL.put("/update", { Id: editId, ...form });
} else {
  await baseURL.post("/add", form);
}

      setForm({ Title: "", Discription: "" });
      setEditId(null);
      showAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await baseURL.post("/delete", { Id: id });
      showAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Note
  const editNote = (note) => {
    setForm({ Title:note.Title, Discription: note.Discription });
    setEditId(note._id);
  };

  // Filtering logic
  const filterNotes = (note) => {
    const now = new Date();
    const noteDate = new Date(note.createdAt);
    const diffDays = Math.floor((now - noteDate) / (1000 * 60 * 60 * 24));

    if (filter === "recent" && diffDays <= 1) return true;
    if (filter === "week" && diffDays > 1 && diffDays <= 7) return true;
    if (filter === "month" && diffDays > 7 && diffDays <= 30) return true;
    if (filter === "older" && diffDays > 30) return true;
    if (filter === "all") return true;
    return false;
  };

  const displayedNotes = notes.filter(
    (note) =>
      (note.Title.toLowerCase().includes(search.toLowerCase()) ||
       note.Discription.toLowerCase().includes(search.toLowerCase())) &&
      filterNotes(note)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mr-6 mb-8 text-center text-purple-700 drop-shadow">
        ✨ TO-DO LIST
      </h1>

      {/* Add/Edit Note Form */}
      <form onSubmit={addNote}>
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-purple-200">
          <input
            type="text"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <textarea
            name="Discription"
            value={form.Discription}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full p-3 mb-4 border rounded-lg resize-none focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full max-w-3xl bg-white p-4 shadow-lg rounded-2xl border border-blue-200 mt-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search todos..."
          className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="all">All</option>
          <option value="recent">Recent (Today)</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="older">Older than a Month</option>
        </select>
      </div>

      {/* Notes List */}
      <div
        className="w-full max-w-3xl bg-white shadow-lg rounded-2xl divide-y overflow-y-auto custom-scrollbar mt-6 border border-purple-200"
        style={{ maxHeight: "420px" }}
      >
        {displayedNotes.length > 0 ? (
          displayedNotes.map((note) => (
            <div
              key={note._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-purple-50 transition cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              {/* Title & Description */}
              <div className="flex-1 min-w-[150px] mb-2 sm:mb-0">
                <h3 className="font-bold text-purple-700">{note.Title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 break-words">
                  {note.Discription}
                </p>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-500 px-0 sm:px-4 min-w-[160px] whitespace-nowrap mb-2 sm:mb-0">
                {new Date(note.createdAt).toLocaleString()}
              </div>

              {/* Edit/Delete */}
              <div
                className="flex gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <MdEdit
                  className="text-green-600 cursor-pointer hover:scale-125 transition-transform"
                  size={22}
                  onClick={() => editNote(note)}
                />
                <MdDelete
                  className="text-red-600 cursor-pointer hover:scale-125 transition-transform"
                  size={22}
                  onClick={() => deleteNote(note._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="p-6 text-center text-gray-400">No notes found ✍️</p>
        )}
      </div>

      {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full animate-fadeIn">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              {selectedNote.Title}
            </h2>
            <p className="whitespace-pre-wrap text-gray-700">{selectedNote.Discription}</p>
            <p className="text-sm text-gray-500 mt-4">
              {new Date(selectedNote.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => setSelectedNote(null)}
              className="mt-6 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
