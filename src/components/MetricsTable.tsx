
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface Metric {
  timestamp: string;
  metric_type: string;
  value: number;
}

interface MetricsTableProps {
  deviceIp: string;
  section: string;
  dbType: string;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ deviceIp, section, dbType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // Generate mock metrics data
  const generateMockMetrics = () => {
    const mockMetrics: Metric[] = [];
    const now = new Date();
    
    const metricTypes = {
      'cpu-memory': ['cpu_util', 'mem_util'],
      'bandwidth': ['in_bandwidth_util', 'out_bandwidth_util'],
      'link-monitoring': ['response_time', 'jitter', 'packet_loss', 'latency', 'throughput']
    };
    
    const sectionMetrics = metricTypes[section as keyof typeof metricTypes] || ['unknown'];
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - i * 2 * 60 * 1000); // Every 2 minutes
      const metricType = sectionMetrics[Math.floor(Math.random() * sectionMetrics.length)];
      
      let value;
      switch (metricType) {
        case 'cpu_util':
        case 'mem_util':
          value = Math.random() * 80 + 10;
          break;
        case 'in_bandwidth_util':
        case 'out_bandwidth_util':
          value = Math.random() * 100 + 20;
          break;
        case 'response_time':
        case 'latency':
          value = Math.random() * 150 + 10;
          break;
        case 'jitter':
          value = Math.random() * 10 + 1;
          break;
        case 'packet_loss':
          value = Math.random() * 2;
          break;
        case 'throughput':
          value = Math.random() * 1000 + 100;
          break;
        default:
          value = Math.random() * 100;
      }
      
      mockMetrics.push({
        timestamp: timestamp.toISOString(),
        metric_type: metricType,
        value: Math.round(value * 100) / 100
      });
    }
    
    return mockMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics(generateMockMetrics());
      setIsLoading(false);
      setCurrentPage(1);
    }, 500);
  }, [deviceIp, section]);

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

  const getValueUnit = (metricType: string) => {
    if (metricType.includes('util')) return '%';
    if (['response_time', 'latency', 'jitter'].includes(metricType)) return 'ms';
    if (metricType === 'packet_loss') return '%';
    if (metricType === 'throughput') return 'Mbps';
    if (metricType.includes('bandwidth')) return 'Mbps';
    return '';
  };

  const getValueColor = (metricType: string, value: number) => {
    switch (metricType) {
      case 'cpu_util':
      case 'mem_util':
        if (value > 80) return 'text-red-600';
        if (value > 60) return 'text-yellow-600';
        return 'text-green-600';
      case 'response_time':
      case 'latency':
        if (value > 100) return 'text-red-600';
        if (value > 50) return 'text-yellow-600';
        return 'text-green-600';
      case 'packet_loss':
        if (value > 1) return 'text-red-600';
        if (value > 0.5) return 'text-yellow-600';
        return 'text-green-600';
      default:
        return 'text-gray-900';
    }
  };

  const totalPages = Math.ceil(metrics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMetrics = metrics.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    const csvContent = [
      ['Timestamp', 'Metric Type', 'Value', 'Unit'],
      ...metrics.map(metric => [
        formatTimestamp(metric.timestamp),
        getMetricTypeLabel(metric.metric_type),
        metric.value,
        getValueUnit(metric.metric_type)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-${deviceIp}-${section}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{metrics.length} records</Badge>
        </div>
        <Button onClick={handleExportCSV} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Metric Type</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMetrics.map((metric, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm">
                  {formatTimestamp(metric.timestamp)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getMetricTypeLabel(metric.metric_type)}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-mono font-semibold ${getValueColor(metric.metric_type, metric.value)}`}>
                  {metric.value} {getValueUnit(metric.metric_type)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, metrics.length)} of {metrics.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
