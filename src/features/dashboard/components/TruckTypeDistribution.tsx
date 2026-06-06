import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@blinkdotnew/ui';
import { Truck } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TruckTypeDistributionProps {
  data: any[];
}

export function TruckTypeDistribution({ data }: TruckTypeDistributionProps) {
  return (
    <Card className="bg-card/30 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck size={20} className="text-primary" />
          Truck Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
