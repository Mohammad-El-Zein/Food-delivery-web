import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; 
import './ListFood.css';
import { getFoodList } from '../../services/foodService';
import { deleteFood } from '../../services/foodService';





const ListFood = () => {
  const [list, setList]= useState([]);
  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    }catch (error) {
      toast.error('Fehler beim Lesen der Gerichte.');
    }
    
  }

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if(success) { 
        toast.success('Gericht erfolgreich gelöscht.');
        await fetchList();
      }else {
        toast.error('Fehler beim Löschen des Gerichts.');
      }
      
    } catch (error) {
      toast.error('Fehler beim Löschen des Gerichts.');
      
    }
     
  }



  useEffect(() => { 
   fetchList();
  }, []);
   
  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
      <table className='table'>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Name</th>
            <th>Kategorie</th>
            <th>Preis</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          { list.map( (item, index) => {
            return (
              <tr key={index}>
                <td>
                  <img src={item.imageUrl} alt="" height={48} width={48} />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.price}.00 € </td>
                <td className='text-danger'>
                  <i className='bi bi-x-circle-fill' onClick={() => removeFood(item.id)}></i>
                 </td>
                </tr>
            )
          })

          } 
          </tbody>
      </table> 
    </div>
    </div>
        
    
    
  )
}


export default ListFood;