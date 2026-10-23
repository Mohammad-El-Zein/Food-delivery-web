import React from 'react'
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addFood } from '../../services/foodService';

const AddFood = () => {
  const [image, setImage]=useState(null);
  const [saving, setSaving]=useState(false);
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
    if(image.size > 5 * 1024 * 1024) {
      toast.error('Das Bild darf maximal 5 MB groß sein.');
      return;
    }
    setSaving(true);
    try {
      await addFood({ ...data, price: Number(data.price) }, image);
      toast.success('Gericht erfolgreich hinzugefügt.');
      setData({
        name: '',
        description: '',
        category: 'Pasta',
        price: ''
      });
      setImage(null);
    } catch (error) {
      const status = error.response?.status;
      if (status === 413) {
        toast.error('Das Bild ist zu groß (maximal 5 MB).');
      } else if (status === 400) {
        toast.error('Bitte ein gültiges Bild (JPG, PNG, WebP) hochladen.');
      } else {
        toast.error(status
          ? `Fehler beim Hinzufügen des Gerichts (Code ${status}).`
          : 'Keine Antwort vom Server. Bitte später erneut versuchen.');
      }
    } finally {
      setSaving(false);
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
            <input type="file" accept="image/*" className="form-control" id="image"  hidden onChange={(e) => setImage(e.target.files[0])} />
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
           <select name="category" id="category" className='form-control' onChange={onChangeHandler} value={data.category}>
              <option value="Pizza">Pizza</option>
              <option value="Pasta">Pasta</option>
              <option value="Burger">Burger</option>
              <option value="Arabisches">Arabisches</option>
              <option value="Salat">Salat</option>
              <option value="Dessert">Dessert</option>
              <option value="Getränke">Getränke</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Preis</label>
            <input type="number" min="0" step="0.01" required placeholder='Betrag in Euro eingeben' name="price" id="price" className='form-control' onChange={onChangeHandler} value={data.price} />
           
             </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
            {saving ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  </div>
 </div>


  ) }
    

export default AddFood;