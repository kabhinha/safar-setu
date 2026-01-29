import React from 'react';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../../../../contracts/commerce';

interface ProductCardProps {
    product: Product;
    onBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 flex flex-col gap-4 hover:border-emerald-500/50 transition-all animate-fade-in">
            <div className="h-40 bg-emerald-900/10 rounded-xl flex items-center justify-center mb-2">
                <ShoppingBag className="w-16 h-16 text-emerald-500/40" />
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
                <p className="text-sm text-emerald-400 font-mono mb-2">₹{product.price}</p>
                <p className="text-slate-400 text-sm line-clamp-2">{product.description}</p>
            </div>

            <button
                onClick={() => onBuy(product)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
                <span>Buy Now</span>
            </button>
        </div>
    );
};
