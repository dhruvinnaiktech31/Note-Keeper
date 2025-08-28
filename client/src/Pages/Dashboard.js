import React from "react";
import NoteKeeper from "./NoteKeeper";
import TodoList from "./TodoList";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {" "}
      {/* Left Side - Note Keeper */}{" "}
      <div className="w-full md:w-2/3 border-b md:border-b-0 md:border-r border-gray-300 p-4 overflow-y-auto">
        {" "}
        <TodoList />{" "}
      </div>{" "}
      {/* Right Side - Todo List */}{" "}
      <div className="w-full md:w-1/3 p-4 overflow-y-auto">
        {" "}
        <NoteKeeper />{" "}
      </div>{" "}
    </div>
  );
}
