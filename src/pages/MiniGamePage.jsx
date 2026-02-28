import { Link, Outlet } from "react-router-dom";

export default function MiniGamePage() {
  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <h2>미니게임 목록</h2>
      <nav style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link to="수박게임" style={{ color: "cyan" }}>
          수박게임
        </Link>
        <Link to="새알심쌓기" style={{ color: "cyan" }}>
          새알심쌓기
        </Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
