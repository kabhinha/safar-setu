import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ProductCard } from '../../Mart/components/ProductCard';
import { DealModal } from '../../Mart/components/DealModal';
import type { Product } from '../../../../contracts/commerce';

export const MartPanel: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/commerce/products/');
                if (!res.ok) throw new Error("Failed to load products");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError("Unable to load the marketplace.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl">
                <p className="text-sm text-emerald-300">
                    🛍️ <b>Tap "Buy Now"</b> to generate a QR code. Scan with your phone to complete the purchase at the vendor.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                    <p className="text-slate-400">Loading products...</p>
                </div>
            ) : error ? (
                <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/30 text-center">
                    <p className="text-red-400 font-bold">{error}</p>
                </div>
            ) : products.length === 0 ? (
                <div className="p-6 bg-slate-800 rounded-2xl text-center">
                    <p className="text-slate-400">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 pb-8">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onBuy={setSelectedProduct}
                        />
                    ))}
                </div>
            )}

            <DealModal
                isOpen={!!selectedProduct}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
