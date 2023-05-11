import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function TransactionChart({chart,data,color}) {
    let elm = document.querySelector(".TransactionD")
    
    let width = 500
    let height = 500

    if(elm != null) {
        width = elm.clientWidth;
        height = elm.clientHeight;  
    }

    return (
        <div className={chart.divClass}>
            <h3 id={chart.labelClass}>{chart.labelText}</h3>
            <LineChart
                className={chart.class}
                width={width}
                height={height}
                data={data}
            >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value, name) => [`${(value/1000).toFixed(1)} xp`]}/>
                <Legend />
                <Line type="monotone" dataKey="XP" stroke={color} strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
        </div>
    );

}

export default TransactionChart;