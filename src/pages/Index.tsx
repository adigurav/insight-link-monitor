
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import SummaryCard from '@/components/SummaryCard';
import AlertsTable from '@/components/AlertsTable';
import TopDevices from '@/components/TopDevices';
import IPMetricSelector from '@/components/IPMetricSelector';
import MetricsChart from '@/components/MetricsChart';
import MetricsTable from '@/components/MetricsTable';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - in real app this would come from APIs
const mockDevices = {
  'cpu-memory': [
    { ip: '192.168.1.1', hostname: 'Router-Main', asset: 'RT-001' },
    { ip: '192.168.1.2', hostname: 'Switch-Core', asset: 'SW-001' },
    { ip: '192.168.1.3', hostname: 'Server-DB', asset: 'SV-001' }
  ],
  bandwidth: [
    { ip: '192.168.1.1', hostname: 'Router-Main', location: 'Data Center A', asset: 'RT-001' },
    { ip: '192.168.1.2', hostname: 'Switch-Core', location: 'Data Center A', asset: 'SW-001' },
    { ip: '192.168.1.3', hostname: 'Server-DB', location: 'Data Center B', asset: 'SV-001' }
  ],
  'link-monitoring': [
    { ip: '192.168.1.1', hostname: 'Router-Main', location: 'Data Center A', asset: 'RT-001' },
    { ip: '192.168.1.2', hostname: 'Switch-Core', location: 'Data Center A', asset: 'SW-001' },
    { ip: '192.168.1.3', hostname: 'Server-DB', location: 'Data Center B', asset: 'SV-001' }
  ],
  backup: [
    { ip: '192.168.1.10', hostname: 'Backup-Server-1', location: 'Data Center A', asset: 'BK-001' },
    { ip: '192.168.1.11', hostname: 'Backup-Server-2', location: 'Data Center B', asset: 'BK-002' }
  ]
};

const mockTopDevices = {
  'cpu-memory': [
    { ip: '192.168.1.1', hostname: 'Router-Main', utilization: 85, metric_type: 'cpu_util', status: 'critical' as const },
    { ip: '192.168.1.2', hostname: 'Switch-Core', utilization: 72, metric_type: 'mem_util', status: 'warning' as const },
    { ip: '192.168.1.3', hostname: 'Server-DB', utilization: 65, metric_type: 'cpu_util', status: 'normal' as const },
    { ip: '192.168.1.4', hostname: 'Web-Server', utilization: 58, metric_type: 'mem_util', status: 'normal' as const },
    { ip: '192.168.1.5', hostname: 'Mail-Server', utilization: 45, metric_type: 'cpu_util', status: 'normal' as const }
  ],
  bandwidth: [
    { ip: '192.168.1.1', hostname: 'Router-Main', utilization: 95, metric_type: 'in_bandwidth_util', status: 'critical' as const },
    { ip: '192.168.1.2', hostname: 'Switch-Core', utilization: 78, metric_type: 'out_bandwidth_util', status: 'warning' as const },
    { ip: '192.168.1.3', hostname: 'Server-DB', utilization: 67, metric_type: 'in_bandwidth_util', status: 'normal' as const },
    { ip: '192.168.1.6', hostname: 'Firewall', utilization: 54, metric_type: 'out_bandwidth_util', status: 'normal' as const },
    { ip: '192.168.1.7', hostname: 'Load-Balancer', utilization: 42, metric_type: 'in_bandwidth_util', status: 'normal' as const }
  ],
  'link-monitoring': [
    { ip: '192.168.1.1', hostname: 'Router-Main', utilization: 150, metric_type: 'response_time', status: 'critical' as const },
    { ip: '192.168.1.2', hostname: 'Switch-Core', utilization: 89, metric_type: 'response_time', status: 'warning' as const },
    { ip: '192.168.1.3', hostname: 'Server-DB', utilization: 45, metric_type: 'response_time', status: 'normal' as const },
    { ip: '192.168.1.8', hostname: 'Gateway', utilization: 67, metric_type: 'response_time', status: 'normal' as const },
    { ip: '192.168.1.9', hostname: 'Proxy-Server', utilization: 23, metric_type: 'response_time', status: 'normal' as const }
  ],
  backup: [
    { ip: '192.168.1.10', hostname: 'Backup-Server-1', utilization: 100, metric_type: 'backup_status', status: 'normal' as const },
    { ip: '192.168.1.11', hostname: 'Backup-Server-2', utilization: 85, metric_type: 'backup_status', status: 'warning' as const },
    { ip: '192.168.1.12', hostname: 'Storage-Array', utilization: 0, metric_type: 'backup_status', status: 'critical' as const }
  ]
};

