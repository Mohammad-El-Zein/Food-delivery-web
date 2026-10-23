import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://flavorhaus-mo.up.railway.app';
const API_URL = `${BASE_URL}/api/foods`;

export const addFood = async (foodData, image) => {
    const formData = new FormData();
    formData.append('food', JSON.stringify(foodData));
    formData.append('file', image);

   try { 
      await axios.post(API_URL, formData);
    } catch (error) {
      console.log('Error', error);
      throw error;  
    } 
}

export const getFoodList = async () => { 

  try {
    const response = await axios.get(API_URL);
    return response.data;

  } catch (error) {
    console.log('Fehler beim Abrufen der Essensliste', error);
    throw error;  
  }
}

export const deleteFood = async (foodId) => {
  try {
   const response = await axios.delete(API_URL+"/"+foodId);
    return response.status===204;
  } catch (error) {
    console.log('Fehler beim Löschen des Gerichts', error);
    throw error;
  }

}
