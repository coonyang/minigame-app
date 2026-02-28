import {
  Engine,
  Render,
  Runner,
  Bodies,
  World,
  Body,
  Events,
  Collision,
} from "matter-js";
import { useEffect, useRef, useState } from "react";
import { WW_BASE } from "../data/명조수박게임데이터";

export function Watermelongame() {
  const sceneRef = useRef(null);
  const worldRef = useRef(null);
  const currentBody = useRef(null);
  const currentFruit = useRef(null);
  const intervalRef = useRef(null);
  const disableActionRef = useRef(false);

  const [score, setScore] = useState(0);
  const scoreBodiesRef = useRef(new Set());

  const [설명서, set설명서] = useState(false);

  useEffect(() => {
    const engine = Engine.create();
    const render = Render.create({
      engine,
      element: sceneRef.current,
      options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
      },
    });

    const world = engine.world;
    worldRef.current = world;

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" },
    });

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" },
    });

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: { fillStyle: "#E6B143" },
    });

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      name: "topLine",
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#E6B143" },
    });

    World.add(world, [leftWall, rightWall, ground, topLine]);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, "afterUpdate", () => {
      const bodies = worldRef.current.bodies;
      bodies.forEach((body) => {
        if (
          body.score !== undefined &&
          !scoreBodiesRef.current.has(body) &&
          body.position.y > topLine.position.y &&
          body.position.y < ground.position.y - 100
        ) {
          setScore((prev) => prev + body.score);
          scoreBodiesRef.current.add(body);
        }
      });
    });

    window.onkeydown = (event) => {
      if (disableActionRef.current) {
        return;
      }

      switch (event.code) {
        case "KeyA":
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          intervalRef.current = setInterval(() => {
            if (
              currentBody.current.position.x - currentFruit.current.radius >
              30
            )
              Body.setPosition(currentBody.current, {
                x: currentBody.current.position.x - 1,
                y: currentBody.current.position.y,
              });
          }, 5);
          break;
        case "KeyD":
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          intervalRef.current = setInterval(() => {
            if (
              currentBody.current.position.x + currentFruit.current.radius <
              590
            )
              Body.setPosition(currentBody.current, {
                x: currentBody.current.position.x + 1,
                y: currentBody.current.position.y,
              });
          }, 5);
          break;
        case "KeyS":
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          currentBody.current.isSleeping = false;
          disableActionRef.current = true;

          setTimeout(() => {
            addFruit();
            disableActionRef.current = false;
          }, 1000);
          break;
      }
    };

    window.onkeyup = (event) => {
      switch (event.code) {
        case "KeyA":
        case "KeyD":
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          break;
      }
    };

    Events.on(engine, "collisionStart", (event) => {
      const removedBodies = new Set();

      event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
          const index = collision.bodyA.index;

          if (
            removedBodies.has(collision.bodyA) ||
            removedBodies.has(collision.bodyB)
          ) {
            return;
          }

          World.remove(world, [collision.bodyA, collision.bodyB]);

          if (index + 1 < WW_BASE.length) {
            const newCharacter = WW_BASE[index + 1];
            const newBody = Bodies.circle(
              collision.collision.supports[0].x,
              collision.collision.supports[0].y,
              newCharacter.radius,
              {
                render: {
                  sprite: {
                    texture: `/img/명조수박게임/${newCharacter.name}.png`,
                  },
                },
                index: index + 1,
              },
            );
            World.add(worldRef.current, newBody);
          }
        }
        if (
          !disableActionRef.current &&
          (collision.bodyA.name === "topLine" ||
            collision.bodyB.name === "topLine")
        ) {
          alert("Game over");
        }
      });
    });

    addFruit();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      engine.world.bodies = [];
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  function addFruit() {
    const index = Math.floor(Math.random() * 5);
    const character = WW_BASE[index];

    const body = Bodies.circle(300, 50, character.radius, {
      index: index,
      isSleeping: true,
      score: character.score,
      render: {
        sprite: { texture: `/img/명조수박게임/${character.name}.png` },
      },
      restitution: 0.2,
    });
    World.add(worldRef.current, body);
    currentBody.current = body;

    currentFruit.current = character;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h2>명조 수박 게임</h2>
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          border: "none",
        }}
        onClick={() => set설명서(true)}
      >
        게임 설명서
      </button>

      <div style={{ position: "relative" }} ref={sceneRef}>
        <h3
          style={{
            position: "absolute",
            top: "0px",
            left: "50px",
            color: "black",
          }}
        >
          score : {score}
        </h3>
      </div>

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
          }}
          onClick={() => set설명서(false)}
        >
          <div>
            <h3>명조 수박 게임 설명서</h3>
            <p>캐릭터를 좌우로 이동(A/D)하고 S를 눌러 떨어뜨리세요.</p>
            <p>같은 캐릭터가 부딪히면 합쳐집니다.</p>
            <p>경계선을 넘어가면 게임 오버!</p>
            <p>점수는 기준선을 통과하면 올라갑니다.</p>
            <p>A: 왼쪽, D: 오른쪽, S: 즉시 낙하</p>
          </div>
        </div>
      )}
    </div>
  );
}
