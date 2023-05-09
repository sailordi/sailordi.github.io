import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function TransactionChart({chart,width,height,data,color}) {
    
    return (
        <div className={chart.divClass}>
            <h3 id={chart.labelClass}>{chart.labelText}</h3>
            <LineChart
                className={chart.class}
                width={width}
                height={height}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value, name) => [`${value} xp`]}/>
                <Legend />
                <Line type="monotone" dataKey="XP" stroke={color} activeDot={{ r: 8 }} />
            </LineChart>
        </div>
    );

}

export default TransactionChart;