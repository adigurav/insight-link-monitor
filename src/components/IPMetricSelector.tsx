
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, AlertTriangle } from 'lucide-react';

interface Device {
  ip: string;
  hostname: string;
  asset?: string;
  location?: string;
}

interface IPMetricSelectorProps {
  devices: Device[];
  selectedDevice: string;
  onDeviceSelect: (ip: string) => void;
  selectedMetric: string;
  onMetricSelect: (metric: string) => void;
  section: string;
  deviceAlerts: any[];
}

const IPMetricSelector: React.FC<IPMetricSelectorProps> = ({
  devices,
  selectedDevice,
  onDeviceSelect,
  selectedMetric,
  onMetricSelect,
  section,
  deviceAlerts
}) => {
  const getMetricOptions = () => {
    switch (section) {
      case 'cpu-memory':
        return [
          { value: 'cpu_util', label: 'CPU Utilization' },
          { value: 'mem_util', label: 'Memory Utilization' }
        ];
      case 'bandwidth':
        return [
          { value: 'in_bandwidth_util', label: 'Inbound Bandwidth' },
          { value: 'out_bandwidth_util', label: 'Outbound Bandwidth' }
        ];
      case 'link-monitoring':
        return [
          { value: 'response_time', label: 'Response Time' },
          { value: 'packet_loss', label: 'Packet Loss' },
          { value: 'jitter', label: 'Jitter' },
          { value: 'latency', label: 'Latency' }
        ];
      case 'backup':
        return [
          { value: 'backup_status', label: 'Backup Status' },
          { value: 'last_backup', label: 'Last Backup Time' }
        ];
      default:
        return [];
    }
  };

  const selectedDeviceInfo = devices.find(d => d.ip === selectedDevice);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Device & Metric Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Device Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Device</label>
            <Select value={selectedDevice} onValueChange={onDeviceSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.ip} value={device.ip}>
                    <div className="flex flex-col">
                      <span className="font-medium">{device.hostname}</span>
                      <span className="text-xs text-gray-500">{device.ip}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Metric Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Metric</label>
            <Select value={selectedMetric} onValueChange={onMetricSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a metric" />
              </SelectTrigger>
              <SelectContent>
                {getMetricOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Device Info */}
        {selectedDeviceInfo && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Selected Device Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Hostname:</span>
                <span className="ml-2 font-medium">{selectedDeviceInfo.hostname}</span>
              </div>
              <div>
                <span className="text-gray-600">IP:</span>
                <span className="ml-2 font-medium">{selectedDeviceInfo.ip}</span>
              </div>
              {selectedDeviceInfo.asset && (
                <div>
                  <span className="text-gray-600">Asset:</span>
                  <span className="ml-2 font-medium">{selectedDeviceInfo.asset}</span>
                </div>
              )}
              {selectedDeviceInfo.location && (
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{selectedDeviceInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Device Alerts */}
        {deviceAlerts.length > 0 && (
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-900">Active Alerts for Selected Device</h4>
            </div>
            <div className="space-y-2">
              {deviceAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{alert.metric_type}</span>
                  <Badge variant="destructive">{alert.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IPMetricSelector;
