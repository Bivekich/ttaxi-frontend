import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/client/Home";
import TripPage from "./pages/client/TripPage";
import RideConfirmationPage from "./pages/client/RideConfirmationPage";
import MyRidesPage from "./pages/client/MyRidesPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import Settings from "./pages/admin/Settings";
import AllRides from "./pages/admin/AllRides";
import AllRidesDriver from "./pages/driver/AllRidesDriver";
import HistoryDriver from "./pages/driver/HistoryDriver";
import Order from "./pages/driver/Order";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("phoneNumber")
  );
  const query = useQuery();
  const subdomain = window.location.hostname.split(".")[0]; // Получаем поддомен

  useEffect(() => {
    if (!phoneNumber) {
      const phoneFromUrl = query.get("phoneNumber");
      if (phoneFromUrl) {
        setPhoneNumber(phoneFromUrl);
        localStorage.setItem("phoneNumber", phoneFromUrl);
      } else {
        return "";
      }
    }
  }, [query]);

  return (
    <Routes>
      {subdomain === "client" && (
        <>
          <Route path="/" element={<Home />} />
          <Route
            path="/trip"
            element={<TripPage phoneNumber={phoneNumber} />}
          />
          <Route
            path="/ride-confirmation"
            element={<RideConfirmationPage phoneNumber={phoneNumber} />}
          />
          <Route
            path="/my-rides"
            element={<MyRidesPage phoneNumber={phoneNumber} />}
          />
        </>
      )}
      {subdomain === "admin" && (
        <>
          <Route path="/" element={<AdminDashboard />}>
            <Route index element={<AllRides />} />{" "}
            {/* This will render AllRides when the path is exactly "/" */}
            <Route path="settings" element={<Settings />} />{" "}
            {/* This will render Settings when the path is "/settings" */}
          </Route>
        </>
      )}
      {subdomain === "driver" && (
        <>
          {/* Другие маршруты для driver */}
          <Route path="/" element={<DriverDashboard />}>
            <Route index element={<AllRidesDriver />} />{" "}
            {/* This will render AllRides when the path is exactly "/" */}
            <Route
              path="history"
              element={<HistoryDriver phoneNumber={phoneNumber} />}
            />{" "}
            {/* This will render Settings when the path is "/settings" */}
            <Route
              path="order/:id"
              element={<Order phoneNumber={phoneNumber} />}
            />{" "}
          </Route>
        </>
      )}
      {/* Общий fallback на случай, если поддомен не совпадает */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
