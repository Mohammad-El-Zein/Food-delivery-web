import axios from "axios";

export const analyzeNutrition = async (foodName, portion) => {
  const response = await axios.post("http://localhost:8080/api/nutrition/analyze", {
    foodName,
    portion
  });
  return response.data;
};