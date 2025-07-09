
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, MapPin, Tag } from 'lucide-react';

interface Device {
  ip: string;
  hostname: string;
  asset?: string;
  location?: string;
}

interface DeviceSelectorProps {
  devices: Device[];
  selectedDevice: string;
  onDeviceSelect: (ip: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDevice,
  onDeviceSelect
}) => {
  if (devices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No devices available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <Card
          key={device.ip}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
            selectedDevice === device.ip
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onDeviceSelect(device.ip)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedDevice === device.ip 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Monitor className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{device.hostname}</h3>
                  <p className="text-sm text-gray-500">{device.ip}</p>
                </div>
              </div>
              {selectedDevice === device.ip && (
                <Badge className="bg-blue-500">Active</Badge>
              )}
            </div>
            
            <div className="space-y-2">
              {device.asset && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span>{device.asset}</span>
                </div>
              )}
              {device.location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{device.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeviceSelector;
