'use client';

import { useState } from 'react';

export default function AnalyticsChart({ data, variant = 'bar' }) {
  const [metric, setMetric] = useState('reach');
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-md rounded-lg shadow-card h-40 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }
  
  // Find the maximum value for the selected metric
  const maxValue = Math.max(...data.map(item => item.metrics[metric]));
  
  // Calculate bar heights or line points
  const getBarHeight = (value) => {
    return (value / maxValue) * 100;
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toString();
    }
  };
  
  return (
    <div className="bg-surface p-md rounded-lg shadow-card">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-body font-bold">Campaign Performance</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMetric('reach')}
            className={`text-xs px-2 py-1 rounded-full ${
              metric === 'reach' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Reach
          </button>
          <button
            onClick={() => setMetric('engagement')}
            className={`text-xs px-2 py-1 rounded-full ${
              metric === 'engagement' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Engagement
          </button>
        </div>
      </div>
      
      {variant === 'bar' && (
        <div className="h-60 flex items-end space-x-2">
          {data.map((item) => (
            <div key={item.id} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center mb-2">
                <div 
                  className="bg-accent w-4/5 rounded-t"
                  style={{ height: `${getBarHeight(item.metrics[metric])}%` }}
                ></div>
              </div>
              <div className="text-xs text-center truncate w-full" title={item.title}>
                {item.title.length > 10 ? `${item.title.substring(0, 10)}...` : item.title}
              </div>
              <div className="text-xs text-gray-500">
                {formatNumber(item.metrics[metric])}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {variant === 'line' && (
        <div className="h-60 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
            <div>{formatNumber(maxValue)}</div>
            <div>{formatNumber(maxValue * 0.75)}</div>
            <div>{formatNumber(maxValue * 0.5)}</div>
            <div>{formatNumber(maxValue * 0.25)}</div>
            <div>0</div>
          </div>
          
          {/* Chart area */}
          <div className="absolute left-10 right-0 top-0 bottom-0">
            {/* Horizontal grid lines */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
            
            {/* Line chart */}
            <svg className="absolute inset-0 h-full w-full">
              <polyline
                points={data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - getBarHeight(item.metrics[metric]);
                  return `${x}% ${y}%`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - getBarHeight(item.metrics[metric]);
                return (
                  <circle
                    key={item.id}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#10b981"
                  />
                );
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-500 transform translate-y-4">
              {data.map((item) => (
                <div key={item.id} className="truncate" style={{ maxWidth: '60px' }}>
                  {item.title.length > 8 ? `${item.title.substring(0, 8)}...` : item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