const mockAlerts = [
  { device_ip: '192.168.1.1', metric_type: 'cpu_util', threshold: 80, value: 85, status: 'critical', timestamp: new Date().toISOString() },
  { device_ip: '192.168.1.2', metric_type: 'mem_util', threshold: 90, value: 92, status: 'warning', timestamp: new Date().toISOString() },
  { device_ip: '192.168.1.3', metric_type: 'response_time', threshold: 100, value: 150, status: 'critical', timestamp: new Date().toISOString() },
  { device_ip: '192.168.1.1', metric_type: 'in_bandwidth_util', threshold: 90, value: 95, status: 'critical', timestamp: new Date().toISOString() }
];

const mockSummary = {
  'cpu-memory': { avgCpu: 45.2, avgMemory: 62.1, totalDevices: 3 },
  bandwidth: { totalInbound: 125.4, totalOutbound: 98.7, avgUtilization: 67.3 },
  'link-monitoring': { avgResponseTime: 45.2, avgPacketLoss: 0.3, avgJitter: 2.1 },
  backup: { successfulBackups: 85, failedBackups: 3, totalBackups: 88 }
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('cpu-memory');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [summary, setSummary] = useState({});
  const [topDevices, setTopDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  // Map section to database type
  const sectionToDb = {
    'cpu-memory': 'device',
    'bandwidth': 'bandwidth',
    'link-monitoring': 'link',
    'backup': 'backup'
  };

  // Load devices and data when section changes
  const loadSectionData = useCallback(async (section) => {
    setIsLoading(true);
    try {
      const dbType = sectionToDb[section];
      // In real app, this would be API calls
      setDevices(mockDevices[section] || []);
      setSummary(mockSummary[section] || {});
      setTopDevices(mockTopDevices[section] || []);
      
      if (!selectedDevice && mockDevices[section]?.length > 0) {
        setSelectedDevice(mockDevices[section][0].ip);
      }

      // Set default metric based on section
      if (!selectedMetric) {
        const defaultMetrics = {
          'cpu-memory': 'cpu_util',
          'bandwidth': 'in_bandwidth_util',
          'link-monitoring': 'response_time',
          'backup': 'backup_status'
        };
        setSelectedMetric(defaultMetrics[section] || '');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load section data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDevice, selectedMetric, toast]);

  // Auto-refresh every 120 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadSectionData(activeSection);
      setLastRefresh(new Date());
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated",
      });
    }, 120000); // 120 seconds

    return () => clearInterval(interval);
  }, [activeSection, loadSectionData, toast]);

  // Load data when section changes
  useEffect(() => {
    loadSectionData(activeSection);
  }, [activeSection, loadSectionData]);

  const handleRefresh = () => {
    loadSectionData(activeSection);
    setLastRefresh(new Date());
    toast({
      title: "Refreshing...",
      description: "Updating dashboard data",
    });
  };

  // Filter alerts for selected device
  const deviceAlerts = alerts.filter(alert => alert.device_ip === selectedDevice);

  // Filter alerts for current section
  const sectionAlerts = alerts.filter(alert => {
    switch (activeSection) {
      case 'cpu-memory':
        return ['cpu_util', 'mem_util'].includes(alert.metric_type);
      case 'bandwidth':
        return ['in_bandwidth_util', 'out_bandwidth_util'].includes(alert.metric_type);
      case 'link-monitoring':
        return ['response_time', 'packet_loss', 'jitter', 'latency'].includes(alert.metric_type);
      case 'backup':
        return ['backup_status', 'last_backup'].includes(alert.metric_type);
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        lastRefresh={lastRefresh}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Card */}
        <SummaryCard
          summary={summary}
          section={activeSection}
          isLoading={isLoading}
        />

        {/* Active Alerts for Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Active Alerts - {activeSection.replace('-', ' ').toUpperCase()}</span>
              <span className="text-sm font-normal text-gray-500">({sectionAlerts.length} alerts)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsTable alerts={sectionAlerts} />
          </CardContent>
        </Card>

        {/* Top 5 Utilized Devices */}
        <TopDevices section={activeSection} devices={topDevices} />

        {/* IP and Metric Selection */}
        <IPMetricSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceSelect={setSelectedDevice}
          selectedMetric={selectedMetric}
          onMetricSelect={setSelectedMetric}
          section={activeSection}
          deviceAlerts={deviceAlerts}
        />

        {/* Charts and Tables for Selected Device */}
        {selectedDevice && selectedMetric && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {selectedMetric.replace('_', ' ').toUpperCase()} - {devices.find(d => d.ip === selectedDevice)?.hostname}
                  </span>
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
                <CardTitle>Recent Metrics Data</CardTitle>
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
      </div>
    </div>
  );
};

export default Index;
