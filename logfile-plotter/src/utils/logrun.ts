/**
 * (x, y)
 */
export type LogrunPoint = [number, number];

/**
 * A series of Points.
 */
export type LogrunPath = LogrunPoint[];

export interface LogrunBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface LogrunLine {
  time: number;
  data: {
    cleanMissionStatus: {
      cycle: 'quick';
      phase: 'run';
      expireM: number;
      rechrgM: number;
      error: number;
      notReady: number;
      mssnM: number;
      sqft: number;
      initiator: 'localApp';
      nMssn: number;
    };
    pose: {
      theta: number;
      point: { x: number; y: number };
    };
    bin: {
      present: boolean;
      full: boolean;
    };
  };
}

export class Logrun {
  public static fromCLI(log: string) {
    const lines = log
      .split(/\r?\n/)
      .filter(l => l.trim() !== '')
      .map(l => JSON.parse(l));
    return new Logrun(lines);
  }

  constructor(private lines: LogrunLine[]) {}

  public swapXY(): Logrun {
    const newLines = this.lines.map(l => ({
      ...l,
      data: {
        ...l.data,
        pose: {
          ...l.data.pose,
          point: { x: l.data.pose.point.y, y: l.data.pose.point.x },
        },
      },
    }));
    return new Logrun(newLines);
  }

  public moveToFirstQuadrant() {
    const bounds = this.getBounds();
    const deltaX = Math.abs(Math.min(bounds.minX, 0));
    const deltaY = Math.abs(Math.min(bounds.minY, 0));
    if (deltaX === 0 && deltaY === 0) {
      // Nothing to do.
      return;
    }

    for (const line of this.lines) {
      line.data.pose.point.x += deltaX;
      line.data.pose.point.y += deltaY;
    }
  }

  /**
   * Gets the path representing this logrun.
   * @returns {LogrunPath}
   * @memberof Logrun
   */
  public getPath(): LogrunPath {
    const path: LogrunPath = [];

    for (let line of this.lines) {
      path.push([line.data.pose.point.x, line.data.pose.point.y]);
    }

    return path;
  }

  public getBounds(): LogrunBounds {
    let [minX, minY, maxX, maxY] = [0, 0, 0, 0];

    for (const line of this.lines) {
      const { x, y } = line.data.pose.point;
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);
      maxX = Math.max(x, maxX);
      maxY = Math.max(y, maxY);
    }

    return { minX, minY, maxX, maxY };
  }
}
