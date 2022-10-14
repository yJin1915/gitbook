import React, { useState, useEffect, useCallback, useMemo, FC, useRef } from 'react';
import * as charts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import {formatMessage} from 'umi/locale';

const EchartsTest=(props) => {
  const getOption = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [formatMessage({id:'NationalPartner'}), formatMessage({id:'CityPartner'}), formatMessage({id:'CommunityPartners'}), formatMessage({id:'OrdinaryUsers'})],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '30%',
          itemStyle: {
            color: '#188df0'
          },
          emphasis: {
            itemStyle: {
              color: '#83bff6'
            }
          },
          data: props.data
        }
      ]
    };
    
    return option;
  };
  return (
    <>
      <div>
        <div style={{ width: '80%', margin: '20px auto' }}>
          <ReactEcharts option={getOption()} />
        </div>
      </div>
    </>
  );
};

export default EchartsTest;


