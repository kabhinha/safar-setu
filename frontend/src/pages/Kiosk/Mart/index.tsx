import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { DealModal } from './components/DealModal';
import type { Product } from '../../../contracts/commerce';

export const KioskMart = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/commerce/products/');
            if (!res.ok) throw new Error("Failed to load products");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load the marketplace.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 animate-fade-in">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex flex-col gap-6 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-xl">Back to Home</span>
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <ShoppingBag className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h1 className="text-4xl font-bold">Mart</h1>
                        </div>
                        <p className="text-slate-400 text-lg ml-14">Local Crafts & Produce</p>
                    </div>
                </div>
            </header>

            {/* Grid */}
            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                        <p className="text-xl text-slate-400">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-10 bg-red-500/10 rounded-2xl border border-red-500/30">
                        <h2 className="text-2xl font-bold text-red-400">Unavailable</h2>
                        <p className="text-slate-300 mt-2">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center p-10 bg-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-200">No products found</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onBuy={setSelectedProduct}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            <DealModal
                isOpen={!!selectedProduct}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
