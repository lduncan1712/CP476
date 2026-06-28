import React from "react";

export default function LineChart({data}) {
    // Define chart dimensions
    const width = 800;
    const height = 300;
    const margin = {top: 40, right: 40, bottom: 70, left: 80};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const maxValue = 800;

    // Convert data points into SVG coordinates
    const points = data.map((item, index) => {
        const x = 
        margin.left +
        (index * chartWidth) / (data.length - 1);

        const y =
        margin.top +
        chartHeight -
        (item.amount / maxValue) * chartHeight;

        const xAxis = item.transactionDate.getFullYear();
        
        return { ...item, x, y, dateStr: xAxis};//};
    });

    const polylinePoints = points
        .map((p) => `${p.x},${p.y}`)
        .join(" ");

    const yTicks = [0, 200, 400, 600, 800];

    const currentYearPoint = points[points.length - 1];

    return (
        <div>
        <text
            x={margin.left}
            y={25}
            fontFamily="Georgia, serif"
            fontSize="20"
            fontWeight="normal"
            fill="#4b5563"
        >
            Expenses throughout the Years
        </text>

        <svg width={width} height={height}>
            {/* Horizontal grid lines */}
            {yTicks.map((tick) => {
            const y =
                margin.top +
                chartHeight -
                (tick / maxValue) * chartHeight;

            return (
                <g key={tick}>
                <line
                    x1={margin.left}
                    y1={y}
                    x2={width - margin.right}
                    y2={y}
                    stroke="#d0d0d0"
                />

                <text
                    x={margin.left - 10}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="12"
                >
                    ${tick.toFixed(2)}
                </text>
                </g>
            );
            })}

            {/* Vertical grid lines */}
            {points.map((point) => (
            <line
                key={point.dateStr}
                x1={point.x}
                y1={margin.top}
                x2={point.x}
                y2={height - margin.bottom}
                stroke="#d0d0d0"
            />
            ))}

            {/* X axis */}
            <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="black"
            />

            {/* Y axis */}
            <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="black"
            />

            {/* Line */}
            <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={polylinePoints}
            />

            {/* Current year marker */}
            <circle
            cx={currentYearPoint.x}
            cy={currentYearPoint.y}
            r="8"
            fill="#2563eb"
            />

            {/* Year labels */}
            {points.map((point) => (
            <text
                key={point.dateStr}
                x={point.x}
                y={height - margin.bottom + 25}
                textAnchor="middle"
                fontSize="12"
            >
                {point.dateStr}
            </text>
            ))}

            {/* X-axis title */}
            <text
            x={width / 2}
            y={height - 15}
            textAnchor="middle"
            fontSize="14"
            >
            Year
            </text>

            {/* Y-axis title */}
            <text
            transform={`translate(25 ${
                margin.top + chartHeight / 2
            }) rotate(-90)`}
            textAnchor="middle"
            fontSize="14"
            >
            Amount
            </text>
        </svg>
        </div>
    );
}