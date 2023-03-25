import React from "react";
import Breadcrumb from "../../components/breadcrumb";
import StatisticCard from "../../components/statistics/card";
import { App } from "../../components/statistics/bar-chart";
import { PeiCart } from "../../components/statistics/pie-chart";
import { Col, Row } from "reactstrap";

const Statistics = () => {
  return (
    <div className="statistics">
      <Breadcrumb />
      <div className="card-section">
        <StatisticCard type="success" />
        <StatisticCard type="warning" />
        <StatisticCard type="danger" />
        <StatisticCard type="primary" />
      </div>
      <Row>
        <Col lg="8">
          <App />
        </Col>
        <Col lg="4">
          <PeiCart />
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
