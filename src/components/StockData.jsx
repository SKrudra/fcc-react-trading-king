import React, { useEffect, useState } from "react";
import finnhub from "../apis/finnhub";

const StockData = ({ symbol }) => {
  const [details, setDetails] = useState();
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await finnhub.get("/stock/profile2", {
          params: { symbol },
        });
        console.log(response);
        if (isMounted) {
          setDetails(response.data);
        }
      } catch (error) {}
    };
    fetchData();
    return () => (isMounted = false);
  }, [symbol]);

  return (
    <div>
      {details && (
        <div className="row border bg-white rounded shadow-sm p-4 mt-5">
          <div className="col">
            <div>
              <span className="fw-bold">Name: </span>
              {details.name}
            </div>
            <div>
              <span className="fw-bold">Country: </span>
              {details.country}
            </div>
            <div>
              <span className="fw-bold">Ticker: </span>
              {details.ticker}
            </div>
          </div>
          <div className="col">
            <div>
              <span className="fw-bold">Exchange: </span>
              {details.exchange}
            </div>
            <div>
              <span className="fw-bold">Industry: </span>
              {details.finnhubIndustry}
            </div>
            <div>
              <span className="fw-bold">IPO: </span>
              {details.ipo}
            </div>
          </div>
          <div className="col">
            <div>
              <span className="fw-bold">Market Cap: </span>
              {details.marketCapitalization}
            </div>
            <div>
              <span className="fw-bold">Shares Outstanding</span>
              {details.shareOutstanding}
            </div>
            <div>
              <span className="fw-bold">URL: </span>
              <a href={details.weburl}>{details.weburl}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockData;
