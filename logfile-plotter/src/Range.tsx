import React from 'react';
import { getTrackBackground, Range } from 'react-range';

export interface Props {
  rtl?: boolean | undefined;
  start: number;
  end: number;
  min: number;
  max: number;
  step: number;
  onChange(start: number, end: number): void;
}

/**
 * Range selector for a minimum and maximum value.
 *
 * Based on https://github.com/tajo/react-range/blob/master/examples/TwoThumbs.tsx
 *
 * @param param0
 */
export const StartEndRange: React.FC<Props> = ({
  rtl,
  start,
  end,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Range
        values={[start, end]}
        step={step}
        min={min}
        max={max}
        rtl={rtl}
        onChange={([start, end]) => onChange(start, end)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: [start, end],
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min,
                  max,
                  rtl,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '42px',
              borderRadius: '4px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          >
            <div
              style={{
                height: '16px',
                width: '5px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC',
              }}
            />
          </div>
        )}
      />
    </div>
  );
};
