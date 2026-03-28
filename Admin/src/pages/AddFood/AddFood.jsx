import React from 'react'
import { assets } from '../../assets/assets';
import { useState } from 'react';
import axios from 'axios';
import { Toast } from 'bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addFood } from '../../services/foodService';

const AddFood = () => {
  const [image, setImage]=useState(false);
  const [data, setData]=useState({
    name: '',
    description: '',
    price: '',
    category: 'Pasta',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData( data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(!image) {
      toast.error('Bitte ein Bild hochladen.');
      return;
    }
    try {
      await addFood(data, image);
      toast.success('Gericht erfolgreich hinzugefügt.');
      setData({
        name: '',
        description: '',
        category: 'Pasta',
        price: ''
      });
        setImage(null); 
    } catch (error) {
      toast.error('Fehler beim Hinzufügen des Gerichts.');
      
    }
  }

 return (
    <div className="mx-2 mt-2">
  <div className="row">
    <div className="card col-md-4">
      <div className="card-body">
        <h2 className="mb-4">Gerichte hinzufügen</h2>
        <form onSubmit={onSubmitHandler}>

          <div className="mb-3">
            <label htmlFor="image" className="form-label"> 
             <img src={image ? URL.createObjectURL(image): assets.upload} alt="" width={98} />
            </label>
            <input type="file" className="form-control" id="image"  hidden onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label"> Name</label>
            <input type="text" placeholder='Titel des Gerichts' className="form-control" id="name" required name='name' onChange={onChangeHandler} value={data.name} />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Beschreibung</label>
            <textarea className="form-control" placeholder='Details zum Gericht hier eingeben...' id="description" rows="5" required name='description'onChange={onChangeHandler} value={data.description}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Kategorie</label>
           <select name="category" placeholder='Kategorie auswählen oder eingeben' id="category" className='form-control' onChange={onChangeHandler} value={data.category}>
              <option value="pizza">Pizza</option>
              <option value="pasta">Pasta</option>
              <option value="burger">Burger</option>
              <option value="arabisches">Arabisches</option>
              
              <option value="salat">Salat</option>
              <option value="dessert">Dessert</option>
              <option value="getraenk">Getränk</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Preis</label>
            <input type="number" placeholder='Betrag in Euro eingeben' name="price" id="price" className='form-control' onChange={onChangeHandler} value={data.price} />
           
             </div>
          <button type="submit" className="btn btn-primary">Speichern</button>
        </form>
      </div>
    </div>
  </div>
 </div>


  ) }
    

export default AddFood;