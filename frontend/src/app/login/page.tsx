import { useState } from 'react';
import { api } from '../../services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, passwordRaw: password });
      
      // Salva o token por 1 dia
      Cookies.set('sigp_token', response.data.access_token, { expires: 1 });
      localStorage.setItem('user_name', response.data.userName);
      
      router.push('/dashboard');
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-blue-700">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">SIGP-PE</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">Sistema Integrado de Gestão de Produtos</p>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors font-bold"
          >
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
}