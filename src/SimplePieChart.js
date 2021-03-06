import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SimplePieChart (props) {

  return (
      <div className="chartContainer">
        <h1>{props.title}</h1>
        <ResponsiveContainer>
          <PieChart width={400} height={400}>
            <Pie
              data={props.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={props.colors[index % props.colors.length]} />
              ))}
            </Pie>
            <Legend layout="vertical" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
  );

}