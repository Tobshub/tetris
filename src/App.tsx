import { useState } from "react";

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

function GameArea() {
  const rerender = useForceRerender();
  const [board] = useState(() => new Board());
  const [newBlock, setNewBlock] = useState<Block | undefined>();
  const createBlock = async () => {
    setNewBlock(
      new Block(
        board.display,
        { type: chooseRandomType(), orientation: ORIENTATION.HORIZONTAL },
        rerender
      )
    );
  };

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
  constructor(
    private readonly display: Board["display"],
    public props: BlockInitProps,
    public redraw: () => void
  ) {
    this.squares = BLOCKSHAPE[props.type];
    this.height = BLOCKSHAPE[props.type].length;
    this.width = BLOCKSHAPE[props.type][0].length;
    this.x = Math.floor(Math.random() * (this.display[0].length - this.width));
    this.y = 0;
    this.render();
  }

  drop() {
    this.clear();
    this.y++;
    const safe = this.render();
    if (safe) {
      this.redraw();
    } else {
      this.y--;
      this.render();
    }
  }

  shift(direction: "left" | "right") {
    this.clear();
    this.x += direction === "left" ? -1 : 1;
    const safe = this.render();
    if (safe) {
      this.redraw();
    } else {
      this.x -= direction === "left" ? -1 : 1;
      this.render();
    }
  }

  render() {
    const safe = this.checkBeforeRender();
    if (!safe) {
      return false;
    }
    this.squares.forEach((row, index_y) => {
      row.forEach((square, index_x) => {
        square?.build(this);
        this.display[index_y + this.y][index_x + this.x] =
          square ?? this.display[index_y + this.y][index_x + this.x];
      });
    });
    return true;
  }

  private checkBeforeRender() {
    let safe = true;
    this.squares.every((row, index_y) => {
      if (index_y + this.y >= this.display.length || index_y + this.y < 0) {
        safe = false;
        return safe;
      }
      row.every((square, index_x) => {
        const box = this.display[index_y + this.y][index_x + this.x];
        if (
          (box && square) ||
          index_x + this.x >= this.display[index_y + this.y].length ||
          index_x + this.x < 0
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
      row.forEach((_, index_x) => {
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
  IBLOCK: [[new Square(), new Square(), new Square(), new Square()]],
  LBLOCK: [
    [new Square(), new Square(), new Square()],
    [new Square(), undefined, undefined],
  ],
  JBLOCK: [
    [new Square(), undefined, undefined],
    [new Square(), new Square(), new Square()],
  ],
  OBLOCK: [
    [new Square(), new Square()],
    [new Square(), new Square()],
  ],
  ZBLOCK: [
    [new Square(), new Square(), undefined],
    [undefined, new Square(), new Square()],
  ],
  SBLOCK: [
    [undefined, new Square(), new Square()],
    [new Square(), new Square(), undefined],
  ],
  TBLOCK: [
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
