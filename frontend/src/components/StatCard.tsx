import { ReactNode } from 'react';
import Card, { CardBody } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'red';
}

export default function StatCard({ title, value, icon, trend, color = 'emerald' }: StatCardProps) {
  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <Card hover>
      <CardBody className="flex items-center space-x-4">
        <div className={`${colors[color]} p-3 rounded-xl text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
