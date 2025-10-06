"use client";
import { useEffect, useRef } from "react";
import { defineScenes } from "../game/scenes";

export default function VirtualCampus() {
  const gameContainer = useRef(null);

  useEffect(() => {
    (async () => {
      const kaboom = (await import("kaboom")).default;

      const k = kaboom({
        global: true,
        width: 960,
        height: 540,
        scale: 1.5,
        canvas: gameContainer.current,
        background: [135, 206, 235],
      });

      // Load assets
      k.loadSprite("bean", "https://kaboomjs.com/sprites/bean.png");
      k.loadSprite("door", "https://kaboomjs.com/sprites/door.png");
      k.loadSprite("book", "https://kaboomjs.com/sprites/apple.png");
      k.loadSprite("pc", "https://kaboomjs.com/sprites/coin.png");
      k.loadSprite("board", "https://kaboomjs.com/sprites/grass.png");
      k.loadSprite("table", "https://kaboomjs.com/sprites/block.png");

      // Define all game scenes
      defineScenes(k);

      // Start at campus hub
      k.go("campus");
    })();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>🎓 Virtual Engineering Campus</h1>
      <canvas ref={gameContainer}></canvas>
    </div>
  );
}
