import { useState } from "react";

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

function GameArea() {
  const [board] = useState(() => new Board());
  const [newBlock, setNewBlock] = useState<Block | undefined>();
  const createBlock = () => {
    setNewBlock(
      new Block(board.display, {
        type: "IBLOCK",
        orientation: ORIENTATION.HORIZONTAL,
        y: 0,
        x: 0,
      })
    );
    console.log(board.display, newBlock);
  };
  const dropBlock = () => {
    // setNewBlock(new OBlock(board.display, 1, 0));
    console.log(board.display);
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
                {row[0]?.display() ?? "."}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <button onClick={createBlock}>CREATE BLOCK</button>
      <button onClick={dropBlock}>DROP BLOCK</button>
    </>
  );
}

class Board {
  display: Array<Array<Array<void | Square>>>;
  constructor() {
    // prettier-ignore
    this.display = [
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[],[]],
    ];
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
    this.squares = this.build(props.type);
    this.height = 0;
    this.width = 0;
    this.x = props.x;
    this.y = props.y;
  }

  build(type: keyof typeof BLOCKSHAPE): Array<Array<Square | undefined>> {
    this.height = BLOCKSHAPE[type].length;
    this.width = BLOCKSHAPE[type][0].length;
    this.squares = BLOCKSHAPE[type];
    this.render();
    return BLOCKSHAPE[type];
  }

  drop() {
    console.error("display is not implement");
  }

  render() {
    console.log(this.height, this.width, this.squares);
    for (let y = this.y; y < this.height; y++) {
      for (let x = this.x; x < this.width; x++) {
        this.display[y][x] = [this.squares[y][x]];
      }
    }
  }
}

const BLOCKSHAPE = {
  IBLOCK: [[new Square(), new Square(), new Square(), new Square()]],
  LBLOCK: [[new Square(), new Square(), new Square()], [new Square()]],
  JBLOCK: [[new Square()], [new Square(), new Square(), new Square()]],
  OBLOCK: [
    [new Square(), new Square()],
    [new Square(), new Square()],
  ],
  SBLOCK: [
    [undefined, new Square(), new Square()],
    [new Square(), new Square(), undefined],
  ],
  ZBLOCK: [
    [new Square(), new Square(), undefined],
    [undefined, new Square(), new Square()],
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
  y: number;
  x: number;
};
