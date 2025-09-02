'use client';

import { useEffect, useRef } from 'react';

export default function AnalyticsChart({ data, variant = 'bar' }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Clear previous chart
    chartRef.current.innerHTML = '';

    if (variant === 'bar') {
      renderBarChart();
    } else if (variant === 'line') {
      renderLineChart();
    } else if (variant === 'pie') {
      renderPieChart();
    }
  }, [data, variant]);

  const renderBarChart = () => {
    const container = chartRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(item => 
      item.metrics ? item.metrics.reach || 0 : (item.impressions || 0)
    ));

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    container.appendChild(svg);

    // Create chart group
    const chart = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chart.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    svg.appendChild(chart);

    // Create bars
    const barWidth = chartWidth / data.length - 10;
    
    data.forEach((item, index) => {
      const value = item.metrics ? item.metrics.reach || 0 : (item.impressions || 0);
      const barHeight = (value / maxValue) * chartHeight;
      const x = index * (barWidth + 10);
      const y = chartHeight - barHeight;

      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x);
      bar.setAttribute('y', y);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', barHeight);
      bar.setAttribute('fill', '#4F46E5');
      bar.setAttribute('rx', '2');
      
      // Add tooltip on hover
      bar.addEventListener('mouseover', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-xs';
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.textContent = `${item.title || item.date || `Item ${index + 1}`}: ${value.toLocaleString()}`;
        document.body.appendChild(tooltip);
        
        bar.setAttribute('fill', '#6366F1');
        
        bar.addEventListener('mousemove', (e) => {
          tooltip.style.left = `${e.pageX}px`;
          tooltip.style.top = `${e.pageY - 30}px`;
        });
        
        bar.addEventListener('mouseout', () => {
          document.body.removeChild(tooltip);
          bar.setAttribute('fill', '#4F46E5');
        });
      });
      
      chart.appendChild(bar);
      
      // Add label
      if (data.length <= 12) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x + barWidth / 2);
        label.setAttribute('y', chartHeight + 15);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#6B7280');
        label.textContent = item.title || item.date || `Item ${index + 1}`;
        chart.appendChild(label);
      }
    });
  };

  const renderLineChart = () => {
    const container = chartRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max values for scaling
    const maxImpressions = Math.max(...data.map(item => item.impressions || 0));
    const maxEngagement = Math.max(...data.map(item => item.engagement || 0));

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    container.appendChild(svg);

    // Create chart group
    const chart = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chart.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    svg.appendChild(chart);

    // Create x-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', '#E5E7EB');
    chart.appendChild(xAxis);

    // Create y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', '#E5E7EB');
    chart.appendChild(yAxis);

    // Create impressions line
    let impressionsPath = `M0,${chartHeight - (data[0].impressions / maxImpressions) * chartHeight}`;
    data.forEach((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - (item.impressions / maxImpressions) * chartHeight;
      impressionsPath += ` L${x},${y}`;
    });

    const impressionsLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    impressionsLine.setAttribute('d', impressionsPath);
    impressionsLine.setAttribute('fill', 'none');
    impressionsLine.setAttribute('stroke', '#4F46E5');
    impressionsLine.setAttribute('stroke-width', '2');
    chart.appendChild(impressionsLine);

    // Create engagement line
    let engagementPath = `M0,${chartHeight - (data[0].engagement / maxEngagement) * chartHeight}`;
    data.forEach((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - (item.engagement / maxEngagement) * chartHeight;
      engagementPath += ` L${x},${y}`;
    });

    const engagementLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    engagementLine.setAttribute('d', engagementPath);
    engagementLine.setAttribute('fill', 'none');
    engagementLine.setAttribute('stroke', '#10B981');
    engagementLine.setAttribute('stroke-width', '2');
    chart.appendChild(engagementLine);

    // Add data points
    data.forEach((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      
      // Impressions point
      const impressionsY = chartHeight - (item.impressions / maxImpressions) * chartHeight;
      const impressionsPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      impressionsPoint.setAttribute('cx', x);
      impressionsPoint.setAttribute('cy', impressionsY);
      impressionsPoint.setAttribute('r', '3');
      impressionsPoint.setAttribute('fill', '#4F46E5');
      chart.appendChild(impressionsPoint);
      
      // Engagement point
      const engagementY = chartHeight - (item.engagement / maxEngagement) * chartHeight;
      const engagementPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      engagementPoint.setAttribute('cx', x);
      engagementPoint.setAttribute('cy', engagementY);
      engagementPoint.setAttribute('r', '3');
      engagementPoint.setAttribute('fill', '#10B981');
      chart.appendChild(engagementPoint);
      
      // Add tooltip on hover
      impressionsPoint.addEventListener('mouseover', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-xs';
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.textContent = `${item.date}: ${item.impressions.toLocaleString()} impressions`;
        document.body.appendChild(tooltip);
        
        impressionsPoint.setAttribute('r', '5');
        
        impressionsPoint.addEventListener('mousemove', (e) => {
          tooltip.style.left = `${e.pageX}px`;
          tooltip.style.top = `${e.pageY - 30}px`;
        });
        
        impressionsPoint.addEventListener('mouseout', () => {
          document.body.removeChild(tooltip);
          impressionsPoint.setAttribute('r', '3');
        });
      });
      
      engagementPoint.addEventListener('mouseover', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-xs';
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.textContent = `${item.date}: ${item.engagement.toLocaleString()} engagement`;
        document.body.appendChild(tooltip);
        
        engagementPoint.setAttribute('r', '5');
        
        engagementPoint.addEventListener('mousemove', (e) => {
          tooltip.style.left = `${e.pageX}px`;
          tooltip.style.top = `${e.pageY - 30}px`;
        });
        
        engagementPoint.addEventListener('mouseout', () => {
          document.body.removeChild(tooltip);
          engagementPoint.setAttribute('r', '3');
        });
      });
      
      // Add x-axis labels
      if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', chartHeight + 15);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#6B7280');
        label.textContent = item.date;
        chart.appendChild(label);
      }
    });

    // Add legend
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('transform', `translate(${chartWidth - 150}, 10)`);
    chart.appendChild(legendGroup);

    // Impressions legend
    const impressionsLegendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    impressionsLegendLine.setAttribute('x1', 0);
    impressionsLegendLine.setAttribute('y1', 5);
    impressionsLegendLine.setAttribute('x2', 20);
    impressionsLegendLine.setAttribute('y2', 5);
    impressionsLegendLine.setAttribute('stroke', '#4F46E5');
    impressionsLegendLine.setAttribute('stroke-width', '2');
    legendGroup.appendChild(impressionsLegendLine);

    const impressionsLegendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    impressionsLegendText.setAttribute('x', 25);
    impressionsLegendText.setAttribute('y', 9);
    impressionsLegendText.setAttribute('font-size', '10');
    impressionsLegendText.setAttribute('fill', '#6B7280');
    impressionsLegendText.textContent = 'Impressions';
    legendGroup.appendChild(impressionsLegendText);

    // Engagement legend
    const engagementLegendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    engagementLegendLine.setAttribute('x1', 0);
    engagementLegendLine.setAttribute('y1', 20);
    engagementLegendLine.setAttribute('x2', 20);
    engagementLegendLine.setAttribute('y2', 20);
    engagementLegendLine.setAttribute('stroke', '#10B981');
    engagementLegendLine.setAttribute('stroke-width', '2');
    legendGroup.appendChild(engagementLegendLine);

    const engagementLegendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    engagementLegendText.setAttribute('x', 25);
    engagementLegendText.setAttribute('y', 24);
    engagementLegendText.setAttribute('font-size', '10');
    engagementLegendText.setAttribute('fill', '#6B7280');
    engagementLegendText.textContent = 'Engagement';
    legendGroup.appendChild(engagementLegendText);
  };

  const renderPieChart = () => {
    const container = chartRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    container.appendChild(svg);
    
    // Create chart group
    const chart = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chart.setAttribute('transform', `translate(${width / 2}, ${height / 2})`);
    svg.appendChild(chart);
    
    // Calculate total value
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    
    // Define colors
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
    
    // Draw pie slices
    let startAngle = 0;
    
    data.forEach((item, index) => {
      const value = item.value || 0;
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Calculate path
      const x1 = radius * Math.cos(startAngle);
      const y1 = radius * Math.sin(startAngle);
      const x2 = radius * Math.cos(endAngle);
      const y2 = radius * Math.sin(endAngle);
      
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
      
      const pathData = `M0,0 L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
      
      const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      slice.setAttribute('d', pathData);
      slice.setAttribute('fill', colors[index % colors.length]);
      chart.appendChild(slice);
      
      // Add tooltip on hover
      slice.addEventListener('mouseover', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-xs';
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.textContent = `${item.label}: ${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`;
        document.body.appendChild(tooltip);
        
        slice.setAttribute('opacity', '0.8');
        
        slice.addEventListener('mousemove', (e) => {
          tooltip.style.left = `${e.pageX}px`;
          tooltip.style.top = `${e.pageY - 30}px`;
        });
        
        slice.addEventListener('mouseout', () => {
          document.body.removeChild(tooltip);
          slice.setAttribute('opacity', '1');
        });
      });
      
      startAngle = endAngle;
    });
  };

  // Simplified chart for MVP
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div ref={chartRef} className="w-full h-full"></div>
  );
}

