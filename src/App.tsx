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
  const [_, setState] = useState({ value: 10 });

  function rerenderForcefully() {
    setState((prev) => {
      return { ...prev };
    });
  }

  return rerenderForcefully;
}

function GameArea() {
  const rerender = useForceRerender();
  const [board] = useState(() => new Board());
  const [newBlock, setNewBlock] = useState<Block | undefined>();
  const createBlock = () => {
    setNewBlock(
      new Block(board.display, {
        type: "IBLOCK",
        orientation: ORIENTATION.HORIZONTAL,
      })
    );
  };

  const dropBlock = () => {
    if (newBlock) {
      newBlock?.drop();
      rerender();
    }
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
      <button onClick={dropBlock}>DROP</button>
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

class Square {
  constructor() {}
  display() {
    return (
      <div
        style={{ width: "100%", height: "100%", backgroundColor: "red" }}
      ></div>
    );
  }
}

class Block {
  squares: Array<Array<Square | undefined>>;
  height: number;
  width: number;
  y: number;
  x: number;
  orientation: ORIENTATION;
  constructor(
    private readonly display: Board["display"],
    props: BlockInitProps
  ) {
    this.orientation = ORIENTATION.HORIZONTAL;
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
    this.render();
  }

  render() {
    this.squares.forEach((row, index_y) => {
      row.forEach((square, index_x) => {
        this.display[index_y + this.y][index_x + this.x] = square;
      });
    });
  }

  clear() {
    this.squares.forEach((row, index_y) => {
      row.forEach((_, index_x) => {
        this.display[index_y + this.y][index_x + this.x] = undefined;
      });
    });
  }
}

const BLOCKSHAPE = {
  IBLOCK: [
    [new Square(), new Square(), new Square(), new Square()],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  LBLOCK: [
    [new Square(), new Square(), new Square()],
    [new Square(), undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  JBLOCK: [
    [new Square(), undefined, undefined],
    [new Square(), new Square(), new Square()],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  OBLOCK: [
    [undefined, new Square(), new Square(), undefined],
    [undefined, new Square(), new Square(), undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  ZBLOCK: [
    [new Square(), new Square(), undefined, undefined],
    [undefined, new Square(), new Square(), undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  SBLOCK: [
    [undefined, undefined, new Square(), new Square()],
    [undefined, new Square(), new Square(), undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  TBLOCK: [
    [new Square(), new Square(), new Square()],
    [undefined, new Square(), undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
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
