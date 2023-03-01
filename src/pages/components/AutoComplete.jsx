import React, { useEffect, useState } from "react";
import finnhub from "../../apis/finnhub";

const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const renderDropDown = () => {
    const dropDownClass = search ? "show" : "";
    return (
      <ul
        className={`dropdown-menu ${dropDownClass}`}
        style={{
          height: "500px",
          overflowY: "scroll",
          overflowX: "hidden",
          cursor: "pointer",
        }}
      >
        {results.map((result) => {
          return (
            <li key={result.symbol} className="dropdown-item">
              {result.description}({result.symbol})
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await finnhub.get("/search", {
          params: {
            q: search,
          },
        });
        if (isMounted) {
          setResults(response.data.result);
        }
      } catch (error) {}
    };
    if (search.length > 2) {
      fetchData();
    } else {
      setResults([]);
    }
  }, [search]);

  return (
    <div className="w-50 p-5 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          type="text"
          name="search"
          id="search"
          style={{ backgroundColor: "rgb(145,158,171, 0.04" }}
          className="form-control"
          placeholder="search"
          autoComplete="off"
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="search">Search</label>
        {renderDropDown()}
      </div>
    </div>
  );
};

export default AutoComplete;
