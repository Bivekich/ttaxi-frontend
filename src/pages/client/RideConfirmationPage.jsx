import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RideConfirmationPage = ({ phoneNumber }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    pickupCoordinates,
    destinationCoordinates,
    pickupAddress,
    destinationAddress,
  } = location.state;

  const handleOrderRide = async () => {
    const yandexRouteLink = `https://yandex.ru/maps/?rtext=${pickupCoordinates[0]},${pickupCoordinates[1]}~${destinationCoordinates[0]},${destinationCoordinates[1]}&rtt=auto`;

    const orderData = {
      phoneNumber,
      status: "Заказан",
      pickupCoordinates,
      destinationCoordinates,
      pickupAddress,
      destinationAddress,
      yandexRouteLink,
      price: "Цена будет по счетчику",
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderData
      );

      if (response.status === 200) {
        alert(
          "Заказ успешно оформлен! Ожидайте с вами свяжеться первый свободный таксист."
        );
        navigate(-2);
      } else {
        alert("Ошибка при оформлении заказа.");
      }
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-[375px] min-h-screen shadow-xl overflow-hidden">
        <div className="p-4 flex items-center">
          <button
            onClick={() => navigate(-2)}
            className="bg-white p-2 rounded-full shadow-md"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        <div className="w-full h-64 mb-4">
          <MapContainer
            center={pickupCoordinates}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline
              positions={[pickupCoordinates, destinationCoordinates]}
              color="blue"
            />
          </MapContainer>
        </div>
        <div className="px-4">
          <div className="text-lg font-semibold mb-2">Информация о поездке</div>
          <div className="bg-gray-100 p-3 rounded-md text-center mb-4">
            <p>
              <strong>Откуда:</strong> {pickupAddress}
            </p>
            <p>
              <strong>Куда:</strong> {destinationAddress}
            </p>
            <p>
              <strong>Минимальная цена:</strong> 89₽. Она будет рассчитана по
              счетчику.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleOrderRide}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Заказать поездку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideConfirmationPage;
