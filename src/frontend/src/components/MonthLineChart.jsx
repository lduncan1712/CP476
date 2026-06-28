import React from "react";

export default function MonthlyLineChart({
    data,
    overlayOn = true,
    width = 800,
    height = 300
}) {

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
        top: 30,
        right: 40,
        bottom: 60,
        left: 70
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // --------------------------
    // Filter data
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
    // Group by day
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

    const current = groupByDay(currentMonthData, daysInCurrentMonth);
    const previous = groupByDay(previousMonthData, daysInCurrentMonth);

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

    function makePath(points) {

        if (!points.length) return "";

        return points.reduce((path, point, index) => {

            return (
                path +
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y} `
            );

        }, "");

    }

    const currentPath = makePath(currentPoints);
    const previousPath = makePath(previousPoints);

    const lastPoint =
        currentPoints[currentPoints.length - 1];

    // --------------------------
    // Axis Labels
    // --------------------------

    const yTicks = 4;

    const monthName = today.toLocaleString("default", {
        month: "long"
    });

    const previousMonthName = previousDate.toLocaleString(
        "default",
        {
            month: "long"
        }
    );

    return (
        <div>

        <div className="month-line-graph-header">
        <h3 style={{ margin: 0 }}>Cumulative Expenses for This Month</h3>

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
            }}
        >
            {overlayOn && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: "#2ca02c",
                        }}
                    />
                    <span>{previousMonthName}</span>
                </div>
            )}

            <div style={{display: "flex", alignItems: "center", gap: "8px",}}>
                <div
                    style={{
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#4285F4",
                    }}
                />
                <span>{monthName}</span>
            </div>
        </div>
    </div>

        <svg
            width={width}
            height={height}
        >

            {/* Horizontal grid */}

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
                            x1={margin.left}
                            x2={width - margin.right}
                            y1={y}
                            y2={y}
                            stroke="#ddd"
                        />

                        <text
                            x={margin.left - 10}
                            y={y + 5}
                            textAnchor="end"
                            fontSize="12"
                        >
                            ${value}
                        </text>

                    </g>

                );

            })}

            {/* Vertical grid */}

            {[1, 8, 15, 22, daysInCurrentMonth].map(day => {

                const x =
                    margin.left +
                    ((day - 1) /
                        (daysInCurrentMonth - 1)) *
                        chartWidth;

                return (

                    <g key={day}>

                        <line
                            x1={x}
                            y1={margin.top}
                            x2={x}
                            y2={margin.top + chartHeight}
                            stroke="#eee"
                        />

                        <text
                            x={x}
                            y={height - 25}
                            textAnchor="middle"
                            fontSize="12"
                        >
                            {day}
                        </text>

                    </g>

                );

            })}

            {/* Axis */}

            <line
                x1={margin.left}
                x2={margin.left}
                y1={margin.top}
                y2={margin.top + chartHeight}
                stroke="#444"
            />

            <line
                x1={margin.left}
                x2={width - margin.right}
                y1={margin.top + chartHeight}
                y2={margin.top + chartHeight}
                stroke="#444"
            />

            {/* Previous month */}

            {overlayOn && previousPoints.length > 0 && (

                <path
                    d={previousPath}
                    fill="none"
                    stroke="#2ca02c"
                    strokeWidth="3"
                />

            )}

            {/* Current month */}

            {currentPoints.length > 0 && (

                <path
                    d={currentPath}
                    fill="none"
                    stroke="#4285F4"
                    strokeWidth="3"
                />

            )}

            {/* Current point */}

            {lastPoint && (

                <circle
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r="4"
                    fill="#4285F4"
                />

            )}

            {/* X Label */}

            <text
                x={width / 2}
                y={height - 5}
                textAnchor="middle"
                fontSize="14"
            >
                Day of the Month
            </text>

            {/* Y Label */}

            <text
                x="45"
                y={-5 + height / 2}
                textAnchor="middle"
                transform={`rotate(-90 20 ${height / 2})`}
                fontSize="14"
            >
                Amount
            </text>

        </svg>
    </div>
    );

}