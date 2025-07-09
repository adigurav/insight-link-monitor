
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  lastRefresh: Date;
  onRefresh: () => void;
  isLoading: boolean;
}

const navigationItems = [
  { id: 'cpu-memory', label: 'CPU & Memory' },
  { id: 'bandwidth', label: 'Bandwidth' },
  { id: 'backup', label: 'Backup' },
  { id: 'link-monitoring', label: 'Link Monitor' }
];

const Navbar: React.FC<NavbarProps> = ({ 
  activeSection, 
  setActiveSection, 
  lastRefresh, 
  onRefresh, 
  isLoading 
}) => {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo and Dashboard name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Network Monitor Dashboard</h1>
              <Badge variant="outline" className="text-xs">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </Badge>
            </div>
          </div>

          {/* Center - Navigation Options */}
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(item.id)}
                className={`transition-all ${
                  activeSection === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right side - Refresh button */}
          <Button onClick={onRefresh} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
