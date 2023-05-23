import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getRandomColor } from '../utility/color';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
  
      return (
        <div className="custom-tooltip">
          <p>{label}</p>
          <p>{`MB: ${(data.value).toFixed(2)}`}</p>
        </div>
      );
    }
  
    return null;
  };

function AuditChart({chart,data}) {
    let elm = document.querySelector(".AuditD")
    const colors = [getRandomColor()]; 
    
    let width = 500
    let height = 500

    if(elm != null) {
        width = elm.clientWidth;
        height = elm.clientHeight;  
    }

    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <div className={chart.divClass}>
            <h3 id={chart.labelClass}>{chart.labelText}</h3>
            <BarChart width={width} height={height} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend
                formatter={() => {
                    return 'MB';
                }}
            />
            <Bar dataKey="value" fill={colors} />
            </BarChart>
        </div>
       
      );
}

export default AuditChart
