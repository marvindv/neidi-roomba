import { useEffect, useRef } from 'react';
import { LogrunBounds, LogrunPath } from './utils/logrun';

function drawPath(ctx: CanvasRenderingContext2D, path: LogrunPath) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = '#000000';
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
}

/**
 * Requires all points/paths to be in the first quadrant.
 *
 * TOOD: Line width configurable
 *
 * @param props
 */
export function PathPlot(props: Props) {
  const { bounds, path } = props;

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

    drawPath(context, path);
  }, [path]);

  return <canvas ref={canvasRef} width={500} height={500}></canvas>;
}
