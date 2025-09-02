    'use client';

    export default function AnalyticsChart({ data, variant }) {
      // Simplified chart simulation
      return (
        <div className="bg-surface p-md rounded-lg shadow-card">
          <h3 className="text-body font-bold mb-md">Campaign Performance</h3>
          {variant === 'bar' && (
            <div className="flex space-x-sm">
              {data.map((camp) => (
                <div key={camp.id} className="bg-accent h-20 w-10 rounded-sm" style={{ height: `${camp.metrics.reach / 100}px` }}></div>
              ))}
            </div>
          )}
          <p className="text-body mt-md">Reach: {data.reduce((sum, c) => sum + c.metrics.reach, 0)}</p>
        </div>
      );
    }
  