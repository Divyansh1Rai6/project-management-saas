'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { weeklyProductivity } from '@/lib/mock-data';

export function ProductivityChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={weeklyProductivity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(243 75% 59%)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="hsl(243 75% 59%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '0.75rem',
            border: '1px solid hsl(214 32% 91%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            fontSize: '13px',
          }}
          labelStyle={{ fontWeight: 600, color: 'hsl(222 47% 11%)' }}
        />
        <Area
          type="monotone"
          dataKey="tasks"
          stroke="hsl(243 75% 59%)"
          strokeWidth={2.5}
          fill="url(#taskGradient)"
          dot={{ fill: 'hsl(243 75% 59%)', r: 3 }}
          activeDot={{ r: 5 }}
          name="Tasks"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
