import React from "react";

const COLORS = [
  "#4285F4",
  "#EA4335",
  "#FBBC05",
  "#34A853",
  "#FF6D01",
  "#7E57C2",
  "#26A69A",
  "#EC407A"
];

function polarToCartesian(cx, cy, r, angle) {
  const radians = (angle - 90) * Math.PI / 180;

  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians)
  };
}

function createArc(cx, cy, outerR, innerR, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);

  const startInner = polarToCartesian(cx, cy, innerR, startAngle);
  const endInner = polarToCartesian(cx, cy, innerR, endAngle);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `
    M ${startOuter.x} ${startOuter.y}
    A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}
    L ${startInner.x} ${startInner.y}
    A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}
    Z
  `;
}

export default function ExpenseDonutChart({
  data,
  width = 500,
  height = 200
}) {
  const today = new Date();

  const monthData = data.filter(item => {
    const d = new Date(item.transactionDate);

    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const grouped = {};

  monthData.forEach(item => {
    grouped[item.category_id] =
      (grouped[item.category_id] || 0) + item.amount;
  });

  const chartData = Object.entries(grouped).map(([category, amount], i) => ({
    category,
    amount,
    color: COLORS[i % COLORS.length]
  }));

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Padding leaves room for labels
  const padding = 140;

  const cx = width / 2;
  const cy = height / 2;

  const outerRadius =
    Math.min(width - padding * 2, height - 40) / 2;

  const innerRadius = outerRadius * 0.55;

  let currentAngle = 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {chartData.map((item, index) => {
        const angle = total === 0 ? 0 : (item.amount / total) * 360;

        const start = currentAngle;
        const end = currentAngle + angle;

        currentAngle += angle;

        const mid = (start + end) / 2;

        const p1 = polarToCartesian(cx, cy, outerRadius, mid);
        const p2 = polarToCartesian(cx, cy, outerRadius + 18, mid);

        const rightSide = p2.x > cx;

        const labelX = rightSide ? width - 20 : 20;
        const anchor = rightSide ? "end" : "start";

        return (
          <g key={index}>
            <path
              d={createArc(
                cx,
                cy,
                outerRadius,
                innerRadius,
                start,
                end
              )}
              fill={item.color}
            />

            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#999"
            />

            <line
              x1={p2.x}
              y1={p2.y}
              x2={labelX}
              y2={p2.y}
              stroke="#999"
            />

            <text
              x={labelX}
              y={p2.y - 4}
              fontSize={12}
              textAnchor={anchor}
            >
              {item.category}
            </text>

            <text
              x={labelX}
              y={p2.y + 12}
              fontSize={11}
              fill="#777"
              textAnchor={anchor}
            >
              {(item.amount / total * 100).toFixed(1)}%
            </text>
          </g>
        );
      })}

      <circle
        cx={cx}
        cy={cy}
        r={innerRadius}
        fill="white"
      />

      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize={16}
        fill="#666"
      >
        Total
      </text>

      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fontSize={26}
        fontWeight="500"
      >
        ${total.toFixed(2)}
      </text>
    </svg>
  );
}
