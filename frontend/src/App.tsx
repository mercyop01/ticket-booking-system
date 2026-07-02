import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import SeatMap from './pages/SeatMap';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OrganiserDashboard from './pages/OrganiserDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="organiser/dashboard" element={<OrganiserDashboard />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="event/:id/seats" element={<SeatMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
