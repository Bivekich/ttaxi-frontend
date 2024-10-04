import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import TripPage from "./pages/TripPage";
import RideConfirmationPage from "./pages/RideConfirmationPage";
import MyRidesPage from "./pages/MyRidesPage";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const query = useQuery();
  useEffect(() => {
    const phoneFromUrl = query.get("phoneNumber");
    if (phoneFromUrl) {
      setPhoneNumber(phoneFromUrl);
    }
  }, [query]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip" element={<TripPage phoneNumber={phoneNumber} />} />
      <Route
        path="/ride-confirmation"
        element={<RideConfirmationPage phoneNumber={phoneNumber} />}
      />
      <Route
        path="/my-rides"
        element={<MyRidesPage phoneNumber={phoneNumber} />}
      />
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
