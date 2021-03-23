import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { EXAMPLE_LOGRUN } from './example-logrun';
import { GridMapPlot } from './GridMapPlot';
import { PathPlot } from './PathPlot';
import { PointPlot } from './PointPlot';
import { StartEndRange } from './Range';
import { Logrun, LogrunBounds, LogrunPath } from './utils/logrun';

type View = 'points' | 'path' | 'gridmap';

export function PlotWalker() {
  const [swapXY, setSwapXY] = useState(true);
  const [firstQuadrant, setFirstQuadrant] = useState(true);
  const [selectedView, setSelectedView] = useState<View>('path');

  const [logrun, setLogrun] = useState<Logrun | null>(null);
  const [bounds, setBounds] = useState<LogrunBounds | null>(null);
  const [path, setPath] = useState<LogrunPath | null>(null);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [slice, setSlice] = useState<LogrunPath>([]);

  useEffect(() => {
    let logrun = Logrun.fromCLI(EXAMPLE_LOGRUN);
    if (swapXY) {
      logrun = logrun.swapXY();
    }

    if (firstQuadrant) {
      logrun.moveToFirstQuadrant();
    }

    setLogrun(logrun);
  }, [setLogrun, swapXY, firstQuadrant]);

  useEffect(() => {
    if (logrun) {
      const path = logrun.getPath();

      setBounds(logrun.getBounds());
      setPath(path);
      setStart(0);
      setEnd(path.length);
    } else {
      setBounds(null);
      setPath(null);
    }
  }, [logrun]);

  useEffect(() => {
    if (!path) {
      setSlice([]);
      return;
    }

    setSlice(path.slice(start, end + 1));
  }, [path, start, end]);

  return (
    <div>
      {bounds && path && (
        <div style={{ width: '500px', margin: '2rem auto' }}>
          <div>
            Swap X/Y:{' '}
            <input type='checkbox' checked={swapXY} onChange={ev => setSwapXY(ev.target.checked)} />
            First Quadrant:{' '}
            <input
              type='checkbox'
              checked={firstQuadrant}
              onChange={ev => setFirstQuadrant(ev.target.checked)}
            />
          </div>

          <StartEndRange
            min={0}
            max={path.length}
            step={1}
            start={start}
            end={end}
            onChange={(start, end) => {
              setStart(start);
              setEnd(end);
            }}
          />

          <div style={{ textAlign: 'center' }}>
            {start} - {end}
          </div>

          <div>
            <Nav
              variant='pills'
              activeKey={selectedView}
              onSelect={key => setSelectedView(key as View)}
            >
              <Nav.Item>
                <Nav.Link eventKey='points'>Points</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='path'>Paths</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='gridmap'>GridMap</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <div style={{ height: '500px' }}>
            {selectedView === 'points' && <PointPlot bounds={bounds} path={slice} />}
            {selectedView === 'path' && <PathPlot bounds={bounds} path={slice} />}
            {selectedView === 'gridmap' && <GridMapPlot bounds={bounds} path={slice} />}
          </div>
        </div>
      )}
    </div>
  );
}
