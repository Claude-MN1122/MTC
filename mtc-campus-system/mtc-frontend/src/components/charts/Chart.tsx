'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  [key: string]: any;
}

interface BaseChartProps {
  title?: string;
  subtitle?: string;
  data: ChartDataPoint[];
  isLoading?: boolean;
  height?: number;
  showGrid?: boolean;
}

interface LineChartProps extends BaseChartProps {
  type: 'line';
  dataKey: string;
  stroke?: string;
  fill?: string;
}

interface BarChartProps extends BaseChartProps {
  type: 'bar';
  dataKey: string;
  fill?: string;
}

interface AreaChartProps extends BaseChartProps {
  type: 'area';
  dataKey: string;
  stroke?: string;
  fill?: string;
}

interface PieChartProps extends BaseChartProps {
  type: 'pie';
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

type ChartProps = LineChartProps | BarChartProps | AreaChartProps | PieChartProps;

export const Chart: React.FC<ChartProps> = (props) => {
  const {
    title,
    subtitle,
    data,
    isLoading = false,
    height = 300,
    showGrid = true,
  } = props;

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <Skeleton variant="text" width="40%" height="24px" />}
            {subtitle && <Skeleton variant="text" width="60%" height="16px" className="mt-2" />}
          </div>
        )}
        <Skeleton variant="rectangular" width="100%" height={height} />
      </Card>
    );
  }

  const commonProps = {
    width: '100%' as const,
    height,
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
  };

  const gridLines = showGrid ? (
    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
  ) : null;

  const renderChart = () => {
    switch (props.type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              {gridLines}
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={props.dataKey}
                stroke={props.stroke || '#3B82F6'}
                strokeWidth={2}
                dot={{ fill: props.stroke || '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              {gridLines}
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar
                dataKey={props.dataKey}
                fill={props.fill || '#3B82F6'}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              {gridLines}
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={props.stroke || '#3B82F6'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={props.stroke || '#3B82F6'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={props.dataKey}
                stroke={props.stroke || '#3B82F6'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={Math.min(height, 400) / 2 - 20}
                fill="#8884d8"
                dataKey={props.dataKey}
                nameKey={props.nameKey}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={(props.colors || ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'])[index % 5]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-h3 font-semibold text-text-primary">{title}</h3>}
          {subtitle && (
            <p className="text-small text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {renderChart()}
    </Card>
  );
};

export type { LineChartProps, BarChartProps, AreaChartProps, PieChartProps, BaseChartProps, ChartDataPoint };
