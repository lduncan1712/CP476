import React from "react";

export default function YearLineChart({ data }) {
    // Define chart dimensions
    const width = 800;
    const height = 300;
    const margin = { top: 40, right: 40, bottom: 70, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const maxValue = 500;

    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    // Convert dates to timestamps
    const timestamps = data.map(item => new Date(item.transactionDate).getTime());
    const minDate = Math.min(...timestamps);
    const maxDate = Math.max(...timestamps);
    const dateRange = Math.max(maxDate - minDate, 1);

    // Convert data points into SVG coordinates
    const points = data.map((item) => {
        const time = new Date(item.transactionDate).getTime();

        const x =
            margin.left +
            ((time - minDate) / dateRange) * chartWidth;

        const y =
            margin.top +
            chartHeight -
            (item.amount / maxValue) * chartHeight;

        return {
            ...item,
            x,
            y,
        };
    });

    const polylinePoints = points
        .map((p) => `${p.x},${p.y}`)
        .join(" ");

    const yTicks = [0, 200, 400, 600, 800];

    const currentYearPoint = points[points.length - 1];

    // Generate x-axis ticks every 6 months
    const tickDates = [];

    const current = new Date(minDate);
    current.setDate(1);
    current.setHours(0, 0, 0, 0);

    // Start at January or July
    current.setMonth(Math.floor(current.getMonth() / 6) * 6);

    while (current.getTime() <= maxDate) {
        const time = current.getTime();

        const x =
            margin.left +
            ((time - minDate) / dateRange) * chartWidth;

        tickDates.push({
            x,
            label: current.toLocaleDateString("en-CA", {
                month: "short",
                year: "numeric",
            }),
        });

        current.setMonth(current.getMonth() + 6);
    }

    return (
        <div>
            <h3>Expenses throughout the Years</h3>

            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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
                {tickDates.map((tick) => (
                    <line
                        key={tick.label}
                        x1={tick.x}
                        y1={margin.top}
                        x2={tick.x}
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

                {/* Data points */}
                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="2"
                        fill="#3b82f6"
                    />
                ))}

                {/* Current point marker */}
                <circle
                    cx={currentYearPoint.x}
                    cy={currentYearPoint.y}
                    r="8"
                    fill="#2563eb"
                />

                {/* X-axis labels */}
                {tickDates.map((tick) => (
                    <text
                        key={tick.label}
                        x={tick.x}
                        y={height - margin.bottom + 25}
                        textAnchor="middle"
                        fontSize="12"
                    >
                        {tick.label}
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