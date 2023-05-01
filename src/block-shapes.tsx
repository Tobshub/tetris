import { type Block } from "./block";

export type BLOCKTYPE = keyof typeof BLOCKSHAPE;

export class Square {
  color: string;
  constructor() {
    this.color = "black";
  }
  display() {
    return (
      <div
        style={{ width: "100%", height: "100%", backgroundColor: this.color }}
      ></div>
    );
  }

  build(parent: Block) {
    const type = parent.props.type;
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
    this.color = color;
  }
}

export const BLOCKSHAPE = {
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

export function chooseRandomBlockType() {
  const index = Math.floor(Math.random() * Object.keys(BLOCKSHAPE).length);
  return Object.keys(BLOCKSHAPE)[index] as BLOCKTYPE;
}
