import axios from "axios";
import { createContext, useEffect, useState } from "react";
import React from "react";
import { fetchFoodList } from "../service/foodService.js";
import {
  addToCart,
  deleteItemFromCart,
  getCartData,
  removeQtyFromCart,
} from "../service/cartService.js";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  // Abgelaufener/ungültiger Login (401 vom Backend): Token löschen und zum Login schicken,
  // sonst bleibt man scheinbar eingeloggt und Warenkorb/Bestellung schlagen immer fehl
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const url = error.config?.url || "";
        const isAuthCall = url.includes("/api/login") || url.includes("/api/register");
        if (error.response?.status === 401 && !isAuthCall && localStorage.getItem("token")) {
          localStorage.removeItem("token");
          setToken("");
          setQuantities({});
          toast.info(t("messages.sessionExpired"), { toastId: "session-expired" });
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate, t]);

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    await addToCart(foodId, token);
  };

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));
    await removeQtyFromCart(foodId, token);
  };

  const removeFromCart = async (foodId) => {
    await deleteItemFromCart(foodId, token);

    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
  };

  const loadCartData = async (token) => {
    const items = await getCartData(token);
    setQuantities(items || {});
  };

  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
    lang,
  };

  useEffect(() => {
    async function localData() {
      const data = await fetchFoodList();
      setFoodList(data);

      if (localStorage.getItem("token")) {
        const stored = localStorage.getItem("token");
        setToken(stored);
        await loadCartData(stored);
      }
    }

    localData();
  }, [i18n.language]);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
