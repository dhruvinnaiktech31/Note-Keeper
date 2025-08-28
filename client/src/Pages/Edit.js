import React, { useState, useEffect } from "react";
import { URL } from "./db";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function EditNote() {
  const { id } = useParams();
  const location = useLocation();
  const [form, setForm] = useState({ Title: "", Discription: "" });
  const navigate = useNavigate();


  useEffect(() => {
    if (location.state) {
      // use the passed note data
      setForm({
        Title: location.state.Title,
        Discription: location.state.Discription,
      });
    } else {
      // fallback if user reloads the page → fetch from API
      const fetchNote = async () => {
        const { data } = await URL.get(`/todolist/${id}`);
        setForm({ Title: data.Title, Discription: data.Discription });
      };
      fetchNote();
    }
  }, [id, location.state]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateNote = async (e) => {
    e.preventDefault();
    if (!form.Title || !form.Discription) return;

    try {
      await URL.put("/todoupdate", { Id: id, ...form });
      navigate("/"); 
    } catch (err) {
      console.error(err);
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-teal-50 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl h-[90vh] flex flex-col">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-purple-700">
          ✏️ Edit Note
        </h1>

        <form onSubmit={updateNote} className="flex flex-col gap-4 flex-1">
          {/* Title */}
          <input
            type="text"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            placeholder="Enter Note Title..."
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 outline-none"
          />

          {/* Formatting toolbar */}
          <div className="flex gap-3 justify-center flex-wrap bg-gray-50 p-2 rounded-lg shadow-sm">
            <button type="button" onClick={() => formatText("bold")} className="px-3 py-1 rounded-lg font-bold border hover:bg-purple-100">B</button>
            <button type="button" onClick={() => formatText("italic")} className="px-3 py-1 rounded-lg italic border hover:bg-purple-100">I</button>
            <button type="button" onClick={() => formatText("underline")} className="px-3 py-1 rounded-lg underline border hover:bg-purple-100">U</button>
            <button type="button" onClick={() => document.execCommand("hiliteColor", false, "yellow")} className="px-3 py-1 rounded-lg bg-yellow-300 hover:brightness-110">Yellow</button>
            <button type="button" onClick={() => document.execCommand("hiliteColor", false, "pink")} className="px-3 py-1 rounded-lg bg-pink-300 hover:brightness-110">Pink</button>
            <button type="button" onClick={() => document.execCommand("hiliteColor", false, "lightgreen")} className="px-3 py-1 rounded-lg bg-green-300 hover:brightness-110">Green</button>
            <button type="button" onClick={() => document.execCommand("hiliteColor", false, "lightblue")} className="px-3 py-1 rounded-lg bg-blue-300 hover:brightness-110">Blue</button>
          </div>

          {/* Editable description */}
          <div
            contentEditable
            suppressContentEditableWarning={true}
            className="flex-1 border p-3 rounded-lg bg-white overflow-y-auto shadow-inner"
            onInput={(e) =>
              setForm({ ...form, Discription: e.currentTarget.innerHTML })
            }
            dangerouslySetInnerHTML={{ __html: form.Discription }}
          ></div>

          {/* Save button */}
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
          >
            💾 Update Note
          </button>
        </form>
      </div>
    </div>
  );
}
