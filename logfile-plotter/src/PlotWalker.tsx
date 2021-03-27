import React, { ChangeEventHandler, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { EXAMPLE_LOGRUN } from './example-logrun';
import { GridMapPlot } from './GridMapPlot';
import { PathPlot } from './PathPlot';
import { PointPlot } from './PointPlot';
import { StartEndRange } from './Range';
import { Logrun, LogrunBounds, LogrunPath } from './utils/logrun';

type View = 'points' | 'path' | 'gridmap';

export function PlotWalker() {
  const [cliLog, setCliLog] = useState<string | null>(EXAMPLE_LOGRUN);
  const [plotHeight] = useState(600);
  const [plotWidth] = useState(600);
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
    if (!cliLog) {
      setLogrun(null);
      return;
    }

    let logrun = Logrun.fromCLI(cliLog);
    if (swapXY) {
      logrun = logrun.swapXY();
    }

    if (firstQuadrant) {
      logrun.moveToFirstQuadrant();
    }

    setLogrun(logrun);
  }, [cliLog, setLogrun, swapXY, firstQuadrant]);

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

  const handleLogrunFileChange: ChangeEventHandler<HTMLInputElement> = ev => {
    const file = ev.target.files?.[0];
    if (file) {
      file
        .text()
        .then(content => setCliLog(content))
        .catch(err => console.error('Failed to read CLI log:', err));
    }
  };

  return (
    <div>
      <Container className='mt-3'>
        <Row>
          <Col>
            <div>
              <h4>CLI logrun.txt</h4>
              <Form.File
                className='position-relative'
                required
                name='file'
                onChange={handleLogrunFileChange}
              />
            </div>
            <div className='mt-3'>
              <h4>Settings</h4>
              <div>
                <Form.Group>
                  <Form.Check
                    type='checkbox'
                    label='Swap X/Y'
                    checked={swapXY}
                    onChange={ev => setSwapXY(ev.target.checked)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type='checkbox'
                    label='Move into first quadrant'
                    checked={firstQuadrant}
                    onChange={ev => setFirstQuadrant(ev.target.checked)}
                  />
                </Form.Group>
              </div>
            </div>

            {bounds && path && (
              <div className='mt-3'>
                <h4>Range</h4>
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
              </div>
            )}
          </Col>
          <Col>
            {bounds && path && (
              <Card>
                <Card.Header>
                  <Nav
                    variant='tabs'
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
                </Card.Header>
                <Card.Body>
                  <div style={{ minHeight: plotHeight + 'px', minWidth: plotWidth + 'px' }}>
                    {selectedView === 'points' && (
                      <PointPlot bounds={bounds} path={slice} {...{ plotHeight, plotWidth }} />
                    )}
                    {selectedView === 'path' && (
                      <PathPlot bounds={bounds} path={slice} {...{ plotHeight, plotWidth }} />
                    )}
                    {selectedView === 'gridmap' && (
                      <GridMapPlot
                        dataBounds={bounds}
                        path={slice}
                        canvasHeight={plotHeight}
                        canvasWidth={plotWidth}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
