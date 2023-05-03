import { useEffect, useState } from "react";
import { Block } from "./block";
import { type Square, chooseRandomBlockType } from "./block-shapes";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: ".80rem",
        height: "100%",
      }}
    >
      <small>Arrows to move, A and D for rotations</small>
      <GameArea />
    </div>
  );
}

function useGameState(board: Board, options: { gameSpeed: number }) {
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
        board.clearFilledRows();
        board.newBlock();
      }
    }
    requestAnimationFrame(updateGameSate);
  };

  return { update: updateGameSate };
}

function GameArea() {
  const board = new Board();
  const [display, setDisplay] = useState(board.display);

  useEffect(() => {
    board.forceRender = () => setDisplay((state) => [...state]);
  }, []);

  const { update } = useGameState(board, { gameSpeed: 8 });

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
        {display.map((col, index) => (
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
      <div style={{ display: "flex", gap: ".5rem" }}>
        <button onClick={() => board.currentBlock?.drop()}>DOWN</button>
        <button onClick={() => board.currentBlock?.shift("left")}>
          {"<-"}
        </button>
        <button onClick={() => board.currentBlock?.shift("right")}>
          {"->"}
        </button>
        <button onClick={() => board.currentBlock?.rotate(-1)}>
          ROTATE LEFT
        </button>
        <button onClick={() => board.currentBlock?.rotate(1)}>
          ROTATE RIGHT
        </button>
      </div>
    </>
  );
}

export class Board {
  display: Array<Array<Square | undefined>>;
  currentBlock: Block | undefined;
  forceRender: () => void;
  constructor() {
    this.display = BOARD_DISPLAY;
    this.currentBlock = undefined;
    this.forceRender = () => {};
  }

  newBlock() {
    this.currentBlock = new Block(this, {
      type: "IBLOCK", // chooseRandomBlockType(),
    });
    this.currentBlock?.render();
  }

  clearFilledRows() {
    for (let i = 0; i < this.display.length; i++) {
      let filled = this.display[i].every((col) => !!col);
      if (filled) {
        console.log({ i, filled });
        this.display.filter((_, index) => index !== i);
        this.display.unshift(Array(10).fill(undefined));
      }
    }
  }
}

// prettier-ignore
const BOARD_DISPLAY = [
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined),
];
