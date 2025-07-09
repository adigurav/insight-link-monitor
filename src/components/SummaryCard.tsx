
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Activity, Wifi, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  summary: any;
  section: string;
  isLoading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, section, isLoading }) => {
  const getSummaryContent = () => {
    switch (section) {
      case 'cpu-memory':
        return [
          {
            label: 'Avg CPU Usage',
            value: `${summary.avgCpu || 0}%`,
            icon: <Cpu className="h-5 w-5" />,
            trend: summary.avgCpu > 70 ? 'up' : summary.avgCpu < 30 ? 'down' : 'stable',
            color: summary.avgCpu > 80 ? 'text-red-600' : summary.avgCpu > 60 ? 'text-yellow-600' : 'text-green-600'
          },
          {
            label: 'Avg Memory Usage',
            value: `${summary.avgMemory || 0}%`,
            icon: <Activity className="h-5 w-5" />,
            trend: summary.avgMemory > 80 ? 'up' : summary.avgMemory < 40 ? 'down' : 'stable',
            color: summary.avgMemory > 90 ? 'text-red-600' : summary.avgMemory > 70 ? 'text-yellow-600' : 'text-green-600'
          },
          {
            label: 'Total Devices',
            value: summary.totalDevices || 0,
            icon: <Wifi className="h-5 w-5" />,
            trend: 'stable',
            color: 'text-blue-600'
          }
        ];
      case 'bandwidth':
        return [
          {
            label: 'Total Inbound',
            value: `${summary.totalInbound || 0} Mbps`,
            icon: <TrendingDown className="h-5 w-5" />,
            trend: 'up',
            color: 'text-green-600'
          },
          {
            label: 'Total Outbound',
            value: `${summary.totalOutbound || 0} Mbps`,
            icon: <TrendingUp className="h-5 w-5" />,
            trend: 'up',
            color: 'text-blue-600'
          },
          {
            label: 'Avg Utilization',
            value: `${summary.avgUtilization || 0}%`,
            icon: <Activity className="h-5 w-5" />,
            trend: summary.avgUtilization > 80 ? 'up' : 'stable',
            color: summary.avgUtilization > 90 ? 'text-red-600' : 'text-green-600'
          }
        ];
      case 'link-monitoring':
        return [
          {
            label: 'Avg Response Time',
            value: `${summary.avgResponseTime || 0} ms`,
            icon: <Activity className="h-5 w-5" />,
            trend: summary.avgResponseTime > 100 ? 'up' : 'stable',
            color: summary.avgResponseTime > 200 ? 'text-red-600' : summary.avgResponseTime > 100 ? 'text-yellow-600' : 'text-green-600'
          },
          {
            label: 'Avg Packet Loss',
            value: `${summary.avgPacketLoss || 0}%`,
            icon: <Wifi className="h-5 w-5" />,
            trend: summary.avgPacketLoss > 1 ? 'up' : 'stable',
            color: summary.avgPacketLoss > 2 ? 'text-red-600' : summary.avgPacketLoss > 0.5 ? 'text-yellow-600' : 'text-green-600'
          },
          {
            label: 'Avg Jitter',
            value: `${summary.avgJitter || 0} ms`,
            icon: <TrendingUp className="h-5 w-5" />,
            trend: summary.avgJitter > 5 ? 'up' : 'stable',
            color: summary.avgJitter > 10 ? 'text-red-600' : summary.avgJitter > 5 ? 'text-yellow-600' : 'text-green-600'
          }
        ];
      default:
        return [];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const summaryData = getSummaryContent();

  return (
    <Card className="bg-gradient-to-r from-white to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>System Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryData.map((item, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    {item.icon}
                  </div>
                  {getTrendIcon(item.trend)}
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
