import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Category, Legend, Tooltip, DataLabel, ColumnSeries } from '@syncfusion/ej2-react-charts';

const BarChart = ({ data }) => {
  return (
    <ChartComponent style={{ width: '100%', height: '100%' }}>
      <SeriesCollectionDirective>
        <SeriesDirective type='Column' dataSource={data} xName='x' yName='y' name='Roads'>
        </SeriesDirective>
      </SeriesCollectionDirective>
      <Legend visible={true} title='Legend' titleStyle={{ text: 'Mombasa road, Kiambu road, Langata road, Ngong road' }} />
      <Tooltip enable={true} />
      <DataLabel visible={true} position='Top' />
      <Category labelPlacement='OnTicks' />
    </ChartComponent>
  );
};

export default BarChart;
