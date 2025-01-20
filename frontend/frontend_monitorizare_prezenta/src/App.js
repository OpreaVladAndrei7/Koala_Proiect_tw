import "./App.css";
import Login from "./Login";
import Main from "./Main";
import Attendance from "./Attendance";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/attendance" element={<Attendance />} />
    </Routes>
  );
}

export default App;
