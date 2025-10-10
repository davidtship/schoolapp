import React from "react";
import ReactApexChart from "react-apexcharts";

const SchoolPerformance = () => {
  const series = [
    {
      name: "Présence des élèves (%)",
      data: [85, 88, 92, 90, 94, 96],
    },
    {
      name: "Performance académique (%)",
      data: [75, 78, 81, 83, 85, 88],
    },
  ];

  const options = {
    chart: {
      type: "area",
      height: 320,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 5,
        color: "#000",
        opacity: 0.1,
      },
    },
    dataLabels: { enabled: false },
    colors: ["#3b82f6", "#16a34a"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 5,
      padding: { top: 10, right: 20, bottom: 10, left: 20 },
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: ["#3b82f6", "#16a34a"],
      strokeWidth: 3,
      hover: { size: 7 },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#374151" },
      fontFamily: "Poppins, sans-serif",
      fontSize: "13px",
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
        },
        formatter: (value) => value + "%",
      },
    },
    xaxis: {
      categories: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
        },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px", fontFamily: "Poppins" },
      y: {
        formatter: (val) => val + "%",
      },
    },
  };

  return (
    <div
      id="schoolPerformanceChart"
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
      }}
    >
      <ReactApexChart options={options} series={series} type="area" height={320} />
    </div>
  );
};

export default SchoolPerformance;
