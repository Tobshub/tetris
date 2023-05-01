import { useEffect, useState } from "react";

// prettier-ignore
const BOARD_DISPLAY = [
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined),
];

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <GameArea />
    </div>
  );
}

function useForceRerender() {
  const [, setState] = useState({ value: 10 });

  function rerenderForcefully() {
    setState((prev) => {
      return { ...prev };
    });
  }

  return rerenderForcefully;
}

function chooseRandomType() {
  const index = Math.floor(Math.random() * Object.keys(BLOCKSHAPE).length);
  return Object.keys(BLOCKSHAPE)[index] as BlockInitProps["type"];
}

function useGameState(
  board: Board,
  forceRender: () => void,
  options: { gameSpeed: number }
) {
  let lastTime = 0;
  const updateGameSate = (time: number) => {
    let delta = time - lastTime;
    if (delta >= 1_000 / options.gameSpeed) {
      const currentBlock = board.currentBlock;
      lastTime = time;
      if (currentBlock) {
        let canContinue = currentBlock.drop();
        if (!canContinue) board.currentBlock = undefined;
      } else {
        board.newBlock(forceRender);
      }
    }
    requestAnimationFrame(updateGameSate);
  };

  return { update: updateGameSate };
}

function GameArea() {
  const rerender = useForceRerender();
  const [board] = useState(() => new Board());

  const { update } = useGameState(board, rerender, { gameSpeed: 2 });

  useEffect(() => {
    requestAnimationFrame(update);
  }, []);

  const handleKeyboardInput = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft": {
        board.currentBlock?.shift("left");
        break;
      }
      case "ArrowRight": {
        board.currentBlock?.shift("right");
        break;
      }
      case "ArrowDown": {
        board.currentBlock?.drop();
        break;
      }
      case "a":
      case "A": {
        board.currentBlock?.rotate(-1);
        break;
      }
      case "d":
      case "D": {
        board.currentBlock?.rotate(1);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    const handleKeyboardInputOnFrame = (e: KeyboardEvent) => {
      requestAnimationFrame(() => handleKeyboardInput(e));
    };
    addEventListener("keydown", handleKeyboardInputOnFrame);
    return () => {
      removeEventListener("keydown", handleKeyboardInputOnFrame);
    };
  }, []);

  return (
    <>
      <div
        style={{
          width: "min(400px, 100%)",
          borderColor: "black",
          borderInline: "1px solid",
          borderBottom: "1px solid",
        }}
      >
        {board.display.map((col, index) => (
          <ul
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gridAutoRows: "auto",
              listStyle: "none",
            }}
          >
            {col.map((row, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {row?.display() ?? "."}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <button onClick={() => board.currentBlock?.drop()}>DOWN</button>
      <button onClick={() => board.currentBlock?.shift("left")}>{"<-"}</button>
      <button onClick={() => board.currentBlock?.shift("right")}>{"->"}</button>
      <button onClick={() => board.currentBlock?.rotate(-1)}>
        ROTATE LEFT
      </button>
      <button onClick={() => board.currentBlock?.rotate(1)}>
        ROTATE RIGHT
      </button>
    </>
  );
}

class Board {
  display: Array<Array<Square | undefined>>;
  currentBlock: Block | undefined;
  constructor() {
    this.display = BOARD_DISPLAY;
    this.currentBlock = undefined;
  }

  newBlock(forceRender: () => void) {
    this.currentBlock = new Block(
      this.display,
      { type: chooseRandomType() },
      forceRender
    );
    this.currentBlock?.render();
  }
}

class Block {
  private squares: Array<Array<Square | undefined>>;
  private width: number;
  private y: number;
  private x: number;
  private canMove: boolean;
  constructor(
    private readonly display: Board["display"],
    public readonly props: BlockInitProps,
    private readonly redrawBoard: () => void
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
    this.redrawBoard();
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
          this.x + (offset.x ?? 0) < 0;
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

class Square {
  parent: Block | undefined;
  constructor() {
    this.parent = undefined;
  }
  display() {
    const type = this.parent?.props.type;
    const color =
      type === "IBLOCK"
        ? "red"
        : type === "JBLOCK"
        ? "blue"
        : type === "LBLOCK"
        ? "orange"
        : type === "OBLOCK"
        ? "yellow"
        : type === "SBLOCK"
        ? "pink"
        : type === "TBLOCK"
        ? "green"
        : "purple";
    return (
      <div
        style={{ width: "100%", height: "100%", backgroundColor: color }}
      ></div>
    );
  }

  build(parent: Block) {
    this.parent = parent;
  }
}

const BLOCKSHAPE = {
  IBLOCK: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [new Square(), new Square(), new Square(), new Square()],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  LBLOCK: [
    [undefined, undefined, undefined, undefined],
    [new Square(), new Square(), new Square()],
    [new Square(), undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  JBLOCK: [
    [undefined, undefined, undefined],
    [new Square(), new Square(), new Square()],
    [undefined, undefined, new Square()],
    [undefined, undefined, undefined],
  ],
  OBLOCK: [
    [new Square(), new Square()],
    [new Square(), new Square()],
  ],
  ZBLOCK: [
    [undefined, undefined, undefined],
    [new Square(), new Square(), undefined],
    [undefined, new Square(), new Square()],
    [undefined, undefined, undefined],
  ],
  SBLOCK: [
    [undefined, undefined, undefined],
    [undefined, new Square(), new Square()],
    [new Square(), new Square(), undefined],
    [undefined, undefined, undefined],
  ],
  TBLOCK: [
    [undefined, undefined, undefined],
    [new Square(), new Square(), new Square()],
    [undefined, new Square(), undefined],
    [undefined, undefined, undefined],
  ],
};

type BlockInitProps = {
  type: keyof typeof BLOCKSHAPE;
};
