import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div style={{ textAlign: "center", color: "white", marginTop: "100px" }}>
      <h1>명조 팬 페이지</h1>
      <p>환영합니다! 아래 버튼을 눌러 미니게임을 즐겨보세요.</p>
      <Link to="/minigame" className="minigame-logo">
        미니게임 하러가기
      </Link>
    </div>
  );
}
