// src/pages/Dashboard.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Day 1', sales: 400 },
  { name: 'Day 2', sales: 300 },
  { name: 'Day 3', sales: 200 },
  { name: 'Day 4', sales: 278 },
  { name: 'Day 5', sales: 189 },
  { name: 'Day 6', sales: 239 },
  { name: 'Day 7', sales: 349 },
];

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h2>Sales Dashboard</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Dashboard;
