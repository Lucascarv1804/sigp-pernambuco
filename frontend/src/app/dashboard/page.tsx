'use client';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Estados do Formulário
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const token = Cookies.get('sigp_token');
    if (!token) { router.push('/login'); return; }
    setUserName(localStorage.getItem('user_name') || 'Usuário');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error("Erro ao carregar dados"); }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      await api.post('/categories', { categoryName: newCategoryName });
      setNewCategoryName('');
      loadData();
      alert('Categoria criada!');
    } catch (err) { alert('Erro ao criar categoria'); }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        productName,
        productPrice: Number(productPrice),
        categoryId
      });
      setShowModal(false);
      setProductName('');
      setProductPrice('');
      loadData();
    } catch (err) { alert('Erro ao criar produto. Verifique se escolheu a categoria.'); }
  };

  const handleLogout = () => {
    Cookies.remove('sigp_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold italic">SIGP-PE</h1>
        <div className="flex items-center gap-4">
          <span>Olá, <strong>{userName}</strong></span>
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">Sair</button>
        </div>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Produtos</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold shadow-lg transition-transform active:scale-95"
          >
            + Novo Produto / Categoria
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 border-b text-gray-700 font-bold">
              <tr>
                <th className="p-4">Nome do Produto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Dono do Registro</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.productId} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{p.productName}</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold uppercase">{p.category?.categoryName}</span></td>
                  <td className="p-4 text-blue-700 font-bold">R$ {Number(p.productPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-sm text-gray-500">{p.owner?.userName}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 italic">Nenhum produto encontrado no sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-blue-900">Cadastrar Item</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>

            {/* Seção Categoria */}
            <div className="mb-6 p-3 bg-gray-50 rounded border border-dashed border-gray-300">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Criar Nova Categoria</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-2 border rounded text-sm text-gray-900" 
                  placeholder="Ex: Alimentos"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button onClick={handleCreateCategory} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+</button>
              </div>
            </div>

            {/* Formulário Produto */}
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">2. Detalhes do Produto</label>
              <input 
                required className="w-full p-2 border rounded text-gray-900" 
                placeholder="Nome do Produto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <input 
                required type="number" step="0.01" className="w-full p-2 border rounded text-gray-900" 
                placeholder="Preço (Ex: 50.00)"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <select 
                required className="w-full p-2 border rounded text-gray-900 bg-white"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Selecione uma Categoria</option>
                {categories.map((c: any) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
              </select>
              
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 shadow-md">
                SALVAR PRODUTO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}