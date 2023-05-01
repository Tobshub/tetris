import { useEffect, useState } from "react";
import {Block, Square} from "./block";
import { BLOCKSHAPE, BLOCKSTYPES } from "./block-shapes";

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
  return Object.keys(BLOCKSHAPE)[index] as BLOCKSTYPES;
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

export class Board {
  display: Array<Array<Square | undefined>>;
  currentBlock: Block | undefined;
  constructor() {
    this.display = BOARD_DISPLAY;
    this.currentBlock = undefined;
  }

  newBlock(forceRender: () => void) {
    this.currentBlock = new Block(
      this.display,
      { type: "IBLOCK" }, // type should be `chooseRandomType()` but set to IBLOCK for testing purposes
      forceRender
    );
    this.currentBlock?.render();
  }
}

// prettier-ignore
const BOARD_DISPLAY = [
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), 
  Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined), Array(10).fill(undefined),
];
