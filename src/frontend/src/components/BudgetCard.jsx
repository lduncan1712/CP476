import './BudgetCard.css';

const BUCKETS = [
  { max: 60,       colorClass: 'green',  message: 'Nice work!' },
  { max: 85,       colorClass: 'yellow', message: 'Watch your spending!' },
  { max: 100,      colorClass: 'orange', message: 'Nearing your limit!' },
  { max: Infinity, colorClass: 'red',    message: 'Over budget!' },
];

function getBucket(pct) {
  return BUCKETS.find(b => pct <= b.max);
}

export default function BudgetCard({ category, amount, spent, days_left }) {
  const pct        = amount > 0 ? (spent / amount) * 100 : 0;
  const clampedPct = Math.min(pct, 100);
  const isComplete = clampedPct >= 100;
  const bucket     = getBucket(pct);

  return (
    <div className="budget-card">

      {/* 1. TITLE */}
      <h3 className="budget-card-title">{category}</h3>

      {/* 2. PROGRESS BAR */}
      <div className="progress-section">

        <div className="progress-wrapper">
          <div className="progress-track">
            <div
              className={`progress-fill progress-fill--${bucket.colorClass}${isComplete ? ' progress-fill--complete' : ''}`}
              style={{ width: `${clampedPct}%` }}
            >
              {!isComplete && <div className="progress-arrow" />}
            </div>
          </div>

          <div className="progress-marker" style={{ left: `${clampedPct}%` }} />
          <span className="progress-spent-label" style={{ left: `${clampedPct}%` }}>
            ${spent.toFixed(2)}
          </span>
        </div>

        <span className="progress-total-label">${amount.toFixed(2)}</span>
      </div>

      {/* 3. SUMMARY */}
      <div className="summary-section">
        <p className="summary-text">
          ${spent.toFixed(2)} of ${amount.toFixed(2)} spent. {bucket.message}
        </p>
        <p className="summary-days">
          Budget ends in: {days_left} day{days_left !== 1 ? 's' : ''}
        </p>
      </div>

    </div>
  );
}