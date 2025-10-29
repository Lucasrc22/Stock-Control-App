import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import SetorList from "./components/SetorList";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/setores" element={<SetorList />} />
      </Routes>
    </Router>
  );
}
