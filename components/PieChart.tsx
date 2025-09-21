import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  if (data.length === 0) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex-grow flex items-center justify-center text-gray-500">
                No data available.
            </div>
        </div>
    );
  }
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercentage = 0;
  const gradientParts = data.map(item => {
    const percentage = (item.value / total) * 100;
    const start = cumulativePercentage;
    cumulativePercentage += percentage;
    const end = cumulativePercentage;
    return `${item.color} ${start}% ${end}%`;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-6">
        <div 
          className="w-40 h-40 rounded-full"
          style={{ background: conicGradient }}
          role="img"
          aria-label={title}
        ></div>
        <div className="w-full md:w-auto">
          <ul className="space-y-2">
            {data.map(item => (
              <li key={item.label} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-700">{item.label}</span>
                <span className="ml-auto font-semibold text-gray-800">
                    {((item.value / total) * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
