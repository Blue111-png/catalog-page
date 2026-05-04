import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import CatalogPage from './pages/catalogPage';
import ProductPage from './pages/productPage';
import AddProductPage from './pages/addProductPage';
import './App.css';
import LoginPage from './pages/loginPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/add" element={<AddProductPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;