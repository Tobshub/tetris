import { type Square, BLOCKSHAPE, type BLOCKTYPE } from "./block-shapes";
import { type Board } from "./App";


export class Block {
  private squares: Array<Array<Square | undefined>>;
  private width: number;
  private y: number;
  private x: number;
  private canMove: boolean;
  constructor(
    private readonly display: Board["display"],
    public readonly props: { type: BLOCKTYPE },
  ) {
    this.squares = BLOCKSHAPE[props.type];
    this.width = BLOCKSHAPE[props.type][0].length;
    this.x = Math.floor(
      Math.random() * (this.display[0].length - this.width + 1)
    );
    this.y = 0;
    this.canMove = true;
  }

  drop() {
    if (!this.canMove) {
      return false;
    }
    const safe = this.checkBeforeRender({ y: 1 });
    if (safe) {
      this.clear();
      this.y++;
      this.render();
      return true;
    }
    this.canMove = false;
    return false;
  }

  shift(direction: "left" | "right") {
    if (!this.canMove) {
      return false;
    }
    const safe = this.checkBeforeRender({ x: direction === "left" ? -1 : 1 });
    if (safe) {
      this.clear();
      this.x += direction === "left" ? -1 : 1;
      this.render();
      return true;
    }
    return false;
  }

  render() {
    this.squares.forEach((row, index_y) => {
      row.forEach((square, index_x) => {
        if (square) {
          square.build(this);
          this.display[index_y + this.y][index_x + this.x] = square;
        }
      });
    });
  }

  private checkBeforeRender(offset: { y?: number; x?: number }) {
    let safe = true;
    this.squares.every((row, index_y) => {
      row.every((square, index_x) => {
        const box = this.display[index_y + this.y + (offset.y ?? 0)]?.at(
          index_x + this.x + (offset.x ?? 0)
        );
        const nextBoxPartOfShape = this.squares[index_y + (offset.y ?? 0)]?.at(
          index_x + (offset.x ?? 0)
        );
        const xAxisOutofBounds =
          index_x + this.x + (offset.x ?? 0) >=
            this.display[index_y + this.y]?.length ||
          index_x + this.x + (offset.x ?? 0) < 0;
        const yAxisOutofBounds =
          index_y + this.y + (offset.y ?? 0) >= this.display.length ||
          this.y + (offset.y ?? 0) < 0;
        if (
          (box && square && !nextBoxPartOfShape) ||
          (square && (yAxisOutofBounds || xAxisOutofBounds))
        ) {
          safe = false;
        }
        return safe;
      });
      return safe;
    });
    return safe;
  }

  private clear() {
    this.squares.forEach((row, index_y) => {
      row.forEach((square, index_x) => {
        if (!square) return;
        this.display[index_y + this.y][index_x + this.x] = undefined;
      });
    });
  }

  rotate(direction: number) {
    if (!this.canMove) {
      return false;
    }
    this.clear();
    let rotated: Block["squares"];
    if (direction > 0) {
      rotated = this.squares[0].map((_, index) =>
        this.squares.map((row) => row[index]).reverse()
      );
    } else {
      rotated = this.squares[0].map((_, index) =>
        this.squares.map((row) => row[row.length - 1 - index])
      );
    }
    this.squares = rotated;
    let safe = this.checkBeforeRender({});
    if (safe) {
      this.render();
    } else {
      this.rotate(direction * -1);
      this.render();
    }
  }
}
