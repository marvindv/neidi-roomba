import { useEffect, useRef, useState } from 'react';
import { GridMap } from './utils/gridMap';
import { LogrunBounds, LogrunPath } from './utils/logrun';

const CELL_EDGE_LENGTH = 15;

function pathToGridMap(bounds: LogrunBounds, path: LogrunPath): GridMap {
  const map = new GridMap(bounds.maxX, bounds.maxY, CELL_EDGE_LENGTH);
  map.setCells(path);
  return map;
}

function drawGridMap(ctx: CanvasRenderingContext2D, gridMap: GridMap) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = '#000000';
  const cells = gridMap.getCells();
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      if (cells[x][y].isSet) {
        ctx.fillRect(
          x * CELL_EDGE_LENGTH,
          y * CELL_EDGE_LENGTH,
          CELL_EDGE_LENGTH,
          CELL_EDGE_LENGTH
        );
      }
    }
  }
}

export interface Props {
  bounds: LogrunBounds;
  path: LogrunPath;
}

/**
 * Requires all points/paths to be in the first quadrant.
 *
 * @param props
 */
export function GridMapPlot(props: Props) {
  const { bounds, path } = props;

  const [gridMap, setGridMap] = useState(pathToGridMap(bounds, path));
  useEffect(() => {
    setGridMap(pathToGridMap(bounds, path));
  }, [bounds, path]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    drawGridMap(context, gridMap);
  }, [gridMap]);

  return <canvas ref={canvasRef} width={500} height={500}></canvas>;
}
