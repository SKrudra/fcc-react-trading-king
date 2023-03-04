import { useEffect, useState } from "react";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import finnhub from "../apis/finnhub";
import { useGlobalContext } from "../context/WatchListContext";

const StockList = () => {
  const localStock = JSON.parse(localStorage.getItem("stock"));
  const [stock, setStock] = useState(
    localStock && localStock.lenght > 0 ? localStock : []
  );

  const navigate = useNavigate();

  const { watchList, removeFromWatchList } = useGlobalContext();

  // change the color of the stock value based on the -ve or +ve change
  const chagneColor = (change) => {
    return change > 0 ? "success" : "danger";
  };
  // add up or down caret based on the stock movement
  const renderIcon = (change) => {
    return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
  };

  //open the stock details page
  const handleStockSelect = (symbol) => {
    navigate(`details/${symbol}`);
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
          localStorage.setItem("stock", JSON.stringify(data));
        }
      } catch (error) {
        setStock([]);
        console.error(error);
      }
    };
    fetchData();
    return () => (isMounted = false);
  }, [watchList]);

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
          {stock &&
            stock.map((stockData) => {
              return (
                <tr
                  key={stockData.symbol}
                  className="table-row"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleStockSelect(stockData.symbol)}
                >
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
                  <td>
                    {stockData.data.pc}
                    <button
                      type="button"
                      className="btn btn-danger btm-sm ml-3 d-inline-block delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchList(stockData.symbol);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;

// line #102 is to stop the event from bubbling up to trigger the onclick on the row to navigate to the stock details page.
