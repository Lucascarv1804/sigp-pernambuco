'use client';

import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('sigp_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setUserName(localStorage.getItem('user_name') || 'Usuário');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao carregar produtos");
    }
  };

  const handleLogout = () => {
    Cookies.remove('sigp_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Padrão GovPE */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold italic">SIGP-PE</h1>
        <div className="flex items-center gap-4">
          <span>Olá, <strong>{userName}</strong></span>
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">Sair</button>
        </div>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Meus Produtos</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Novo Produto
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Dono</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.productId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{p.productName}</td>
                  <td className="p-4 text-gray-600">{p.category?.categoryName}</td>
                  <td className="p-4 text-blue-700 font-bold">R$ {p.productPrice}</td>
                  <td className="p-4 text-sm text-gray-500">{p.owner?.userName}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">Nenhum produto cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}