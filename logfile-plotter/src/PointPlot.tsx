import { ResponsiveScatterPlot, Serie } from '@nivo/scatterplot';
import { useEffect, useState } from 'react';
import { LogrunBounds, LogrunPath } from './utils/logrun';

function pathToPlotData(path: LogrunPath): Serie {
  return {
    id: 'logrun',
    data: path.map(p => ({ x: p[0], y: p[1] })),
  };
}

export interface Props {
  bounds: LogrunBounds;
  path: LogrunPath;
  plotHeight: number;
  plotWidth: number;
}

export function PointPlot(props: Props) {
  const { bounds, path, plotHeight, plotWidth } = props;

  const [data, setData] = useState<Serie>(pathToPlotData(path));

  useEffect(() => {
    setData(pathToPlotData(path));
  }, [setData, path]);

  return (
    <div style={{ height: plotHeight + 'px', width: plotWidth + 'px' }}>
      <ResponsiveScatterPlot
        animate={false}
        data={[data]}
        margin={{ top: 60, right: 90, bottom: 70, left: 90 }}
        xScale={{ type: 'linear', min: bounds.minX, max: bounds.maxX }}
        xFormat={function (e) {
          return e + ' inch';
        }}
        yScale={{ type: 'linear', min: bounds.minY, max: bounds.maxY }}
        yFormat={function (e) {
          return e + ' inch';
        }}
        blendMode='multiply'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'x',
          legendPosition: 'middle',
          legendOffset: 46,
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'y',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: 'left-to-right',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
