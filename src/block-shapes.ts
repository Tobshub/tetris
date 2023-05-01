import { Square } from "./block";

export type BLOCKSTYPES = keyof typeof BLOCKSHAPE;

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
