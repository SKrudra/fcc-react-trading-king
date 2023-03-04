import React, { useContext, useEffect, useState } from "react";

const WatchListContext = React.createContext();

const WatchListContextProvider = ({ children }) => {

  const [watchList, setWatchList] = useState(
    localStorage.getItem("watchList")?.split(",") || [
      "MSFT",
      "UBER",
      "AAPL",
      "PDBC",
    ]
  );

  useEffect(() => {
    localStorage.setItem("watchList", watchList);
  }, [watchList]);

  const addToWatchList = (stock) => {
    if (watchList.indexOf(stock) === -1) {
      setWatchList([...watchList, stock]);
    }
  };

  const removeFromWatchList = (stock) => {
    const filteredStocks = watchList.filter((s) => s !== stock);
    setWatchList(filteredStocks);
  };

  return (
    <WatchListContext.Provider
      value={{ watchList, addToWatchList, removeFromWatchList }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

export const useGlobalContext = () => useContext(WatchListContext);

export { WatchListContext, WatchListContextProvider };
