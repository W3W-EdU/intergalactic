import React from 'react';
import { Plot, RadialTree } from '@semcore/ui/d3-chart';
import { scaleLinear } from 'd3-scale';
import LikeM from '@semcore/ui/icon/Like/m';

export default () => {
  const width = 500;
  const height = 500;

  const data = Array(12)
    .fill({})
    .map((_, i) => ({
      label: `Sheep ${i + 1}`,
      icon: LikeM,
    }));

  return (
    <Plot data={data} scale={[scaleLinear(), scaleLinear()]} width={width} height={height} label="sheep counting chart with custom center while trying to sleep">
      <RadialTree centralMargin={85} color="#AB6CFE">
        <RadialTree.Radian>
          <RadialTree.Radian.Label />
          <RadialTree.Radian.Line />
          <RadialTree.Radian.Cap />
          <RadialTree.Radian.Icon />
        </RadialTree.Radian>
        <circle r={60} cx={width / 2} cy={height / 2} fill="#AB6CFE" />
        <RadialTree.Title fill="#FFFFFF">Sleeping</RadialTree.Title>
      </RadialTree>
    </Plot>
  );
};
