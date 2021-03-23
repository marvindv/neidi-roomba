import { GridCell, GridMap } from './gridMap';
import { LogrunPoint } from './logrun';

test('GridMap#constructor', () => {
  const map = new GridMap(10, 15, 5);
  // x-Axis is down, y-Axis is horizontally.
  //
  //        y
  //     ------->
  //    |
  //  x |
  //    |
  //    v
  //
  // We expect 2 Columns along the x-Axis, with each column containing 3 Cells (up the y-Axis).
  const expected: GridCell[][] = [
    [{ isSet: false }, { isSet: false }, { isSet: false }],
    [{ isSet: false }, { isSet: false }, { isSet: false }],
  ];

  expect(map.getCells()).toEqual(expected);
});

test('GridMap#setCells (0,0) - (0,1)', () => {
  const map = new GridMap(2, 3, 1);
  const points: LogrunPoint[] = [
    [0, 0],
    [0, 1],
  ];
  map.setCells(points);
  const expected: GridCell[][] = [
    [{ isSet: true }, { isSet: true }, { isSet: false }],
    [{ isSet: false }, { isSet: false }, { isSet: false }],
  ];
  expect(map.getCells()).toEqual(expected);
});

test('GridMap#setCells x=0', () => {
  const map = new GridMap(2, 3, 1);
  const points: LogrunPoint[] = [
    [0, 0],
    [0, 2],
  ];
  map.setCells(points);
  const expected: GridCell[][] = [
    [{ isSet: true }, { isSet: true }, { isSet: true }],
    [{ isSet: false }, { isSet: false }, { isSet: false }],
  ];
  expect(map.getCells()).toEqual(expected);
});

test('GridMap#setCells x=1', () => {
  const map = new GridMap(2, 3, 1);
  const points: LogrunPoint[] = [
    [1, 0],
    [1, 1],
  ];
  map.setCells(points);
  const expected: GridCell[][] = [
    [{ isSet: false }, { isSet: false }, { isSet: false }],
    [{ isSet: true }, { isSet: true }, { isSet: false }],
  ];
  expect(map.getCells()).toEqual(expected);
});

test('GridMap#setCells y=0', () => {
  const map = new GridMap(2, 3, 1);
  const points: LogrunPoint[] = [
    [0, 0],
    [1, 0],
  ];
  map.setCells(points);
  const expected: GridCell[][] = [
    [{ isSet: true }, { isSet: false }, { isSet: false }],
    [{ isSet: true }, { isSet: false }, { isSet: false }],
  ];
  expect(map.getCells()).toEqual(expected);
});
