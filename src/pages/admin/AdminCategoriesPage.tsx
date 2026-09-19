import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { fetchCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../services/api';
import { FolderTree, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryFormState {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
}

const EMPTY_FORM: CategoryFormState = {
  name: '',
  description: '',
  imageUrl: '',
  isFeatured: false,
};

export const AdminCategoriesPage: React.FC = () => {
  const { token, showToast } = useStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAddModal = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setForm({
      id: cat.id,
      name: cat.name || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      isFeatured: !!cat.isFeatured,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!form.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      isFeatured: form.isFeatured,
    };

    const res = form.id
      ? await updateAdminCategory(form.id, payload, token || '', imageFile || undefined)
      : await createAdminCategory(payload, token || '', imageFile || undefined);

    if (res.success) {
      showToast(form.id ? 'Category updated successfully' : 'New category created', 'success');
      setIsModalOpen(false);
      loadCategories();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await deleteAdminCategory(id, token || '');
    if (res.success) {
      showToast('Category deleted', 'info');
      loadCategories();
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-gold" /> Product Categories
          </h2>
          <p className="text-xs text-neutral-500">Create, edit, or remove product categories.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-gold text-black font-bold text-xs rounded-xl shadow-sm hover:brightness-105 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
          No categories yet. Create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="relative h-36 bg-neutral-100">
                <img src={cat.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800'} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex items-end">
                  <h3 className="font-serif text-base font-bold text-white">{cat.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
                <p className="text-neutral-600">{cat.description}</p>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-neutral-500 text-[11px] font-mono">/{cat.slug}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="text-gold font-semibold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-rose-600 font-semibold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-neutral-900 rounded-2xl w-full max-w-lg overflow-hidden border border-neutral-200 shadow-2xl my-8 p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h3 className="font-serif text-lg font-bold text-gold">
                {form.id ? 'Update Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-gold"
                  placeholder="e.g. Necklace"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-gold"
                />
                {form.imageUrl && !imageFile && (
                  <p className="text-xs text-neutral-500 mt-1">Current image: {form.imageUrl}</p>
                )}
                {imageFile && (
                  <p className="text-xs text-emerald-600 mt-1">Selected file: {imageFile.name}</p>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-neutral-700 font-medium">Featured on homepage</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-6 py-2 rounded-lg bg-gold text-black font-bold text-xs hover:brightness-105 cursor-pointer shadow-sm"
              >
                Save Category
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
