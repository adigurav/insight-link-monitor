
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsChartProps {
  deviceIp: string;
  section: string;
  dbType: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ deviceIp, section, dbType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState<any>(null);

  // Generate mock data based on section
  const generateMockData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      let value;
      
      switch (section) {
        case 'cpu-memory':
          value = Math.random() * 80 + 10; // 10-90%
          break;
        case 'bandwidth':
          value = Math.random() * 100 + 20; // 20-120 Mbps
          break;
        case 'link-monitoring':
          value = Math.random() * 150 + 10; // 10-160 ms for response time
          break;
        default:
          value = Math.random() * 100;
      }
      
      data.push({
        x: timestamp.toISOString(),
        y: Math.round(value * 100) / 100
      });
    }
    
    return data;
  };

  const getChartConfig = () => {
    let yAxisLabel, title, color;
    
    switch (section) {
      case 'cpu-memory':
        yAxisLabel = 'Usage (%)';
        title = 'CPU & Memory Utilization';
        color = 'rgb(59, 130, 246)'; // blue
        break;
      case 'bandwidth':
        yAxisLabel = 'Bandwidth (Mbps)';
        title = 'Network Bandwidth Usage';
        color = 'rgb(34, 197, 94)'; // green
        break;
      case 'link-monitoring':
        yAxisLabel = 'Response Time (ms)';
        title = 'Link Performance Metrics';
        color = 'rgb(168, 85, 247)'; // purple
        break;
      default:
        yAxisLabel = 'Value';
        title = 'Metrics';
        color = 'rgb(107, 114, 128)'; // gray
    }
    
    return { yAxisLabel, title, color };
  };

  useEffect(() => {
    const loadChart = async () => {
      setIsLoading(true);
      
      try {
        // Dynamically import Chart.js to avoid SSR issues
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Destroy existing chart
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const mockData = generateMockData();
        const { yAxisLabel, title, color } = getChartConfig();
        
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [{
              label: title,
              data: mockData,
              borderColor: color,
              backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${title} - Last 24 Hours`,
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour',
                  displayFormats: {
                    hour: 'HH:mm'
                  }
                },
                title: {
                  display: true,
                  text: 'Time'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: yAxisLabel
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            },
            elements: {
              point: {
                hoverBackgroundColor: color,
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 2
              }
            }
          }
        });
        
        setChartInstance(newChart);
      } catch (error) {
        console.error('Error loading chart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChart();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [deviceIp, section]);

  if (isLoading) {
    return (
      <div className="h-96 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="h-96 relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default MetricsChart;
