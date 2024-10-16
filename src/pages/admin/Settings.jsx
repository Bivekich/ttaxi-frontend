import axios from "axios";
import React, { useState, useEffect } from "react";

const Settings = () => {
  const [pricePerMinute, setPricePerMinute] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  // Function to fetch price per minute from backend
  const fetchPricePerMinute = async () => {
    try {
      const response = await axios.get(
        "https://api.24t-taxi.ru/api/user/getPricePerMinute"
      );
      console.log(response);
      if (response.status === 200) {
        setPricePerMinute(response.data.pricePerMinute);
      } else {
        console.error("Error fetching price per minute:", response.data);
        setError("Не удалось загрузить цену тарифа.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке цены тарифа:", error);
      setError("Ошибка при загрузке цены тарифа.");
    }
  };

  // Use useEffect to fetch the price when the component mounts
  useEffect(() => {
    fetchPricePerMinute();
  }, []);

  const handleSave = async () => {
    // Logic to save the price and phone number
    console.log("Saving settings:", { pricePerMinute, phoneNumber });
    const response = await axios.post(
      "https://api.24t-taxi.ru/api/user/changeAdmin",
      {
        pricePerMinute: pricePerMinute,
        column: "price_per_minute",
      }
    );
    console.log(response.data);
    // Clear fields after saving if needed
    setPricePerMinute("");
    setPhoneNumber("");
  };

  const handleAddAdmin = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      try {
        console.log("Adding as admin:", {
          pricePerMinute,
          phoneNumber: phoneNumber.replace("+", ""),
        });
        const response = await axios.post(
          "https://api.24t-taxi.ru/api/user/addUser",
          {
            phoneNumber: phoneNumber.replace("+", ""),
            status: "admin",
          }
        );

        // Check if the response status indicates success
        if (response.status === 201) {
          // Updated to check for 201 (Created)
          console.log("Admin added successfully:", response.data);
          setError(""); // Clear any existing error messages
          // Optionally, you can add a success message for the user
          alert("Администратор успешно добавлен!"); // Simple alert for success
        } else {
          // If the response is not successful, log the error and set the error message
          console.error("Error adding admin:", response.data);
          setError("Не удалось добавить администратора. Попробуйте снова.");
        }

        // Clear the phone number input
        setPhoneNumber("");
      } catch (error) {
        // If an error occurs, log it and set a user-friendly error message
        console.error("Ошибка при добавлении администратора:", error);
        if (error.response && error.response.status === 409) {
          // Handle conflict error, e.g., user already exists
          setError("Пользователь уже существует.");
        } else {
          setError("Ошибка при добавлении администратора. Попробуйте позже.");
        }
      }
    }
  };

  const handleAddDriver = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      try {
        console.log("Adding as driver:", {
          pricePerMinute,
          phoneNumber: phoneNumber.replace("+", ""),
        });
        const response = await axios.post(
          "https://api.24t-taxi.ru/api/user/addUser",
          {
            phoneNumber: phoneNumber.replace("+", ""),
            status: "driver",
          }
        );

        // Check if the response status indicates success
        if (response.status === 201) {
          // Updated to check for 201 (Created)
          console.log("Driver added successfully:", response.data);
          setError(""); // Clear any existing error messages
          // Optionally, you can add a success message for the user
          alert("Водитель успешно добавлен!"); // Simple alert for success
        } else {
          // If the response is not successful, log the error and set the error message
          console.error("Error adding driver:", response.data);
          setError("Не удалось добавить водителя. Попробуйте снова.");
        }

        // Clear the phone number input
        setPhoneNumber("");
      } catch (error) {
        // If an error occurs, log it and set a user-friendly error message
        console.error("Ошибка при добавлении водителя:", error);
        if (error.response && error.response.status === 409) {
          // Handle conflict error, e.g., user already exists
          setError("Пользователь уже существует.");
        } else {
          setError("Ошибка при добавлении водителя. Попробуйте позже.");
        }
      }
    }
  };

  const validatePhoneNumber = (number) => {
    // Regex to validate the phone number format
    const regex = /^\+7\d{10}$/; // Matches +79000000000 format
    if (!regex.test(number)) {
      setError("Номер телефона должен начинаться с +7 и содержать 11 цифр.");
      return false;
    }
    return true;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Настройки</h2>

      <div className="mb-4">
        <label
          htmlFor="pricePerMinute"
          className="block text-sm font-medium mb-1"
        >
          Цена тарифа в минуту
        </label>
        <input
          type="number"
          id="pricePerMinute"
          value={pricePerMinute}
          onChange={(e) => setPricePerMinute(e.target.value)}
          className="w-full border rounded-md p-2"
          placeholder="Введите цену тарифа"
        />
      </div>
      <div className="flex w-full justify-center mb-4">
        <button
          onClick={handleSave}
          className="bg-yellow-500 w-full text-white rounded py-2 px-4 hover:bg-yellow-600"
        >
          Сохранить
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
          Номер телефона
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            setError(""); // Clear error when user types
          }}
          className="w-full border rounded-md p-2"
          placeholder="Введите номер телефона"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        {/* Error message */}
      </div>

      <div className="flex justify-between mb-4 gap-4">
        <button
          onClick={handleAddAdmin}
          className="bg-blue-500 text-white rounded py-2 px-4 w-1/2 hover:bg-blue-600"
        >
          Добавить как администратора
        </button>
        <button
          onClick={handleAddDriver}
          className="bg-green-500 text-white rounded py-2 px-4 w-1/2 hover:bg-green-600"
        >
          Добавить как водителя
        </button>
      </div>
    </div>
  );
};

export default Settings;
