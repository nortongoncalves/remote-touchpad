import robot from '@hurdlegroup/robotjs'

export async function moveMouse(x: string, y: string) {
  robot.setMouseDelay(1);
  const mousePos = robot.getMousePos();
  robot.moveMouse(mousePos.x - Number(x), mousePos.y - Number(y));
}
