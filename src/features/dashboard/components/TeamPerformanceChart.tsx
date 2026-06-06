import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@blinkdotnew/ui';
import { TrendingUp } from 'lucide-react';
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TeamPerformanceChartProps {
  data: any[];
}

export function TeamPerformanceChart({ data }: TeamPerformanceChartProps) {
  return (
    <Card className="bg-card/30 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="performance" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
