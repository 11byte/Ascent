// Player factory function
export function createPlayer(k) {
  return k.add([
    k.rect(28, 48),
    k.pos(120, 300),
    k.area(),
    k.body(),
    k.color(0.2, 0.6, 1),
    k.origin("center"),
    "player",
  ]);
}
