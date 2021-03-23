import { LogrunPoint } from './logrun';

export interface GridCell {
  isSet: boolean;
}

export class GridMap {
  /**
   * The grid as a 2D-list, first dimension is x-axis, second is y-axis.
   *
   * @private
   * @type {GridCell[][]}
   * @memberof GridMap
   */
  private grid: GridCell[][] = [];

  /**
   * Creates an instance of GridMap. All parameters are expected to be integers.
   *
   * @param {number} xMax
   * @param {number} yMax
   * @param {number} cellEdgeLength Each cell is a square, this argument defines the cell edge
   *  length.
   * @memberof GridMap
   */
  constructor(private xMax: number, private yMax: number, private cellEdgeLength: number) {
    if ([xMax, yMax, cellEdgeLength].some(num => !Number.isInteger(num))) {
      throw new Error('xMax, yMax and cellEdgeLength must be integers');
    }

    const xCount = Math.ceil(this.xMax / this.cellEdgeLength);
    const yCount = Math.ceil(this.yMax / this.cellEdgeLength);

    for (let x = 0; x < xCount; x++) {
      // Don't use Array#fill with the object since then every column would have a reference on the
      // same object 🙄
      const column: GridCell[] = new Array(yCount).fill(undefined).map(() => ({ isSet: false }));
      this.grid.push(column);
    }
  }

  getCells(): GridCell[][] {
    return this.grid;
  }

  /**
   * Determines for every cell in this grid whether there is a point
   *
   * @param {LogrunPoint[]} points
   * @memberof GridMap
   */
  setCells(points: LogrunPoint[]): void {
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        this.grid[x][y].isSet = false;
      }
    }

    for (let i = 0; i <= points.length - 2; i++) {
      const start = points[i];
      const end = points[i + 1];
      this.plotLine(start[0], start[1], end[0], end[1]);
    }
  }

  /**
   * From https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#All_cases
   *
   * plotLineLow(x0, y0, x1, y1)
   *     dx = x1 - x0
   *     dy = y1 - y0
   *     yi = 1
   *     if dy < 0
   *         yi = -1
   *         dy = -dy
   *     end if
   *     D = (2 * dy) - dx
   *     y = y0
   *
   *     for x from x0 to x1
   *         plot(x, y)
   *         if D > 0
   *             y = y + yi
   *             D = D + (2 * (dy - dx))
   *         else
   *             D = D + 2*dy
   *         end if
   *
   * @private
   * @memberof GridMap
   */
  private plotLineLow(x0: number, y0: number, x1: number, y1: number) {
    const dx = x1 - x0;
    let dy = y1 - y0;
    let yi = 1;

    if (dy < 0) {
      yi = -1;
      dy = -dy;
    }

    let D = 2 * dy - dx;
    let y = y0;

    for (let x = x0; x <= x1; x++) {
      this.setCellIndexFromCoords(x, y, true);
      if (D > 0) {
        y = y + yi;
        D = D + 2 * (dy - dx);
      } else {
        D = D + 2 * dy;
      }
    }
  }

  /**
   * From https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#All_cases
   *
   * plotLineHigh(x0, y0, x1, y1)
   *    dx = x1 - x0
   *    dy = y1 - y0
   *    xi = 1
   *    if dx < 0
   *        xi = -1
   *        dx = -dx
   *    end if
   *    D = (2 * dx) - dy
   *    x = x0
   *
   *    for y from y0 to y1
   *        plot(x, y)
   *        if D > 0
   *            x = x + xi
   *            D = D + (2 * (dx - dy))
   *        else
   *            D = D + 2*dx
   *        end if
   *
   * @private
   * @memberof GridMap
   */
  private plotLineHigh(x0: number, y0: number, x1: number, y1: number) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let xi = 1;
    if (dx < 0) {
      xi = -1;
      dx = -dx;
    }

    let D = 2 * dx - dy;
    let x = x0;

    for (let y = y0; y <= y1; y++) {
      this.setCellIndexFromCoords(x, y, true);
      if (D > 0) {
        x = x + xi;
        D = D + 2 * (dx - dy);
      } else {
        D = D + 2 * dx;
      }
    }
  }

  /**
   * From https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#All_cases
   *
   * plotLine(x0, y0, x1, y1)
   *    if abs(y1 - y0) < abs(x1 - x0)
   *        if x0 > x1
   *            plotLineLow(x1, y1, x0, y0)
   *        else
   *            plotLineLow(x0, y0, x1, y1)
   *        end if
   *    else
   *        if y0 > y1
   *            plotLineHigh(x1, y1, x0, y0)
   *        else
   *            plotLineHigh(x0, y0, x1, y1)
   *        end if
   *    end if
   *
   * @private
   * @memberof GridMap
   */
  private plotLine(x0: number, y0: number, x1: number, y1: number) {
    if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
      if (x0 > x1) {
        this.plotLineLow(x1, y1, x0, y0);
      } else {
        this.plotLineLow(x0, y0, x1, y1);
      }
    } else {
      if (y0 > y1) {
        this.plotLineHigh(x1, y1, x0, y0);
      } else {
        this.plotLineHigh(x0, y0, x1, y1);
      }
    }
  }

  private setCellIndexFromCoords(x: number, y: number, isSet: boolean): void {
    const ix = Math.floor(x / this.cellEdgeLength);
    const iy = Math.floor(y / this.cellEdgeLength);
    if (!this.grid[ix]?.[iy]) {
      //debugger;
      console.warn(`Missing cell (${ix}, ${iy}), from point (${x}, ${y})`);
      return;
    }

    this.grid[ix][iy].isSet = isSet;
  }
}
