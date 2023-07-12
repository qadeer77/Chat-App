import Chat from "./Component/Chat";
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./Component/Login";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
