'use client'

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

interface RamachandranPlotProps {
  data: {
    phi: number[];
    psi: number[];
  };
}

const RamachandranPlot: React.FC<RamachandranPlotProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plotRef.current && data) {
      const trace = {
        x: data.phi,
        y: data.psi,
        mode: 'markers',
        type: 'scatter',
        marker: {
          color: 'blue',
          size: 5,
        },
      };

      const layout = {
        title: 'Ramachandran Plot',
        xaxis: {
          title: 'Phi (φ)',
          range: [-180, 180],
        },
        yaxis: {
          title: 'Psi (ψ)',
          range: [-180, 180],
        },
        width: 600,
        height: 600,
        images: [
          {
            source: 'https://raw.githubusercontent.com/d3/d3-logo/master/d3.png',
            xref: 'paper',
            yref: 'paper',
            x: 0,
            y: 1,
            sizex: 1,
            sizey: 1,
            sizing: 'stretch',
            opacity: 0.2,
            layer: 'below',
          },
        ],
      };

      Plotly.newPlot(plotRef.current, [trace], layout);
    }
  }, [data]);

  return <div ref={plotRef} />;
};

export default RamachandranPlot;