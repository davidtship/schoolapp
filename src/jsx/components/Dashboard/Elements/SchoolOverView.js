import React, { useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Nav, Tab } from "react-bootstrap";

const chartHeaderData = [
  { title: "Semaine", type: "week" },
  { title: "Mois", type: "month" },
  { title: "Année", type: "year" },
  { title: "Tout", type: "all" },
];

const SchoolOverView = () => {
  const chartRef = useRef(null);
  const [series, setSeries] = useState([
    {
      name: "Effectif",
      type: "column",
      data: [75, 85, 72, 100, 50, 100, 80, 75, 95, 35, 75, 100],
    },
    {
      name: "Revenu",
      type: "area",
      data: [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50, 42],
    },
    {
      name: "Abandons",
      type: "line",
      data: [30, 25, 45, 30, 25, 35, 20, 45, 35, 20, 35, 20],
    },
  ]);

  const options = {
    chart: {
      height: 300,
      type: "line",
      stacked: false,
      toolbar: { show: false },
    },
    stroke: {
      width: [0, 2, 3],
      curve: "smooth",
      dashArray: [0, 0, 5],
    },
    legend: {
      fontSize: "13px",
      fontFamily: "Poppins, sans-serif",
      labels: { colors: "#555" },
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        borderRadius: 4,
      },
    },
    fill: {
      type: ["solid", "gradient", "solid"],
      gradient: {
        shade: "light",
        type: "vertical",
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    colors: ["#3b82f6", "#22c55e", "#ef4444"], // bleu, vert, rouge
    labels: [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
    ],
    markers: { size: 4, strokeWidth: 2, hover: { size: 7 } },
    xaxis: {
      labels: {
        style: { fontSize: "13px", colors: "#666" },
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        style: { fontSize: "13px", colors: "#666" },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => (y ? `${y.toFixed(0)} unités` : y),
      },
    },
  };

  // 🔹 Fonction pour changer la série selon la période
  const dataSeries = (seriesType) => {
    let columnData = [];
    let areaData = [];
    let lineData = [];

    switch (seriesType) {
      case "week":
        columnData = [75, 85, 72, 100, 50, 100, 80, 75, 95, 35, 75, 100];
        areaData = [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50, 42];
        lineData = [30, 25, 45, 30, 25, 35, 20, 45, 35, 20, 35, 20];
        break;
      case "month":
        columnData = [20, 50, 80, 52, 10, 80, 50, 30, 90, 10, 60, 85];
        areaData = [40, 25, 85, 45, 85, 25, 95, 65, 45, 45, 20, 12];
        lineData = [65, 45, 25, 65, 45, 25, 75, 35, 65, 75, 15, 65];
        break;
      case "year":
        columnData = [30, 20, 80, 52, 10, 90, 50, 30, 75, 20, 60, 85];
        areaData = [40, 25, 40, 45, 85, 25, 50, 65, 45, 60, 20, 12];
        lineData = [65, 45, 30, 65, 45, 25, 75, 40, 65, 50, 15, 65];
        break;
      case "all":
        columnData = [20, 50, 80, 60, 10, 80, 50, 40, 85, 20, 60, 85];
        areaData = [40, 25, 30, 45, 85, 25, 95, 65, 50, 45, 20, 12];
        lineData = [65, 45, 25, 65, 45, 25, 30, 35, 65, 75, 15, 65];
        break;
      default:
        columnData = [75, 80, 72, 100, 50, 100, 80, 30, 95, 35, 75, 100];
        areaData = [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50, 42];
        lineData = [30, 25, 45, 30, 25, 35, 20, 45, 35, 30, 35, 20];
    }

    setSeries([
      { name: "Effectif", type: "column", data: columnData },
      { name: "Revenu", type: "area", data: areaData },
      { name: "Abandons", type: "line", data: lineData },
    ]);
  };

  return (
    <Tab.Container defaultActiveKey="Semaine">
      <div className="card-header border-0 pb-0 d-flex justify-content-between flex-wrap">
        <h4 className="heading mb-0" style={{ fontWeight: 600, color: "#2E3A59" }}>
          Aperçu de l'école
        </h4>
        <Nav as="ul" className="nav nav-pills mix-chart-tab">
          {chartHeaderData.map((item, index) => (
            <Nav.Item as="li" className="nav-item" key={index}>
              <Nav.Link
                eventKey={item.title}
                onClick={() => dataSeries(item.type)}
                style={{ fontWeight: 500, fontSize: "14px" }}
              >
                {item.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      <div className="card-body p-0">
        <div id="overviewChart">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={300}
            ref={chartRef}
          />
        </div>
      </div>
    </Tab.Container>
  );
};

export default SchoolOverView;
