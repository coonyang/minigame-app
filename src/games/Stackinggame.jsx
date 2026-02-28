import { useState, useRef, useEffect } from "react";

export const Stackinggame = () => {
  const canvasRef = useRef(null);

  const eggImages = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [eggs, setEggs] = useState([]);
  const [currentEgg, setCurrentEgg] = useState(null);
  const [gameState, setGameState] = useState("playing");
  const [설명서, set설명서] = useState(false);

  const canvasWidth = 500;
  const canvasHeight = 700;
  const eggWidth = 100;
  const eggHeight = 70;
  const targetStackCount = 5;

  // 이미지 미리 로드
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];
    for (let i = 1; i <= 8; i++) {
      const img = new Image();
      img.src = `/img/새알심/${String(i).padStart(2, "0")}_egg.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 8) {
          eggImages.current = imgs;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`이미지 로드 실패: ${img.src}`);
      };
      imgs.push(img);
    }
  }, []);

  // 스페이스키 이벤트
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && currentEgg && currentEgg.status === "moving") {
        setCurrentEgg({ ...currentEgg, status: "falling" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentEgg]);

  // 게임 루프
  useEffect(() => {
    if (!imagesLoaded) return;
    let animationFrameId;

    const update = () => {
      if (!currentEgg && gameState === "playing") {
        const imgIndex = Math.floor(Math.random() * 8);
        const newEgg = {
          x: Math.random() * (canvasWidth - eggWidth),
          y: 50,
          status: "moving",
          direction: Math.random() < 0.5 ? -1 : 1,
          imgIndex,
        };
        setCurrentEgg(newEgg);
        return;
      }

      if (currentEgg?.status === "moving") {
        let newX = currentEgg.x + currentEgg.direction * 2;
        if (newX < 0 || newX + eggWidth > canvasWidth) {
          currentEgg.direction *= -1;
        } else {
          currentEgg.x = newX;
        }
        setCurrentEgg({ ...currentEgg });
      } else if (currentEgg?.status === "falling") {
        let newY = currentEgg.y + 4;
        let landed = false;

        if (eggs.length === 0 && newY + eggHeight >= canvasHeight) {
          landed = true;
        } else if (eggs.length > 0) {
          const topEgg = eggs[eggs.length - 1];
          const eggCenterX = currentEgg.x + eggWidth / 2;
          if (
            newY + eggHeight >= topEgg.y &&
            eggCenterX >= topEgg.x &&
            eggCenterX <= topEgg.x + eggWidth
          ) {
            landed = true;
          }
        }

        if (landed) {
          const newEggs = [...eggs, { ...currentEgg, y: newY }];
          setEggs(newEggs);
          setCurrentEgg(null);
          if (newEggs.length >= targetStackCount) {
            setGameState("win");
          }
        } else if (newY + eggHeight >= canvasHeight) {
          setGameState("gameover");
        } else {
          setCurrentEgg({ ...currentEgg, y: newY });
        }
      }
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Eggs
      eggs.forEach((egg) => {
        const img = eggImages.current[egg.imgIndex];
        if (img) {
          ctx.drawImage(img, egg.x, egg.y, eggWidth, eggHeight);
        }
      });

      if (currentEgg) {
        const img = eggImages.current[currentEgg.imgIndex];
        if (img) {
          ctx.drawImage(img, currentEgg.x, currentEgg.y, eggWidth, eggHeight);
        }
      }

      // 메시지
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`쌓인 알심: ${eggs.length}`, 20, 30);

      if (gameState === "win") {
        ctx.fillStyle = "green";
        ctx.font = "30px Arial";
        ctx.fillText("You Win!", canvasWidth / 2 - 60, canvasHeight / 2);
      } else if (gameState === "gameover") {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvasWidth / 2 - 80, canvasHeight / 2);
      }
    };

    if (gameState === "playing") {
      const gameLoop = () => {
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
      };
      animationFrameId = requestAnimationFrame(gameLoop);
    } else {
      draw(); // 상태가 win/gameover일 때도 메시지 그리기
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [imagesLoaded, currentEgg, eggs, gameState]);

  // 다시하기 버튼 핸들러
  const handleRestart = () => {
    setEggs([]);
    setCurrentEgg(null);
    setGameState("playing");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: "1px solid white",
          backgroundColor: "#E6B143",
          display: "block",
          margin: "20px auto",
        }}
      />
      {gameState !== "playing" && (
        <button
          onClick={handleRestart}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          다시하기
        </button>
      )}
      <button className="guide-button" onClick={() => set설명서(true)}>
        게임 설명서
      </button>
      {설명서 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            color: "white",
            textAlign: "left",
          }}
          onClick={() => set설명서(false)}
        >
          <div>
            <h3>새알심 게임 설명서</h3>
            <p>스페이스를 눌러 새알심을 떨어뜨리세요.</p>
            <p>처음 쌓은 캐릭터 위에 쌓아가는 게임입니다.</p>
            <p>바로 위에 쌓지 못하면 게임오버!</p>
            <p>점수는 새알심을 쌓는 개수입니다.</p>
            <p>5개만 쌓으면 승리!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stackinggame;
