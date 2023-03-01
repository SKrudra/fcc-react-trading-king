import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import StockDetails from "./pages/StockDetails";
import StockOverview from "./pages/StockOverview";

function App() {
  return (
    <main className="container">
      <Router>
        <Routes>
          <Route path="/" element={<StockOverview />} />
          <Route path="/details/:tick" element={<StockDetails />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
