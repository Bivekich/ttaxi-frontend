import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios"; // Добавляем axios для запросов к серверу
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
  // const [userRoles, setUserRoles] = useState(
  //   JSON.parse(localStorage.getItem("userRoles")) || [] // Загружаем роли из localStorage, если они есть
  // );
  const [userRoles, setUserRoles] = useState(
    [] // Загружаем роли из localStorage, если они есть
  );
  const query = useQuery();
  const navigate = useNavigate();
  const subdomain = window.location.hostname.split(".")[0]; // Получаем поддомен

  useEffect(() => {
    const phoneFromUrl = query.get("phoneNumber");
    if (phoneFromUrl) {
      setPhoneNumber(phoneFromUrl);
      localStorage.setItem("phoneNumber", phoneFromUrl);
      // localStorage.setItem("userRoles", JSON.stringify(["client"])); // Сохраняем роли в localStorage
    }

    // Если телефон есть, но роли пользователя не сохранены в localStorage, запрашиваем данные о пользователе
    const fetchUserProfile = async () => {
      if (phoneNumber && userRoles.length === 0) {
        try {
          const response = await axios.get(
            `https://api.24t-taxi.ru/api/user/profile/${phoneNumber}`
          );
          console.log(response);
          const roles = response.data.map((role) => role.type); // Извлекаем роли в массив
          setUserRoles(roles); // Сохраняем массив ролей пользователя
          // localStorage.setItem("userRoles", JSON.stringify(roles)); // Сохраняем роли в localStorage
        } catch (error) {
          console.error("Ошибка при получении профиля пользователя:", error);
        }
      }
    };

    if (phoneNumber) {
      fetchUserProfile();
    }
  }, [query, phoneNumber]);

  // Проверяем, есть ли у пользователя доступ к определенному поддомену
  const hasAccess = (subdomain, roles) => {
    if (subdomain === "client" && roles.includes("client")) return true;
    if (subdomain === "admin" && roles.includes("admin")) return true;
    if (subdomain === "driver" && roles.includes("driver")) return true;
    return false;
  };

  // Если роли пользователя загружены и у него нет доступа, перенаправляем на домашнюю страницу
  useEffect(() => {
    if (userRoles.length > 0 && !hasAccess(subdomain, userRoles)) {
      navigate("/"); // Перенаправляем пользователя на домашнюю страницу, если нет доступа
    }
  }, [userRoles, subdomain, navigate]);

  return (
    <Routes>
      {/* Маршруты для клиента */}
      {subdomain === "client" && userRoles.includes("client") && (
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

      {/* Маршруты для администратора */}
      {subdomain === "admin" && userRoles.includes("admin") && (
        <>
          <Route path="/" element={<AdminDashboard />}>
            <Route index element={<AllRides />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </>
      )}

      {/* Маршруты для водителя */}
      {subdomain === "driver" && userRoles.includes("driver") && (
        <>
          <Route path="/" element={<DriverDashboard />}>
            <Route index element={<AllRidesDriver />} />
            <Route
              path="history"
              element={<HistoryDriver phoneNumber={phoneNumber} />}
            />
            <Route
              path="order/:id"
              element={<Order phoneNumber={phoneNumber} />}
            />
          </Route>
        </>
      )}

      {/* Общий fallback на случай, если поддомен не совпадает или у пользователя нет роли */}
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
