import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; 
import './ListFood.css';
import { getFoodList, deleteFood } from '../../services/foodService';

// Das Backend liefert name als Objekt pro Sprache, z. B. { de: "Pizza Margherita" }
const getText = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.de || Object.values(value)[0] || '';
};





const ListFood = () => {
  const [list, setList]= useState([]);
  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch {
      toast.error('Fehler beim Lesen der Gerichte.');
    }
    
  }

  const removeFood = async (foodId) => {
    if (!window.confirm('Dieses Gericht wirklich löschen?')) return;
    try {
      const success = await deleteFood(foodId);
      if(success) { 
        toast.success('Gericht erfolgreich gelöscht.');
        await fetchList();
      }else {
        toast.error('Fehler beim Löschen des Gerichts.');
      }
      
    } catch {
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
          { list.map( (item) => {
            return (
              <tr key={item.id}>
                <td>
                  <img src={item.imageUrl} alt={getText(item.name)} height={48} width={48} />
                </td>
                <td>{getText(item.name)}</td>
                <td>{item.category}</td>
                <td>{Number(item.price).toFixed(2)} €</td>
                <td className='text-danger'>
                  <i className='bi bi-x-circle-fill' role='button' title='Löschen' onClick={() => removeFood(item.id)}></i>
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