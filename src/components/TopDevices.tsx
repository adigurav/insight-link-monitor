
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Server, AlertTriangle } from 'lucide-react';

interface TopDevice {
  ip: string;
  hostname: string;
  utilization: number;
  metric_type: string;
  status: 'normal' | 'warning' | 'critical';
}

interface TopDevicesProps {
  section: string;
  devices: TopDevice[];
}

const TopDevices: React.FC<TopDevicesProps> = ({ section, devices }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getSectionTitle = () => {
    switch (section) {
      case 'cpu-memory':
        return 'Top CPU/Memory Utilized Devices';
      case 'bandwidth':
        return 'Top Bandwidth Utilized Devices';
      case 'link-monitoring':
        return 'Top Response Time Devices';
      case 'backup':
        return 'Backup Status Overview';
      default:
        return 'Top Utilized Devices';
    }
  };

  const getMetricUnit = (metricType: string) => {
    if (metricType.includes('util')) return '%';
    if (['response_time', 'latency'].includes(metricType)) return 'ms';
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>{getSectionTitle()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device, index) => (
            <div key={device.ip} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <Server className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">{device.hostname}</p>
                  <p className="text-sm text-gray-500">{device.ip}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {device.utilization}{getMetricUnit(device.metric_type)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{device.metric_type.replace('_', ' ')}</p>
                </div>
                <Badge className={getStatusColor(device.status)}>
                  {device.status === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {device.status}
                </Badge>
              </div>
            </div>
          ))}
          {devices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No device data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDevices;
