import React from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { Plot, ReferenceLine, XAxis, YAxis } from 'intergalactic/d3-chart';

const Demo = () => {
  const MARGIN = 40;
  const width = 500;
  const height = 300;

  const xScale = scaleBand()
    .range([MARGIN, width - MARGIN])
    .domain(dataBar.map((d) => d.category))
    .paddingInner(0.4)
    .paddingOuter(0.2);

  const yScale = scaleLinear()
    .range([height - MARGIN, MARGIN])
    .domain([0, 10]);

  return (
    <Plot data={dataBar} scale={[xScale, yScale]} width={width} height={height}>
      <YAxis>
        <YAxis.Ticks />
      </YAxis>
      <XAxis>
        <XAxis.Ticks />
      </XAxis>
      <ReferenceLine title='Left data' value={dataBar[0].category}>
        <ReferenceLine.Stripes endValue={dataBar[1].category} />
      </ReferenceLine>
      <ReferenceLine title='Right data' position='right' value={dataBar[1].category} />
      <ReferenceLine title='Top data' position='top' value={9} />
      <ReferenceLine title='Bottom data' position='bottom' value={3} />
      <ReferenceLine value={dataBar[3].category} strokeDasharray='3 3' width='100'>
        <ReferenceLine.Background endValue={dataBar[4].category} />
      </ReferenceLine>
    </Plot>
  );
};

const dataBar = Array(5)
  .fill({})
  .map((d, i) => ({
    category: `Category ${i}`,
    bar: i >= 3 ? Math.random() * 10 : 0,
  }));

export default Demo;
