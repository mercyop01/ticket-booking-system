import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import SeatMap from './pages/SeatMap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="event/:id/seats" element={<SeatMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
