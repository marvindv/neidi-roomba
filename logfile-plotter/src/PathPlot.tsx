import { useEffect, useRef } from 'react';
import { LogrunBounds, LogrunPath } from './utils/logrun';

function drawPath(ctx: CanvasRenderingContext2D, path: LogrunPath, bounds: LogrunBounds) {
  const scalingX = ctx.canvas.width / bounds.maxX;
  const scalingY = ctx.canvas.height / bounds.maxY;
  const scaling = Math.min(scalingX, scalingY);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(scaling, 0, 0, scaling, 0, 0);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(path[0][0], path[0][1]);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i][0], path[i][1]);
  }

  ctx.stroke();
}

export interface Props {
  bounds: LogrunBounds;
  path: LogrunPath;
  plotHeight: number;
  plotWidth: number;
}

/**
 * Requires all points/paths to be in the first quadrant.
 *
 * @param props
 */
export function PathPlot(props: Props) {
  const { bounds, path, plotHeight, plotWidth } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (path.length < 2) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    drawPath(context, path, bounds);
  }, [path, bounds]);

  return <canvas ref={canvasRef} width={plotWidth} height={plotHeight}></canvas>;
}
