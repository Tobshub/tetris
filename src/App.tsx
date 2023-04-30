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
    setNewBlock(new OBlock(board.display, 0, 0));
  };
  const dropBlock = () => {
    setNewBlock(new OBlock(board.display, 1, 0));
    console.log(board.display)
  }
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

const enum ORIENTATION {
  VERTICAL,
  HORIZONTAL,
  VERTICAL_REVERSE,
  HORIZONTAL_REVERSE,
}

type BlockInitProps = {
  squares: Array<Array<Square>>;
  height: number;
  width: number;
  y: number;
  x: number;
};

class Block {
  squares: Array<Array<Square>>;
  height: number;
  width: number;
  y: number;
  x: number;
  orientation: ORIENTATION;
  constructor(props: BlockInitProps) {
    this.orientation = ORIENTATION.HORIZONTAL;
    this.squares = props.squares;
    this.height = props.height;
    this.width = props.width;
    this.x = props.x;
    this.y = props.y;
  }

  drop() {
    console.error("display is not implement");
  }
}

class IBlock extends Block {
  constructor() {
    super();
  }
}
class LBlock extends Block {
  constructor() {
    super();
  }
}

class JBlock extends Block {
  constructor() {
    super();
  }
}
class OBlock extends Block {
  constructor(private readonly display: Board["display"], y: number, x: number) {
    super({
      //prettier-ignore
      squares: [[new Square(), new Square()],[new Square(), new Square()]],
      height: 2,
      width: 2,
      y: y,
      x: x,
    });
    this.render();
  }

  render() {
    for (let y = this.y; y < this.height; y++) {
      for (let x = this.x; x < this.width; x++) {
        this.display[y][x] = [this.squares[y][x]];
      }
    }
  }

  drop() {
    for (let y = this.height - this.y - 1; y >= this.y; y++) {
      for (let x = this.x; x < this.width; x++) {
        this.display[y + 1][x] = this.display[y][x];
        this.display[y][x] = [];
      }
    }
    this.y += 1;
  }
}
class ZBlock extends Block {
  constructor() {
    super();
  }
}
class TBlock extends Block {
  constructor() {
    super();
  }
}
class SBlock extends Block {
  constructor() {
    super();
  }
}
