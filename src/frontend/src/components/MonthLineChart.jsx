import React from "react";

export default function MonthLineChart({
    data = [],
    overlayOn = true,
    width = "100%",
    height = 320
}) {

    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 320;

    const today = new Date();

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const previousDate = new Date(currentYear, currentMonth - 1);

    const previousMonth = previousDate.getMonth();
    const previousYear = previousDate.getFullYear();

    const daysInCurrentMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    const margin = {
        top: 65,
        right: 40,
        bottom: 60,
        left: 75
    };

    const chartWidth =
        VIEWBOX_WIDTH - margin.left - margin.right;

    const chartHeight =
        VIEWBOX_HEIGHT - margin.top - margin.bottom;

    // --------------------------
    // Filter Data
    // --------------------------

    const currentMonthData = data.filter(item => {

        const d = item.transactionDate;

        return (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
        );

    });

    const previousMonthData = overlayOn
        ? data.filter(item => {

              const d = item.transactionDate;

              return (
                  d.getMonth() === previousMonth &&
                  d.getFullYear() === previousYear
              );

          })
        : [];

    // --------------------------
    // Build cumulative totals
    // --------------------------

    function groupByDay(data, daysInMonth) {

        const totals = {};

        data.forEach(item => {

            const day = item.transactionDate.getDate();

            totals[day] = (totals[day] || 0) + item.amount;

        });

        const cumulative = [];

        let running = 0;

        for (let day = 1; day <= daysInMonth; day++) {

            running += totals[day] || 0;

            cumulative.push({
                day,
                amount: running
            });

        }

        return cumulative;

    }

    const current =
        groupByDay(currentMonthData, daysInCurrentMonth);

    const previous =
        groupByDay(previousMonthData, daysInCurrentMonth);

    // --------------------------
    // Scale
    // --------------------------

    const maxValue = Math.max(
        ...current.map(d => d.amount),
        ...previous.map(d => d.amount),
        1
    );

    function toPoints(data) {

        return data.map(item => {

            const x =
                margin.left +
                ((item.day - 1) /
                    (daysInCurrentMonth - 1)) *
                    chartWidth;

            const y =
                margin.top +
                chartHeight -
                (item.amount / maxValue) *
                    chartHeight;

            return {
                ...item,
                x,
                y
            };

        });

    }

    const currentPoints = toPoints(current);
    const previousPoints = toPoints(previous);

    function buildPath(points) {

        if (!points.length) return "";

        return points.reduce((path, point, index) => {

            return (
                path +
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y} `
            );

        }, "");

    }

    const currentPath = buildPath(currentPoints);
    const previousPath = buildPath(previousPoints);

    const lastPoint =
        currentPoints[currentPoints.length - 1];

    const yTicks = 4;

    const monthName =
        today.toLocaleString("default", {
            month: "long"
        });

    const previousMonthName =
        previousDate.toLocaleString("default", {
            month: "long"
        });

    return (

    <div
        className="month-line-chart-container"
        style={{
            width,
            height
        }}
    >

        {/* Header */}

        <div className="month-line-chart-header">

            <h3 className="chart-title">
                Cumulative Spending Throughout This Month
            </h3>

            <div className="chart-legend">
                {overlayOn && (
                    <div className="legend-item">
                        <span className="legend-colour legend-colour-previous" />
                        <span className="legend-label">{previousMonthName}</span>
                    </div>

                )}
                <div className="legend-item">
                    <span className="legend-colour legend-colour-current" />
                    <span className="legend-label">{monthName}</span>
                </div>

            </div>

        </div>

        {/* Chart */}

        <svg
            className="month-line-chart-svg"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
        >

            {/* Horizontal Grid */}

            {Array.from({ length: yTicks + 1 }).map((_, i) => {

                const y =
                    margin.top +
                    (i * chartHeight) / yTicks;

                const value =
                    (
                        maxValue *
                        ((yTicks - i) / yTicks)
                    ).toFixed(2);

                return (

                    <g key={i}>

                        <line
                            className="grid-line"
                            x1={margin.left}
                            x2={VIEWBOX_WIDTH - margin.right}
                            y1={y}
                            y2={y}
                        />

                        <text
                            className="axis-text"
                            x={margin.left - 10}
                            y={y + 4}
                            textAnchor="end"
                        >
                            ${value}
                        </text>

                    </g>

                );

            })}

            {/* Vertical Grid */}

            {[1, 8, 15, 22, daysInCurrentMonth].map(day => {

                const x =
                    margin.left +
                    ((day - 1) /
                        (daysInCurrentMonth - 1)) *
                        chartWidth;

                return (

                    <g key={day}>

                        <line
                            className="vertical-grid-line"
                            x1={x}
                            x2={x}
                            y1={margin.top}
                            y2={margin.top + chartHeight}
                        />

                        <text
                            className="axis-text"
                            x={x}
                            y={VIEWBOX_HEIGHT - 28}
                            textAnchor="middle"
                        >
                            {day}
                        </text>

                    </g>

                );

            })}

            {/* Axes */}

            <line
                className="axis-line"
                x1={margin.left}
                x2={margin.left}
                y1={margin.top}
                y2={margin.top + chartHeight}
            />

            <line
                className="axis-line"
                x1={margin.left}
                x2={VIEWBOX_WIDTH - margin.right}
                y1={margin.top + chartHeight}
                y2={margin.top + chartHeight}
            />

            {/* Previous Month */}

            {overlayOn && previousPoints.length > 0 && (

                <path
                    className="previous-line"
                    d={previousPath}
                />

            )}

            {/* Current Month */}

            {currentPoints.length > 0 && (

                <path
                    className="current-line"
                    d={currentPath}
                />

            )}

            {/* Current Point */}

            {lastPoint && (

                <circle
                    className="current-point"
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r="6"
                />

            )}

            {/* X Label */}

            <text
                className="axis-label"
                x={VIEWBOX_WIDTH / 2}
                y={VIEWBOX_HEIGHT - 4}
                textAnchor="middle"
            >
                Day of the Month
            </text>

            {/* Y Label */}

            <text
                className="axis-label"
                x="22"
                y={VIEWBOX_HEIGHT / 2}
                textAnchor="middle"
                transform={`rotate(-90 22 ${VIEWBOX_HEIGHT / 2})`}
            >
                Amount
            </text>

        </svg>

    </div>

);

}