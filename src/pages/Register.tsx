import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    nome_usuario: '',
    email: '',
    whatsapp: '',
    senha: '',
  });
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.senha !== confirmSenha) {
      setError('As senhas não coincidem');
      return;
    }
    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const user = await api.register(form);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-6 rounded pixel-border">
        <h1 className="text-primary text-center text-sm mb-6">NEW ERA</h1>
        <h2 className="text-foreground text-center text-[10px] mb-6">CADASTRO</h2>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive text-[8px] p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-foreground text-[8px] block mb-1">Nome de Usuário</label>
            <input
              name="nome_usuario"
              value={form.nome_usuario}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="Seu nome de usuário"
            />
          </div>

          <div>
            <label className="text-foreground text-[8px] block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-foreground text-[8px] block mb-1">WhatsApp</label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              required
              maxLength={20}
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="text-foreground text-[8px] block mb-1">Senha</label>
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="text-foreground text-[8px] block mb-1">Confirmar Senha</label>
            <input
              type="password"
              value={confirmSenha}
              onChange={e => setConfirmSenha(e.target.value)}
              required
              className="w-full bg-muted text-foreground text-[8px] p-2 rounded border border-border focus:border-primary outline-none"
              placeholder="Repita a senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground text-[8px] p-3 rounded pixel-border hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
          </button>
        </form>

        <p className="text-muted-foreground text-[8px] text-center mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
