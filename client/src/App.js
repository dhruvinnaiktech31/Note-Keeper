import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import AddNote from './Pages/Add';
import EditNote from './Pages/Edit';
function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-note" element={<AddNote />} />
           <Route path="/edit-note/:id" element={<EditNote />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
