import { useState } from "react";
import Chart from "react-apexcharts";

const StockChart = ({ chartData, symbol }) => {
  const [dateFormat, setDateFormat] = useState("24h");
  const { day, week, year } = chartData;

  const determinTimeFormat = () => {
    switch (dateFormat) {
      case "24h":
        return day;
      case "7d":
        return week;
      case "1y":
        return year;
      default:
        return day;
    }
  };

  const color =
    determinTimeFormat()[determinTimeFormat().length - 1].y -
      determinTimeFormat()[0].y >
    0
      ? "#26C281"
      : "#ed3419";

  const options = {
    colors: [color],
    title: {
      text: symbol,
      align: "center",
      style: {
        fontSize: "24px",
      },
    },
    chart: {
      id: "stock data",
      animations: {
        speed: 1300,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
      },
    },
    tooltip: {
      x: { format: "MMM dd HH:mm" },
    },
  };

  const series = [
    {
      name: symbol,
      data: determinTimeFormat(),
    },
  ];

  const renderButtonSelect = (button) => {
    const classes = "btn m-1 ";
    if (button === dateFormat) {
      return classes + "btn-primary";
    } else {
      return classes + "btn-outline-primary";
    }
  };

  return (
    <div
      style={{ backgroundColor: "rgba(145, 158, 171, 0.04)" }}
      className="mt-5 shadow-sm bg-white"
    >
      <Chart
        options={options}
        series={series}
        type="area"
        width="100%"
        height="500px"
      />
      <div>
        <button
          className={renderButtonSelect("24h")}
          onClick={() => setDateFormat("24h")}
        >
          1 Day
        </button>
        <button
          className={renderButtonSelect("7d")}
          onClick={() => setDateFormat("7d")}
        >
          7 Days
        </button>
        <button
          className={renderButtonSelect("1y")}
          onClick={() => setDateFormat("1y")}
        >
          1 Year
        </button>
      </div>
    </div>
  );
};

export default StockChart;

// anpm install apexcharts --save
// npm install --save react-apexcharts apexcharts
