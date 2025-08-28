import React, { useState, useEffect, useRef } from "react";
import { URL } from "./db";
import { useNavigate, useParams } from "react-router-dom";

export default function NoteForm() {
  const { id } = useParams(); // edit mode if present
  const [form, setForm] = useState({ Title: "", Discription: "" });
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // --- helpers ---
  const sanitizeHTML = (html) => {
    if (!html) return "";
    let out = html;

    // remove bidi / direction marks that cause RTL weirdness
    out = out.replace(/[\u200E\u200F\u202A-\u202E]/g, "");

    // remove leading whitespace, &nbsp; and <br> spam
    out = out.replace(/^((?:&nbsp;|\s|<br\s*\/?>|<div><br\s*\/?><\/div>)+)/i, "");

    // normalize empty content to ""
    if (/^(<br\s*\/?>|\s|&nbsp;)*$/i.test(out)) out = "";

    return out;
  };

  const handleEditorInput = (e) => {
    const cleaned = sanitizeHTML(e.currentTarget.innerHTML);
    setForm((prev) => ({ ...prev, Discription: cleaned }));
  };

  const handleEditorPaste = (e) => {
    // paste as plain text to avoid hidden RTL/style artifacts
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, text);
  };

  // --- fetch on edit ---
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await URL.get(`/todolist/${id}`);
        setForm({
          Title: data?.Title || "",
          Discription: sanitizeHTML(data?.Discription || ""),
        });
        // ensure the editor shows the sanitized HTML
        if (editorRef.current) {
          editorRef.current.innerHTML = sanitizeHTML(data?.Discription || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchNote();
  }, [id]);

  // keep contentEditable DOM in sync when Title/Discription changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== form.Discription) {
      editorRef.current.innerHTML = form.Discription || "";
    }
  }, [form.Discription]);

  // --- regular inputs ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- save ---
  const saveNote = async (e) => {
    e.preventDefault();
    const payload = {
      Title: (form.Title || "").trim(),
      Discription: sanitizeHTML(form.Discription || ""),
    };
    if (!payload.Title || !payload.Discription) return;

    try {
      if (id) {
        await URL.put("/todoupdate", { Id: id, ...payload });
      } else {
        await URL.post("/todoadd", payload);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // --- toolbar ---
  const formatText = (command, value = null) => {
    // focus editor before formatting so selection exists
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    // after execCommand, sync state with sanitized HTML
    if (editorRef.current) {
      const cleaned = sanitizeHTML(editorRef.current.innerHTML);
      setForm((prev) => ({ ...prev, Discription: cleaned }));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-teal-50 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl h-[90vh] flex flex-col">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-purple-700">
          {id ? "✏️ Edit Note" : "✨ Add New Note"}
        </h1>

        <form onSubmit={saveNote} className="flex flex-col gap-4 flex-1">
          {/* Title */}
          <input
            type="text"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            placeholder="Enter Note Title..."
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 outline-none"
          />

          {/* Toolbar */}
          <div className="flex gap-3 justify-center flex-wrap bg-gray-50 p-2 rounded-lg shadow-sm">
            <button type="button" onClick={() => formatText("bold")} className="px-3 py-1 rounded-lg font-bold border hover:bg-purple-100">B</button>
            <button type="button" onClick={() => formatText("italic")} className="px-3 py-1 rounded-lg italic border hover:bg-purple-100">I</button>
            <button type="button" onClick={() => formatText("underline")} className="px-3 py-1 rounded-lg underline border hover:bg-purple-100">U</button>

            {/* Highlights */}
            <button type="button" onClick={() => formatText("hiliteColor", "yellow")} className="px-3 py-1 rounded-lg bg-yellow-300 hover:brightness-110">Yellow</button>
            <button type="button" onClick={() => formatText("hiliteColor", "pink")} className="px-3 py-1 rounded-lg bg-pink-300 hover:brightness-110">Pink</button>
            <button type="button" onClick={() => formatText("hiliteColor", "lightgreen")} className="px-3 py-1 rounded-lg bg-green-300 hover:brightness-110">Green</button>
            <button type="button" onClick={() => formatText("hiliteColor", "lightblue")} className="px-3 py-1 rounded-lg bg-blue-300 hover:brightness-110">Blue</button>
          </div>

          {/* Rich editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            // hard force LTR; 'unicodeBidi: plaintext' prevents hidden RTL runs
            style={{ direction: "ltr", unicodeBidi: "plaintext", textAlign: "left" }}
            className="flex-1 border p-3 rounded-lg bg-white overflow-y-auto shadow-inner leading-relaxed"
            onInput={handleEditorInput}
            onPaste={handleEditorPaste}
            // initial HTML comes from effect via ref sync; avoid flicker with this too:
            dangerouslySetInnerHTML={{ __html: form.Discription }}
          />

          {/* Save */}
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
          >
            {id ? "💾 Update Note" : "💾 Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
