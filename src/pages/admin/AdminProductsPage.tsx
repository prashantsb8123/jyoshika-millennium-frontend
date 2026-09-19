import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { fetchProducts, fetchCategories, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../../services/api';
import { Product } from '../../types';
import { Package, Plus, Edit2, Trash2, RotateCcw, Search, X } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminProductsPage: React.FC = () => {
  const { token, formatPrice, showToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSoftDeleted, setShowSoftDeleted] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts(showSoftDeleted ? { isSoftDeleted: 'true' } : {});
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [showSoftDeleted]);

  const handleOpenAddModal = () => {
    setEditingProduct({
      sku: '',
      title: '',
      description: '',
      categoryId: categories[0]?.id,
      price: 0,
      salePrice: undefined,
      stockQuantity: 10,
      images: [],
      tags: []
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.title || !editingProduct?.price) {
      showToast('Please fill required title and price', 'error');
      return;
    }

    if (editingProduct.id) {
      // Update
      const res = await updateAdminProduct(editingProduct.id, editingProduct, token || '', imageFile || undefined);
      if (res.success) {
        showToast('Product updated successfully', 'success');
      } else {
        showToast(res.message, 'error');
        return;
      }
    } else {
      // Create
      const res = await createAdminProduct(editingProduct, token || '', imageFile || undefined);
      if (res.success) {
        showToast('New product created', 'success');
      } else {
        showToast(res.message, 'error');
        return;
      }
    }

    setIsModalOpen(false);
    loadProducts();
  };

  const handleDeleteOrRestore = async (id: string, restore = false) => {
    const res = await deleteAdminProduct(id, token || '', restore);
    if (res.success) {
      showToast(restore ? 'Product restored successfully' : 'Product deleted', 'info');
      loadProducts();
    }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-gold" /> Product Catalog Management
          </h2>
          <p className="text-xs text-neutral-500">Add, edit, soft delete, or restore product inventory.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSoftDeleted(!showSoftDeleted)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              showSoftDeleted
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-gold'
            }`}
          >
            {showSoftDeleted ? 'Showing Deleted' : 'Show Deleted Items'}
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2 rounded-xl bg-gold text-black font-bold text-xs shadow-sm hover:brightness-105 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
        <input
          type="text"
          placeholder="Filter by SKU, Title, or Category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-gold"
        />
      </div>

      {/* Products Table (Desktop) & Mobile Cards */}
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-gold font-serif border-b border-neutral-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category & SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">Loading products catalog...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((prod) => (
                    <tr key={prod.id} className={`hover:bg-neutral-50 ${prod.isSoftDeleted ? 'opacity-50 bg-rose-50' : ''}`}>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 object-cover rounded-lg border border-neutral-200" />
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{prod.title}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-neutral-800">{prod.category}</p>
                        <span className="text-[10px] font-mono text-neutral-500">{prod.sku || '—'}</span>
                      </td>

                      <td className="py-3 px-4 font-serif font-bold text-gold">
                        {formatPrice(prod.salePrice != null && prod.salePrice < prod.price ? prod.salePrice : prod.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${prod.stockQuantity > 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {prod.stockQuantity} In Stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {prod.isSoftDeleted ? (
                          <button
                            onClick={() => handleDeleteOrRestore(prod.id, true)}
                            className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 cursor-pointer"
                            title="Restore Product"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200 rounded-lg cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrRestore(prod.id, false)}
                              className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg cursor-pointer"
                              title="Soft Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {loading ? (
            <div className="py-8 text-center text-xs text-neutral-500 bg-white p-4 rounded-2xl border border-neutral-200">
              Loading products catalog...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 bg-white p-4 rounded-2xl border border-neutral-200">
              No products found.
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 text-xs shadow-xs ${
                  prod.isSoftDeleted ? 'opacity-60 bg-rose-50/50' : ''
                }`}
              >
                <div className="flex gap-3 items-start">
                  <img src={prod.images[0]} alt={prod.title} className="w-16 h-16 object-cover rounded-xl border border-neutral-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-neutral-900 text-xs line-clamp-2">{prod.title}</h4>
                      <span className="font-serif font-extrabold text-gold shrink-0 text-xs">
                        {formatPrice(prod.salePrice != null && prod.salePrice < prod.price ? prod.salePrice : prod.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{prod.category} • <span className="font-mono">{prod.sku || '—'}</span></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-[11px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${prod.stockQuantity > 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {prod.stockQuantity} In Stock
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {prod.isSoftDeleted ? (
                      <button
                        onClick={() => handleDeleteOrRestore(prod.id, true)}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="px-3 py-1.5 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-lg hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrRestore(prod.id, false)}
                          className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hover:bg-rose-200 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-neutral-900 rounded-2xl w-full max-w-3xl overflow-hidden border border-neutral-200 shadow-2xl my-8 p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h3 className="font-serif text-lg font-bold text-gold">
                {editingProduct.id ? 'Update Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 mb-1">Title</label>
                <input
                  type="text"
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 mb-1">Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Category</label>
                <select
                  value={editingProduct.categoryId || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">SKU (Optional)</label>
                <input
                  type="text"
                  value={editingProduct.sku || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Price / MRP (INR)</label>
                <input
                  type="number"
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Sale Price (Optional)</label>
                <input
                  type="number"
                  value={editingProduct.salePrice ?? ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value === '' ? undefined : Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={editingProduct.stockQuantity || 1}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-neutral-700 font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isNewArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-neutral-700 font-medium">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isBestSeller}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-neutral-700 font-medium">Best Seller</span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none"
                />
                {editingProduct.images && editingProduct.images.length > 0 && !imageFile && (
                  <p className="text-xs text-neutral-500 mt-1">Current image: {editingProduct.images[0]}</p>
                )}
                {imageFile && (
                  <p className="text-xs text-emerald-600 mt-1">Selected file: {imageFile.name}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-6 py-2 rounded-lg bg-gold text-black font-bold text-xs hover:brightness-105 cursor-pointer shadow-sm"
              >
                Save Product
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
