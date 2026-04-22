'use client';

import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [userName, setUserName] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = Cookies.get('sigp_token');
        if (!token) {
            router.push('/login');
            return;
        }
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
        } catch (err) {
            toast.error('Erro ao sincronizar dados.');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName) {
            toast.error('Informe o nome da categoria');
            return;
        }
        try {
            await api.post('/categories', { categoryName: newCategoryName });
            setNewCategoryName('');
            loadData();
            toast.success('Categoria criada!');
        } catch (err) {
            toast.error('Erro ao criar categoria.');
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            toast.error('Selecione uma categoria');
            return;
        }
        try {
            await api.post('/products', {
                productName,
                productPrice: Number(productPrice),
                categoryId
            });
            setShowModal(false);
            setProductName('');
            setProductPrice('');
            setCategoryId('');
            loadData();
            toast.success('Produto salvo!');
        } catch (err) {
            toast.error('Erro ao salvar produto.');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Deseja excluir este produto?')) return;
        try {
            await api.delete(`/products/${id}`);
            loadData();
            toast.success('Produto removido');
        } catch (err) {
            toast.error('Erro ao excluir');
        }
    };

    const handleLogout = () => {
        Cookies.remove('sigp_token');
        localStorage.removeItem('user_name');
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestão de Produtos</h2>
                        <p className="text-sm text-gray-500">Visualize e gerencie o estoque institucional</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="🔍 Buscar produto..."
                            className="p-2 border rounded-lg w-full md:w-64 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold shadow-md transition-all whitespace-nowrap"
                        >
                            + Novo Item
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-white font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4">Produto</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Preço</th>
                                <th className="p-4">Dono do Registro</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products
                                .filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((p: any) => (
                                    <tr key={p.productId} className="hover:bg-blue-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-900">{p.productName}</td>
                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                                                {p.category?.categoryName}
                                            </span>
                                        </td>
                                        <td className="p-4 text-blue-700 font-bold">
                                            R$ {Number(p.productPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{p.owner?.userName}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDeleteProduct(p.productId)}
                                                className="text-red-600 hover:text-red-800 font-bold hover:underline"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold text-blue-900">Cadastrar Item</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <div className="mb-6 p-3 bg-gray-50 rounded border border-dashed border-gray-300">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Criar Categoria</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 p-2 border rounded text-sm text-gray-900"
                                    placeholder="Ex: Informática"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                                <button onClick={handleCreateCategory} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+</button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase">2. Detalhes do Produto</label>
                            <input
                                required
                                className="w-full p-2 border rounded text-gray-900"
                                placeholder="Nome do Produto"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full p-2 border rounded text-gray-900"
                                placeholder="Preço"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                            <select
                                required
                                className="w-full p-2 border rounded text-gray-900 bg-white"
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