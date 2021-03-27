import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { GridMap } from './utils/gridMap';
import { LogrunBounds, LogrunPath } from './utils/logrun';

function pathToGridMap(bounds: LogrunBounds, path: LogrunPath, cellEdgeLength: number): GridMap {
  const map = new GridMap(bounds.maxX, bounds.maxY, cellEdgeLength);
  map.setCellsBresenham(path);
  return map;
}

interface DrawOptions {
  drawMap: boolean;
  drawGrid: boolean;
  drawPath: boolean;
}

function drawGridMap(
  ctx: CanvasRenderingContext2D,
  gridMap: GridMap,
  path: LogrunPath,
  options: DrawOptions
) {
  const { drawMap, drawGrid, drawPath } = options;

  const cellEdgeLength = gridMap.getCellEdgeLength();
  const cells = gridMap.getCells();
  const scalingX = ctx.canvas.width / (gridMap.getColumnCount() * cellEdgeLength);
  const scalingY = ctx.canvas.height / (gridMap.getRowCount() * cellEdgeLength);
  const scaling = Math.min(scalingX, scalingY);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(scaling, 0, 0, scaling, 0, 0);

  ctx.strokeStyle = drawGrid ? 'rgba(0, 0, 0, 0.1)' : '#000000';
  ctx.fillStyle = '#000000';
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      if (drawMap && cells[x][y].isSet) {
        ctx.fillRect(x * cellEdgeLength, y * cellEdgeLength, cellEdgeLength, cellEdgeLength);
      }

      // Even if we don't draw the grid, draw the outline of a set cell to avoid white borders
      // between cells.
      if (drawGrid || cells[x][y].isSet) {
        ctx.strokeRect(x * cellEdgeLength, y * cellEdgeLength, cellEdgeLength, cellEdgeLength);
      }
    }
  }

  if (drawPath) {
    ctx.strokeStyle = 'rgba(10, 200, 10, 0.75)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i][0], path[i][1]);
    }

    ctx.stroke();
  }
}

export interface Props {
  dataBounds: LogrunBounds;
  path: LogrunPath;
  canvasHeight: number;
  canvasWidth: number;
}

/**
 * Requires all points/paths to be in the first quadrant.
 *
 * @param props
 */
export function GridMapPlot(props: Props) {
  const { dataBounds, path, canvasHeight, canvasWidth } = props;

  const [cellEdgeLength, setCellEdgeLength] = useState(17);
  const [drawMap, setDrawMap] = useState(true);
  const [drawGrid, setDrawGrid] = useState(false);
  const [drawPath, setDrawPath] = useState(false);

  const [gridMap, setGridMap] = useState(() => pathToGridMap(dataBounds, path, cellEdgeLength));
  useEffect(() => {
    let edgeLength = cellEdgeLength;
    if (!edgeLength || edgeLength < -1) {
      edgeLength = 1;
    }

    setGridMap(pathToGridMap(dataBounds, path, edgeLength));
  }, [dataBounds, path, cellEdgeLength]);

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

    drawGridMap(context, gridMap, path, { drawGrid, drawMap, drawPath });
  }, [gridMap, path, drawGrid, drawMap, drawPath]);

  return (
    <div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
      <Form.Group controlId='exampleForm.ControlSelect1'>
        <Row className='align-items-center'>
          <Col className='text-nowrap' style={{ flex: 0 }}>
            <Form.Label>Cell Size</Form.Label>
          </Col>
          <Col style={{ flex: 1 }}>
            <Form.Control
              type='number'
              min={1}
              value={cellEdgeLength}
              onChange={ev => setCellEdgeLength(parseInt(ev.target.value, 10))}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group>
        <Form.Check
          type='checkbox'
          label='Draw Map'
          checked={drawMap}
          onChange={ev => setDrawMap(ev.target.checked)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Check
          type='checkbox'
          label='Draw Grid'
          checked={drawGrid}
          onChange={ev => setDrawGrid(ev.target.checked)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Check
          type='checkbox'
          label='Draw Path'
          checked={drawPath}
          onChange={ev => setDrawPath(ev.target.checked)}
        />
      </Form.Group>
    </div>
  );
}
