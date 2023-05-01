import { Block } from "./block";

export type BLOCKTYPE = keyof typeof BLOCKSHAPE;

export class Square {
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
