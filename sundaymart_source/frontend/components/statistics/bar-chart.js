import React from "react";
import ArrowUpLineIcon from "remixicon-react/ArrowUpLineIcon";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Row } from "reactstrap";
import { Col } from "reactstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [0, 2, 3, 2, 6, 9, 0],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};
export function App() {
  return (
    <div className="card chart-box">
      <Row>
        <Col>
          <div className="chart-content">
            <div className="revenue">
              <div className="text">Weekly Revenue</div>
              <span className="text-muted">8 - 15 Jul, 2020</span>
            </div>
            <div className="mb-4">
              <h1 className="font-weight-bold">$27,188.00</h1>
              <p className="text-success">
                <ArrowUpLineIcon size={16} />
                <span> 17% </span>
                <span>growth from last week</span>
              </p>
              <p>
                Total gross income figure based from the date range given above.
              </p>
            </div>
          </div>
        </Col>
        <Col md="8" className="bar-chart">
          <Line options={options} data={data} />
        </Col>
      </Row>
    </div>
  );
}
