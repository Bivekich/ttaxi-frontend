import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TripPage = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const navigate = useNavigate();

  const token = "93f5c212fe49fff40e4cfc55917ccf5311b67a2c";

  const getAddressSuggestions = async (query, setSuggestions) => {
    if (query.length > 2) {
      try {
        const response = await axios.post(
          "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
          { query },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        setSuggestions(
          response.data.suggestions.map((suggestion) => suggestion)
        );
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }
  };

  const handlePickupChange = (event) => {
    setPickup(event.target.value);
    getAddressSuggestions(event.target.value, setPickupSuggestions);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
    getAddressSuggestions(event.target.value, setDestinationSuggestions);
  };

  const handleSelectSuggestion = (
    suggestion,
    setFunction,
    setSuggestions,
    setSelectedCoords,
    setAddress
  ) => {
    setFunction(suggestion.value);
    setSuggestions([]);

    if (suggestion.data.geo_lat && suggestion.data.geo_lon) {
      setSelectedCoords([suggestion.data.geo_lat, suggestion.data.geo_lon]);
      setAddress(suggestion.value);
    }
  };

  const handleConfirmTrip = () => {
    if (selectedPickup && selectedDestination) {
      navigate("/ride-confirmation", {
        state: {
          pickupCoordinates: selectedPickup,
          destinationCoordinates: selectedDestination,
          pickupAddress,
          destinationAddress,
        },
      });
    } else {
      alert("Пожалуйста, выберите корректные адреса из предложений.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-white p-2 rounded-full shadow-md"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="mb-6">
          <label
            htmlFor="pickup"
            className="block text-gray-700 font-semibold mb-2 flex items-center"
          >
            <i className="fas fa-map-marker-alt text-black text-xl mr-3"></i>
            Откуда едем?
          </label>
          <input
            type="text"
            id="pickup"
            value={pickup}
            onChange={handlePickupChange}
            className="w-full border-b border-gray-300 focus:outline-none p-2"
            placeholder="Введите начальный адрес"
          />
          {pickupSuggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
              {pickupSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleSelectSuggestion(
                      suggestion,
                      setPickup,
                      setPickupSuggestions,
                      setSelectedPickup,
                      setPickupAddress
                    )
                  }
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.value}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="destination"
            className="block text-gray-700 font-semibold mb-2 flex items-center"
          >
            <i className="fas fa-crosshairs text-black text-xl mr-3"></i>
            Куда едем?
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={handleDestinationChange}
            className="w-full border-b border-gray-300 focus:outline-none p-2"
            placeholder="Введите конечный адрес"
          />
          {destinationSuggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
              {destinationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleSelectSuggestion(
                      suggestion,
                      setDestination,
                      setDestinationSuggestions,
                      setSelectedDestination,
                      setDestinationAddress
                    )
                  }
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100">
        <button
          onClick={handleConfirmTrip}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          disabled={!pickup || !destination}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default TripPage;
