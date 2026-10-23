import api from './api';

export const addFood = async (foodData, image) => {
    const formData = new FormData();
    formData.append('food', JSON.stringify(foodData));
    formData.append('file', image);

   try { 
      await api.post('/foods', formData);
    } catch (error) {
      console.log('Error', error);
      throw error;  
    } 
}

export const getFoodList = async () => { 

  try {
    const response = await api.get('/foods');
    return response.data;

  } catch (error) {
    console.log('Fehler beim Abrufen der Essensliste', error);
    throw error;  
  }
}

export const deleteFood = async (foodId) => {
  try {
   const response = await api.delete('/foods/'+foodId);
    return response.status===204;
  } catch (error) {
    console.log('Fehler beim Löschen des Gerichts', error);
    throw error;
  }

}
