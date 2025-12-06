import axios from "axios";
import i18n from "../i18n"; // <-- wichtig

const API_URL = "http://localhost:8080/api/foods";

export const fetchFoodList = async () => {
  try {
    const lang = i18n.language; // aktuelle Sprache lesen

    const response = await axios.get(API_URL, {
      params: { lang },
    });

    return response.data;
  } catch (error) {
    console.log("Fehler beim Abrufen der Gerichtenliste", error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  try {
    const lang = i18n.language;

    const response = await axios.get(`${API_URL}/${id}`, {
      params: { lang },
    });

    return response.data;
  } catch (error) {
    console.log("Fehler beim Abrufen der Gerichtendetails", error);
    throw error;
  }
};