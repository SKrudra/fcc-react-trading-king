import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import finnhub from "../apis/finnhub";
import StockChart from "../components/StockChart";
import StockData from "../components/StockData";

const formatData = (data) => {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index]),
    };
  });
};

const StockDetails = () => {
  const { tick } = useParams();

  const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      const currentTimeSeconds = Math.floor(date.getTime() / 1000);
      let oneDay;
      if (date.getDay === 6) {
        oneDay = currentTimeSeconds - 2 * 24 * 60 * 60;
      } else if (date.getDay === 0) {
        oneDay = currentTimeSeconds - 3 * 24 * 60 * 60;
      } else {
        oneDay = currentTimeSeconds - 24 * 60 * 60;
      }
      const oneWeek = currentTimeSeconds - 7 * 24 * 60 * 60;
      const oneYear = currentTimeSeconds - 365 * 24 * 60 * 60;

      try {
        const response = await Promise.all([
          finnhub.get("/stock/candle", {
            params: {
              symbol: tick,
              from: oneDay,
              to: currentTimeSeconds,
              resolution: 30,
            },
          }),
          finnhub.get("/stock/candle", {
            params: {
              symbol: tick,
              from: oneWeek,
              to: currentTimeSeconds,
              resolution: 60,
            },
          }),
          finnhub.get("/stock/candle", {
            params: {
              symbol: tick,
              from: oneYear,
              to: currentTimeSeconds,
              resolution: "W",
            },
          }),
        ]);
        const transformedData = {
          day: formatData(response[0].data),
          week: formatData(response[1].data),
          year: formatData(response[2].data),
        };

        setChartData(transformedData);
      } catch (error) {}
    };

    fetchData();
  }, [tick]);

  return (
    <div>
      {chartData && <StockChart chartData={chartData} symbol={tick} />}
      <br />
      <hr />
      <StockData symbol={tick} />
    </div>
  );
};

export default StockDetails;
