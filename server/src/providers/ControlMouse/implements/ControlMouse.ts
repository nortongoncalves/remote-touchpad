import {
  ControlMouse as IControlMouse,
  MoveCursorParams,
} from '../ControlMouse';
import ControlMouseAddon from '../../../../build/Release/ControlMouseAddon.node';

export class ControlMouse implements IControlMouse {
  async moveCursor({ x, y }: MoveCursorParams): Promise<number> {
    const response = ControlMouseAddon.moveCursor(x, y);
    return response;
  }
}
