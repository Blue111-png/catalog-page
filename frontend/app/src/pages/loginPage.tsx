import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginPage.css';
import loginBg from '../assets/login-bg.jpeg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

 return (
  <main className="login-page">
    <div className="login-page__container">
      <div className="login-page__image">
        <img src={loginBg} alt="" />
      </div>
      <div className="login-page__card">
        <p className="login-page__sup">Admin Access</p>
        <h1 className="login-page__title">Sign In</h1>
        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <label>Username</label>
            <input title='name' name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="login-page__field">
            <label>Password</label>
            <input title='password' name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          {error && <p className="login-page__error">{error}</p>}
          <button type="submit" className="login-page__submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  </main>
);
}