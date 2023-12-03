import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TopInfoPage from "./pages/TopInfoPage";
import TypesPage from "./pages/TypesPage";
import ProductionSearchPage from "./pages/ProductionSearchPage";
import ProductionInfoPage from "./pages/ProductionInfoPage";

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage type={'Movie'}/>} />
          <Route path="/movie" element={<HomePage type={'Movie'}/>} />
          <Route path="/short" element={<HomePage type={'Short'} />} />
          <Route path="/TVSeries" element={<HomePage type={'TVSeries'} />} />
          <Route path="/TopInfoPage" element={<TopInfoPage />}/>
          <Route path='/search_productions' element={<TypesPage />} />
          <Route path='/search_productions/Movies' element={<ProductionSearchPage type={'Movie'}/>} />
          <Route path='/search_productions/Shorts' element={<ProductionSearchPage type={'Short'}/>} />
          <Route path='/search_productions/TV Series' element={<ProductionSearchPage type={'TVSeries'}/>} />
          <Route path='/production_info/:titleId' element={<ProductionInfoPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
