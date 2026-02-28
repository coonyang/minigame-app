import { Link, Outlet } from "react-router-dom";

export default function MiniGamePage() {
  return (
    <div className="minigame-container">
      <h2 className="minigame-title">명조 미니 게임</h2>

      <nav className="minigame-nav">
        <Link to="수박게임" className="game-link">
          수박 게임
        </Link>
        <Link to="새알심쌓기" className="game-link">
          새알심 쌓기
        </Link>
      </nav>

      <hr className="minigame-divider" />

      <div className="game-viewport">
        <Outlet />
      </div>
    </div>
  );
}
