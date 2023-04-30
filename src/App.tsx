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
  currentBlock: Block | undefined,
  createNewBlock: () => void,
  options: { gameSpeed: number }
) {
  let lastTime = 0;
  const updateGameSate = (time: number) => {
    let delta = time - lastTime;
    if (delta >= 2_000 / options.gameSpeed) {
      console.log({ delta });
      lastTime = time;
      if (currentBlock) {
        currentBlock.drop();
      }
    }
    requestAnimationFrame(updateGameSate);
  };

  return updateGameSate;
}

function GameArea() {
  const rerender = useForceRerender();
  const [board] = useState(() => new Board());
  const [newBlock, setNewBlock] = useState<Block | undefined>();
  const createBlock = () => {
    setNewBlock(
      new Block(
        board.display,
        { type: chooseRandomType(), orientation: ORIENTATION.HORIZONTAL },
        rerender
      )
    );
  };

  useEffect(() => {
    newBlock?.render();
  }, [newBlock]);

  const update = useGameState(board, newBlock, createBlock, { gameSpeed: 1.2 });

  useEffect(() => {
    requestAnimationFrame(update);
  }, [newBlock]);

  return (
    <>
      <div
        style={{
          width: "min(300px, 100%)",
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
      <button onClick={createBlock}>CREATE BLOCK</button>
      <button onClick={() => newBlock?.drop()}>DOWN</button>
      <button onClick={() => newBlock?.shift("left")}>{"<-"}</button>
      <button onClick={() => newBlock?.shift("right")}>{"->"}</button>
    </>
  );
}

class Board {
  display: Array<Array<Square | undefined>>;
  constructor() {
    // prettier-ignore
    this.display = BOARD_DISPLAY;
  }
}

class Block {
  squares: Array<Array<Square | undefined>>;
  height: number;
  width: number;
  y: number;
  x: number;
  canMove: boolean;
  constructor(
    private readonly display: Board["display"],
    public props: BlockInitProps,
    public redrawBoard: () => void
  ) {
    this.squares = BLOCKSHAPE[props.type];
    this.height = BLOCKSHAPE[props.type].length;
    this.width = BLOCKSHAPE[props.type][0].length;
    this.x = Math.floor(Math.random() * (this.display[0].length - this.width));
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
          xAxisOutofBounds ||
          (square && yAxisOutofBounds)
        ) {
          safe = false;
        }
        return safe;
      });
      return safe;
    });
    return safe;
  }

  clear() {
    this.squares.forEach((row, index_y) => {
      row.forEach((square, index_x) => {
        if (!square) return;
        this.display[index_y + this.y][index_x + this.x] = undefined;
      });
    });
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
  ],
  JBLOCK: [
    [undefined, undefined, undefined],
    [new Square(), new Square(), new Square()],
    [undefined, undefined, new Square()],
  ],
  OBLOCK: [
    [new Square(), new Square()],
    [new Square(), new Square()],
  ],
  ZBLOCK: [
    [undefined, undefined, undefined],
    [new Square(), new Square(), undefined],
    [undefined, new Square(), new Square()],
  ],
  SBLOCK: [
    [undefined, undefined, undefined],
    [undefined, new Square(), new Square()],
    [new Square(), new Square(), undefined],
  ],
  TBLOCK: [
    [undefined, undefined, undefined],
    [new Square(), new Square(), new Square()],
    [undefined, new Square(), undefined],
  ],
};

const enum ORIENTATION {
  VERTICAL,
  HORIZONTAL,
  VERTICAL_REVERSE,
  HORIZONTAL_REVERSE,
}

type BlockInitProps = {
  type: keyof typeof BLOCKSHAPE;
  orientation: ORIENTATION;
};
