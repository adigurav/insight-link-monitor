
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Clock } from 'lucide-react';

interface Alert {
  device_ip: string;
  metric_type: string;
  threshold: number;
  value: number;
  status: string;
  timestamp: string;
}

interface AlertsTableProps {
  alerts: Alert[];
}

const AlertsTable: React.FC<AlertsTableProps> = ({ alerts }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMetricTypeLabel = (metricType: string) => {
    const labels = {
      'cpu_util': 'CPU Utilization',
      'mem_util': 'Memory Utilization',
      'in_bandwidth_util': 'Inbound Bandwidth',
      'out_bandwidth_util': 'Outbound Bandwidth',
      'response_time': 'Response Time',
      'packet_loss': 'Packet Loss',
      'jitter': 'Jitter',
      'latency': 'Latency',
      'throughput': 'Throughput'
    };
    return labels[metricType] || metricType;
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No active alerts</p>
        <p className="text-sm">All systems operating normally</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.slice(0, 10).map((alert, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>{alert.device_ip}</span>
                </div>
              </TableCell>
              <TableCell>{getMetricTypeLabel(alert.metric_type)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(alert.status)} className="capitalize">
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">
                {alert.value}
                {alert.metric_type.includes('util') ? '%' : 
                 alert.metric_type.includes('time') || alert.metric_type === 'jitter' ? 'ms' : ''}
              </TableCell>
              <TableCell className="font-mono text-gray-500">
                {alert.threshold}
                {alert.metric_type.includes('util') ? '%' : 
                 alert.metric_type.includes('time') || alert.metric_type === 'jitter' ? 'ms' : ''}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimestamp(alert.timestamp)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {alerts.length > 10 && (
        <div className="text-center py-4 text-sm text-gray-500">
          Showing 10 of {alerts.length} alerts
        </div>
      )}
    </div>
  );
};

export default AlertsTable;
