import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, 
  MoreVertical, Tag, DollarSign, Layers,
  ShoppingBag, ArrowUpRight, BarChart2
} from 'lucide-react';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Product Catalog</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage enterprise solutions and inventory assets</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-primary-600 rounded-[2rem] text-white space-y-4 shadow-xl shadow-primary-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-70">Total Products</p>
            <h3 className="text-3xl font-black">{products.length}</h3>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Value</p>
            <h3 className="text-3xl font-black text-slate-900">
              ${products.reduce((acc, p) => acc + (p.unitPrice * (p.quantityInStock || 0)), 0).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Inventory Status</p>
            <h3 className="text-3xl font-black text-slate-900">
              {products.filter(p => p.quantityInStock > 0).length} / {products.length} Active
            </h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Categories</p>
            <h3 className="text-3xl font-black text-slate-900">
              {[...new Set(products.map(p => p.category))].filter(Boolean).length}
            </h3>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="text" placeholder="Search catalog..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-primary-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{product.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    {product.category || 'N/A'}
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">
                    ${product.unitPrice?.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.quantityInStock > 20 ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(product.quantityInStock, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-700">{product.quantityInStock || 0}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      product.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Catalog is empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Start populating your catalog with enterprise solutions and products.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-primary-600 font-black hover:underline"
            >
              + Add First Product
            </button>
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductAdded={handleProductAdded} 
      />
    </div>
  );
};

export default Products;
