import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      login(res.user, res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-6 rounded pixel-border">
        <h1 className="text-primary text-center text-sm mb-6">NEW ERA</h1>
        <h2 className="text-foreground text-center text-[10px] mb-6">LOGIN</h2>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive text-[8px] p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-foreground text-[8px] block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-foreground text-[8px] block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground text-[8px] p-3 rounded pixel-border hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p className="text-muted-foreground text-[8px] text-center mt-4">
          Não tem conta?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
