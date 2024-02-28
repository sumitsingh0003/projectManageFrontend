import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PublicPage from "./Components/PublicPage";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Analytics from "./Components/Analytics";

import CreateTaskPopup from "./Components/CreateTaskPopup";
import Setting from "./Components/Setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/publicpage/:shareLink" element={<PublicPage />}></Route>
        <Route path="/analytics" element={<Analytics />}></Route>
        <Route path="/setting" element={<Setting />}></Route>
        <Route path="/createtask" element={<CreateTaskPopup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
