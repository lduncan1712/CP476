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

const polarToCartesian = (cx, cy, r, angle) => {
  const radians = (angle - 90) * Math.PI / 180;

  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians)
  };
};

const createArc = (cx, cy, outerR, innerR, startAngle, endAngle) => {

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
};

export default function PieChart({ data }) {

  const today = new Date();

  const monthData = data.filter(item => {

    const date = new Date(item.transactionDate);

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
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

  let currentAngle = 0;

  const cx = 200;
  const cy = 170;
  const outerRadius = 120;
  const innerRadius = 65;

  return (

    <svg width="500" height="350">

      {chartData.map((item, index) => {

        const angle = (item.amount / total) * 360;

        const start = currentAngle;
        const end = currentAngle + angle;

        currentAngle += angle;

        const midAngle = (start + end) / 2;

        const labelPoint =
          polarToCartesian(cx, cy, outerRadius + 20, midAngle);

        const lineEndX =
          labelPoint.x < cx
            ? labelPoint.x - 60
            : labelPoint.x + 60;

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
              x1={labelPoint.x}
              y1={labelPoint.y}
              x2={lineEndX}
              y2={labelPoint.y}
              stroke="#999"
            />

            <text
              x={lineEndX + (lineEndX < cx ? -5 : 5)}
              y={labelPoint.y - 4}
              fontSize="12"
              textAnchor={lineEndX < cx ? "end" : "start"}
            >
              {item.category}
            </text>

            <text
              x={lineEndX + (lineEndX < cx ? -5 : 5)}
              y={labelPoint.y + 12}
              fontSize="11"
              fill="#777"
              textAnchor={lineEndX < cx ? "end" : "start"}
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
        y={cy + 5}
        textAnchor="middle"
        fontSize="20"
        fontWeight="500"
      >
        ${total.toFixed(2)}
      </text>

    </svg>

  );
}