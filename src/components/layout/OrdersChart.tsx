import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const OrdersChart = () => {
  const data = [
    {
      id: 'Completed',
      color: 'hsl(134, 70%, 50%)',
      data: [
        { x: 'March', y: 10 },
        { x: 'April', y: 20 },
        { x: 'May', y: 30 },
        { x: 'June', y: 40 },
        { x: 'July', y: 50 },
        { x: 'August', y: 60 },
        { x: 'September', y: 50 },
        { x: 'October', y: 40 },
      ],
    },
    {
      id: 'Scheduled',
      color: 'hsl(204, 70%, 50%)',
      data: [
        { x: 'March', y: 20 },
        { x: 'April', y: 15 },
        { x: 'May', y: 25 },
        { x: 'June', y: 35 },
        { x: 'July', y: 30 },
        { x: 'August', y: 25 },
        { x: 'September', y: 20 },
        { x: 'October', y: 15 },
      ],
    },
    {
      id: 'Canceled',
      color: 'hsl(0, 70%, 50%)',
      data: [
        { x: 'March', y: 5 },
        { x: 'April', y: 10 },
        { x: 'May', y: 5 },
        { x: 'June', y: 10 },
        { x: 'July', y: 5 },
        { x: 'August', y: 10 },
        { x: 'September', y: 5 },
        { x: 'October', y: 10 },
      ],
    },
  ];

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
      <h3 className="mb-2 text-base sm:text-lg font-bold">Orders</h3>
      <div className="h-[200px] sm:h-[300px]">
        <ResponsiveLine
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 40,
            left: 40,
            ...(!window.matchMedia("(max-width: 640px)").matches && {
              top: 50,
              right: 50,
              bottom: 50,
              left: 60
            })
          }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: window.matchMedia("(max-width: 640px)").matches ? -45 : 0,
            legend: 'Months',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Orders',
            legendOffset: -30,
            legendPosition: 'middle',
          }}
          enableSlices="x"
          enablePoints={false}
          colors={{ scheme: 'set1' }}
          lineWidth={2}
          pointBorderWidth={1}
          useMesh={true}
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: window.matchMedia("(max-width: 640px)").matches ? 50 : 100,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: 'left-to-right',
              itemWidth: window.matchMedia("(max-width: 640px)").matches ? 60 : 80,
              itemHeight: window.matchMedia("(max-width: 640px)").matches ? 15 : 20,
              itemOpacity: 0.75,
              symbolSize: window.matchMedia("(max-width: 640px)").matches ? 8 : 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default OrdersChart;
