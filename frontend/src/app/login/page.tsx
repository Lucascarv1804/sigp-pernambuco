'use client';

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
        setError('');
        try {
            const response = await api.post('/auth/login', {
                email,
                passwordRaw: password
            });

            Cookies.set('sigp_token', response.data.access_token, { expires: 1 });
            localStorage.setItem('user_name', response.data.userName);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'E-mail ou senha inválidos.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-blue-700">
                <h1 className="text-2xl font-bold text-blue-900 mb-2 text-center">SIGP-PE</h1>
                <p className="text-sm text-gray-600 mb-6 text-center italic">Sistema Integrado de Gestão de Produtos</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">E-mail Institucional</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded mt-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Senha</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded mt-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition-colors font-bold shadow-sm"
                    >
                        ENTRAR NO SISTEMA
                    </button>
                </form>
            </div>
        </div>
    );
}