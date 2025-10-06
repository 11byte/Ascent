export function defineScenes(k) {
  // Reusable player factory
  function createPlayer(posX = 120, posY = 80) {
    return k.add([
      k.sprite("bean"),
      k.pos(posX, posY),
      k.area(),
      { speed: 200 }, // Movement speed
    ]);
  }

  // Movement handler
  function setupControls(player) {
    k.onKeyDown("left", () => player.move(-player.speed, 0));
    k.onKeyDown("right", () => player.move(player.speed, 0));
    k.onKeyDown("up", () => player.move(0, -player.speed));
    k.onKeyDown("down", () => player.move(0, player.speed));
  }

  // ----------------- Campus Hub -----------------
  k.scene("campus", () => {
    const player = createPlayer(100, 420);
    setupControls(player);

    // Campus ground rectangle
    k.add([
      k.rect(2000, 48),
      k.pos(0, 500),
      k.area(),
      k.body({ isStatic: true }),
    ]);

    // Doors to rooms
    const doors = [
      { x: 200, scene: "library", label: "Library" },
      { x: 400, scene: "lab", label: "Lab" },
      { x: 600, scene: "classroom", label: "Classroom" },
      { x: 800, scene: "cafeteria", label: "Cafeteria" },
    ];

    doors.forEach(({ x, scene, label }) => {
      const door = k.add([
        k.sprite("door"),
        k.pos(x, 420),
        k.area(),
        "door",
        { target: scene },
      ]);
      k.add([k.text(label, { size: 14 }), k.pos(x, 390)]);
    });

    // Enter rooms when colliding
    player.onCollide("door", (d) => {
      k.go(d.target);
    });
  });

  // ----------------- Library -----------------
  k.scene("library", () => {
    const player = createPlayer();
    setupControls(player);

    k.add([k.text("📚 Library", { size: 32 }), k.pos(20, 20)]);

    const shelf = k.add([k.sprite("book"), k.pos(200, 400), k.area(), "shelf"]);
    player.onCollide("shelf", () => {
      k.add([
        k.text("You found a Data Structures book!", { size: 20 }),
        k.pos(100, 300),
        { lifetime: 2 },
      ]);
    });

    k.onKeyPress("escape", () => k.go("campus"));
  });

  // ----------------- Lab -----------------
  k.scene("lab", () => {
    const player = createPlayer();
    setupControls(player);

    k.add([k.text("💻 Lab", { size: 32 }), k.pos(20, 20)]);

    const computer = k.add([k.sprite("pc"), k.pos(200, 400), k.area(), "pc"]);
    player.onCollide("pc", () => {
      k.add([
        k.text("Compiling your code...", { size: 20 }),
        k.pos(100, 300),
        { lifetime: 2 },
      ]);
    });

    k.onKeyPress("escape", () => k.go("campus"));
  });

  // ----------------- Classroom -----------------
  k.scene("classroom", () => {
    const player = createPlayer();
    setupControls(player);

    k.add([k.text("📖 Classroom", { size: 32 }), k.pos(20, 20)]);

    const board = k.add([
      k.sprite("board"),
      k.pos(200, 400),
      k.area(),
      "board",
    ]);
    player.onCollide("board", () => {
      k.add([
        k.text("Lecture: Operating Systems!", { size: 20 }),
        k.pos(100, 300),
        { lifetime: 2 },
      ]);
    });

    k.onKeyPress("escape", () => k.go("campus"));
  });

  // ----------------- Cafeteria -----------------
  k.scene("cafeteria", () => {
    const player = createPlayer();
    setupControls(player);

    k.add([k.text("☕ Cafeteria", { size: 32 }), k.pos(20, 20)]);

    const table = k.add([
      k.sprite("table"),
      k.pos(200, 400),
      k.area(),
      "table",
    ]);
    player.onCollide("table", () => {
      k.add([
        k.text("You chat with friends!", { size: 20 }),
        k.pos(100, 300),
        { lifetime: 2 },
      ]);
    });

    k.onKeyPress("escape", () => k.go("campus"));
  });
}
