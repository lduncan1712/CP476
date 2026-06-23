import { useState, useEffect } from 'react'
import line_graph from '../assets/line_graph.png';
import line_with_overlay from '../assets/line_with_overlay.png';
import yearview_graph from '../assets/yearview_graph.png';
import piechart from '../assets/piechart.png';

export default function Analytics() {

    // 1. Define Data Sets
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const line1Data = [10, 25, 45, 30, 60, 75, 55];
    const line2Data = [30, 40, 35, 65, 50, 85, 90];

    // Get current month and year
    const now = new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'});

    // Use boolean states to track which chart settings are currently active
    const [isMonthview, setMonthview] = useState(true);
    const [hasOverlay, setOverlay] = useState(true);
    //<canvas id="customLineChart" width="400" height="200"></canvas><img src={linegraph} alt="Line Graph" />
    return (
    <div>
        <h1 id = "analytics-title">Analytics</h1>
        <section class="cards">
            <article class="analytics_card">
                <figure id = "graph-summary">
                    <img src={hasOverlay ? line_graph : line_with_overlay} alt="Line graph" style={{ width: '400px', height: '250px', display: 'block', margin: '10px auto' }}/>
                    <figcaption>Month Summary</figcaption>
                </figure>
                <div class = "card-content">
                    <h2>{now}</h2>
                    <button type="button" className={hasOverlay ? 'chart-no-overlay' : 'chart-overlay'} onClick={() => setOverlay(!hasOverlay)}>Compare with last month</button>
                    <button type="button" className={isMonthview ? 'chart-no-overlay' : 'chart-overlay'} onClick={() => setMonthview(!isMonthview)}>Year-view</button>
                    <div class = "points">
                        <ul>
                            <li>You have used up <strong>30%</strong> of your budget so far.</li>
                            <li>You spent <strong>15% more</strong> by this point in the month, compared to the last month</li>
                            <li>For the last <strong>3 months</strong>, you have stayed within the budget!</li>
                        </ul>
                    </div>
                </div>
            </article>
            <article class = "analytics_card">
                <figure id = "breakdown_chart">
                    <figcaption>Month Expense Breakdown By Category</figcaption>
                    <img src={piechart} alt="Pie graph" style={{ width: '400px', height: '250px', display: 'block', margin: '10px auto' }}/>
                </figure>
                <div class = "card-content">
                    <div class = "points">
                        <ul>
                            <li><strong>Groceries</strong> are the biggest expense this month, with a <strong>2% increase</strong> from last month so far.</li>
                            <li><strong>Transportation</strong> has had the biggest decrease in expenses this month, by <strong>13%</strong>.</li>
                        </ul>
                    </div>
                </div>
            </article>
        </section>
    </div>
  )
}
{/*
      
      {*//* Clicking toggles the boolean state */}
      /*<button onClick={() => setIsFirstImage(!isFirstImage)}>
        Switch Image
      </button>//                    <canvas id="customLineChart" width="200" height="200"></canvas>
*/