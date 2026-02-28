import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MiniGamePage from "./pages/MiniGamePage.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          padding: "10px",
          backgroundColor: "#333",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          홈
        </Link>
        <Link to="/minigame" style={{ color: "white", textDecoration: "none" }}>
          미니게임
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/minigame" element={<MiniGamePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
