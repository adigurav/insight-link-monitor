
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cpu, HardDrive, Activity, Wifi, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import DeviceSelector from '@/components/DeviceSelector';
import SummaryCard from '@/components/SummaryCard';
import AlertsTable from '@/components/AlertsTable';
import MetricsChart from '@/components/MetricsChart';
import MetricsTable from '@/components/MetricsTable';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - in real app this would come from APIs
const mockDevices = {
  device: [
    { ip: '192.168.1.1', hostname: 'Router-Main', asset: 'RT-001' },
    { ip: '192.168.1.2', hostname: 'Switch-Core', asset: 'SW-001' },
    { ip: '192.168.1.3', hostname: 'Server-DB', asset: 'SV-001' }
  ],
  bandwidth: [
    { ip: '192.168.1.1', hostname: 'Router-Main', location: 'Data Center A', asset: 'RT-001' },
    { ip: '192.168.1.2', hostname: 'Switch-Core', location: 'Data Center A', asset: 'SW-001' },
    { ip: '192.168.1.3', hostname: 'Server-DB', location: 'Data Center B', asset: 'SV-001' }
  ],
  link: [
    { ip: '192.168.1.1', hostname: 'Router-Main', location: 'Data Center A', asset: 'RT-001' },
    { ip: '192.168.1.2', hostname: 'Switch-Core', location: 'Data Center A', asset: 'SW-001' },
    { ip: '192.168.1.3', hostname: 'Server-DB', location: 'Data Center B', asset: 'SV-001' }
  ]
};

const mockAlerts = [
  { device_ip: '192.168.1.1', metric_type: 'cpu_util', threshold: 80, value: 85, status: 'critical', timestamp: new Date().toISOString() },
  { device_ip: '192.168.1.2', metric_type: 'mem_util', threshold: 90, value: 92, status: 'warning', timestamp: new Date().toISOString() },
  { device_ip: '192.168.1.3', metric_type: 'response_time', threshold: 100, value: 150, status: 'critical', timestamp: new Date().toISOString() }
];

const mockSummary = {
  device: { avgCpu: 45.2, avgMemory: 62.1, totalDevices: 3 },
  bandwidth: { totalInbound: 125.4, totalOutbound: 98.7, avgUtilization: 67.3 },
  link: { avgResponseTime: 45.2, avgPacketLoss: 0.3, avgJitter: 2.1 }
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('cpu-memory');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  // Map section to database type
  const sectionToDb = {
    'cpu-memory': 'device',
    'bandwidth': 'bandwidth',
    'link-monitoring': 'link'
  };

  // Load devices when section changes
  const loadDevices = useCallback(async (section) => {
    setIsLoading(true);
    try {
      const dbType = sectionToDb[section];
      // In real app, this would be an API call
      // const response = await axios.get(`/api/devices/${dbType}`);
      setDevices(mockDevices[dbType] || []);
      setSummary(mockSummary[dbType] || {});
      if (!selectedDevice && mockDevices[dbType]?.length > 0) {
        setSelectedDevice(mockDevices[dbType][0].ip);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load devices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDevice, toast]);

  // Auto-refresh every 120 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDevices(activeSection);
      setLastRefresh(new Date());
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated",
      });
    }, 120000); // 120 seconds

    return () => clearInterval(interval);
  }, [activeSection, loadDevices, toast]);

  // Load data when section changes
  useEffect(() => {
    loadDevices(activeSection);
  }, [activeSection, loadDevices]);

  const handleRefresh = () => {
    loadDevices(activeSection);
    setLastRefresh(new Date());
    toast({
      title: "Refreshing...",
      description: "Updating dashboard data",
    });
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'cpu-memory':
        return <Cpu className="h-4 w-4" />;
      case 'bandwidth':
        return <Activity className="h-4 w-4" />;
      case 'link-monitoring':
        return <Wifi className="h-4 w-4" />;
      default:
        return <HardDrive className="h-4 w-4" />;
    }
  };

  const getSectionTitle = (section) => {
    switch (section) {
      case 'cpu-memory':
        return 'CPU & Memory Monitoring';
      case 'bandwidth':
        return 'Bandwidth Monitoring';
      case 'link-monitoring':
        return 'Link Monitoring';
      default:
        return 'System Monitoring';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Network Monitor</h1>
                <p className="text-sm text-gray-500">Real-time Infrastructure Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </Badge>
              <Button onClick={handleRefresh} size="sm" variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Navigation Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
            <TabsTrigger value="cpu-memory" className="flex items-center space-x-2">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">CPU & Memory</span>
              <span className="sm:hidden">CPU</span>
            </TabsTrigger>
            <TabsTrigger value="bandwidth" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Bandwidth</span>
              <span className="sm:hidden">BW</span>
            </TabsTrigger>
            <TabsTrigger value="link-monitoring" className="flex items-center space-x-2">
              <Wifi className="h-4 w-4" />
              <span className="hidden sm:inline">Link Monitor</span>
              <span className="sm:hidden">Link</span>
            </TabsTrigger>
          </TabsList>

          {/* Section Content */}
          <TabsContent value={activeSection} className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center space-x-3 mb-6">
              {getSectionIcon(activeSection)}
              <h2 className="text-xl font-semibold text-gray-900">
                {getSectionTitle(activeSection)}
              </h2>
            </div>

            {/* Device Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Device Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceSelector
                  devices={devices}
                  selectedDevice={selectedDevice}
                  onDeviceSelect={setSelectedDevice}
                />
              </CardContent>
            </Card>

            {/* Summary Card */}
            <SummaryCard
              summary={summary}
              section={activeSection}
              isLoading={isLoading}
            />

            {/* Global Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Active Alerts</span>
                  <Badge variant="destructive">{alerts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertsTable alerts={alerts} />
              </CardContent>
            </Card>

            {/* Charts and Tables */}
            {selectedDevice && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Metrics Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Metrics Overview - {devices.find(d => d.ip === selectedDevice)?.hostname}</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricsChart
                      deviceIp={selectedDevice}
                      section={activeSection}
                      dbType={sectionToDb[activeSection]}
                    />
                  </CardContent>
                </Card>

                {/* Metrics Table */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricsTable
                      deviceIp={selectedDevice}
                      section={activeSection}
                      dbType={sectionToDb[activeSection]}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {!selectedDevice && devices.length === 0 && !isLoading && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No devices found for this monitoring section. Please check your data sources.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
