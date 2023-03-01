import { useState, useEffect } from "react";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import finnhub from "../../apis/finnhub";

const StockList = () => {
  const localStock = JSON.parse(localStorage.getItem('stock'));
  const [stock, setStock] = useState(localStock && localStock.lenght > 0 ? localStock : []);
  const [watchList, setWatchList] = useState(["MSFT", "UBER", "AAPL", "PDBC"]);

  const chagneColor = (change) => {
    return change > 0 ? "success" : "danger";
  };

  const renderIcon = (change) => {
    return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      let responses = [];
      try {
        responses = await Promise.all(
          watchList.map((stock) => {
            return finnhub.get("/quote", {
              params: { symbol: stock },
            });
          })
        );

        const data = responses.map((response) => {
          return { data: response.data, symbol: response.config.params.symbol };
        });
        if (isMounted) {
          setStock(data);
          localStorage.setItem('stock', JSON.stringify(data));
        }
        console.log(data);
      } catch (error) {
        setStock([]);
        console.error(error);
      }
    };
    fetchData();
    return () => (isMounted = false);
  }, []);

  // {"c":146.5041,"d":-0.9059,"dp":-0.6145,"h":147.2285,"l":145.41,"o":146.83,"pc":147.41,"t":1677693289}

  return (
    <div>
      <table className="table hover mt-5">
        <thead style={{ color: "rgb(79,89,102" }}>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last</th>
            <th scope="col">Change</th>
            <th scope="col">Change %</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Previous Close</th>
          </tr>
        </thead>
        <tbody>
          {stock && stock.map((stockData) => {
            return (
              <tr key={stockData.symbol} className="table-row">
                <th scope="row">{stockData.symbol}</th>
                <td>{stockData.data.c}</td>
                <td className={`text-${chagneColor(stockData.data.d)}`}>
                  {stockData.data.d} {renderIcon(stockData.data.d)}
                </td>
                <td className={`text-${chagneColor(stockData.data.d)}`}>
                  {stockData.data.dp} {renderIcon(stockData.data.d)}
                </td>
                <td>{stockData.data.h}</td>
                <td>{stockData.data.l}</td>
                <td>{stockData.data.o}</td>
                <td>{stockData.data.pc}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;

// api_key="cfv72m9r01qtdvl3k5bgcfv72m9r01qtdvl3k5c0"
