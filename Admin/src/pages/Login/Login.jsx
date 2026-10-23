import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { login } from '../../services/authService';
import { setToken } from '../../services/api';

const Login = ({ onLogin }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await login(data.email, data.password);
      if (response.role !== 'ADMIN') {
        toast.error('Dieses Konto hat keinen Admin-Zugang.');
        return;
      }
      setToken(response.token);
      onLogin();
    } catch {
      toast.error('E-Mail oder Passwort ist falsch.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '380px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <img src={assets.logo} alt="FlavorHaus" style={{ width: '120px' }} />
            <h4 className="mt-3">Admin-Login</h4>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-Mail</label>
              <input type="email" className="form-control" id="email" name="email" required value={data.email} onChange={onChangeHandler} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Passwort</label>
              <input type="password" className="form-control" id="password" name="password" required value={data.password} onChange={onChangeHandler} />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
