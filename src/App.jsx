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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("phoneNumber")
  );
  const [userRoles, setUserRoles] = useState([]); // Загружаем роли
  const [loading, setLoading] = useState(true); // Индикатор загрузки данных
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const phoneFromUrl = query.get("phoneNumber");
    if (phoneFromUrl) {
      setPhoneNumber(phoneFromUrl);
      localStorage.setItem("phoneNumber", phoneFromUrl);
    }

    // Если телефон есть, но роли пользователя не сохранены, запрашиваем данные о пользователе
    const fetchUserProfile = async () => {
      if (phoneNumber && userRoles.length === 0) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/user/profile/${phoneNumber}`
          );
          const roles = response.data.map((role) => role.type); // Извлекаем роли
          setUserRoles(roles); // Сохраняем массив ролей пользователя
          console.log(response);
          console.log(roles);
        } catch (error) {
          console.error("Ошибка при получении профиля пользователя:", error);
        } finally {
          setLoading(false); // Завершаем загрузку после получения данных
        }
      } else {
        setLoading(false); // Если телефон не задан, не делаем запрос
      }
    };

    if (phoneNumber) {
      fetchUserProfile();
    }
  }, [query, phoneNumber, userRoles]);

  // Проверяем, есть ли у пользователя доступ на основании роли
  const hasAccess = (roles) => {
    return roles.includes("client");
  };

  // Если роли загружены и у пользователя нет доступа, перенаправляем на домашнюю страницу
  useEffect(() => {
    if (!loading && userRoles.length > 0 && !hasAccess(userRoles)) {
      navigate("/"); // Перенаправляем пользователя на домашнюю страницу, если нет доступа
    }
  }, [loading, userRoles, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Показываем индикатор загрузки
  }

  return (
    <Routes>
      {/* Маршруты для клиента */}
      {userRoles.includes("client") && (
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
      {/* Общий fallback на случай, если у пользователя нет роли */}
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
