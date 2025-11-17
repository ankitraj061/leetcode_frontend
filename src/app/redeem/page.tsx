'use client';
import { useState, ReactNode, useEffect } from 'react';
import { FiLock, FiCheck, FiShoppingCart, FiStar, FiTrendingUp } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import Footer from '../components/Footer';

interface Product {
  id: number;
  name: string;
  points: number;
  image: string;
  description: string;
  color: string;
  badge: string | null;
}

export default function RedeemProducts(): ReactNode {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [redeemed, setRedeemed] = useState<number[]>([]);

  const products: Product[] = [
    {
      id: 1,
      name: 'T-Shirt',
      points: 5000,
      image: 'https://ik.imagekit.io/tvz1mupab/tshirt.png?updatedAt=1763209183166',
      description: 'Premium coding platform t-shirt',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Popular'
    },
    {
      id: 2,
      name: 'Hoodie',
      points: 8000,
      image: 'https://ik.imagekit.io/tvz1mupab/hoody.png?updatedAt=1763209142519',
      description: 'Cozy hoodie for coders',
      color: 'from-purple-500 to-pink-500',
      badge: 'Premium'
    },
    {
      id: 3,
      name: 'Cap + Dairy',
      points: 4500,
      image: 'https://ik.imagekit.io/tvz1mupab/dairy+cap.png?updatedAt=1763209225028',
      description: 'Cap with bonus dairy item',
      color: 'from-orange-500 to-red-500',
      badge: null
    },
    {
      id: 4,
      name: 'Water Bottle',
      points: 3500,
      image: 'https://ik.imagekit.io/tvz1mupab/waterBottle.png?updatedAt=1763209022630',
      description: 'Stainless steel water bottle',
      color: 'from-green-500 to-teal-500',
      badge: null
    },
    {
      id: 5,
      name: 'Dairy + Pen',
      points: 2800,
      image: 'https://ik.imagekit.io/tvz1mupab/dairy+Pen.png?updatedAt=1763209062367',
      description: 'Dairy notebook with premium pen',
      color: 'from-yellow-500 to-orange-500',
      badge: null
    },
    {
      id: 6,
      name: 'Ultimate Bundle',
      points: 12000,
      image: 'https://ik.imagekit.io/tvz1mupab/allthings.png?updatedAt=1763209105542',
      description: 'All items in one bundle',
      color: 'from-pink-500 to-rose-500',
      badge: 'Best Value'
    },
    {
      id: 7,
      name: 'Backpack',
      points: 7500,
      image: 'https://ik.imagekit.io/tvz1mupab/Gemini_Generated_Image_53sf2i53sf2i53sf.png?updatedAt=1763209660281',
      description: 'Premium coding backpack',
      color: 'from-indigo-500 to-blue-500',
      badge: null
    }
  ];

  const handleRedeem = (product: Product): void => {
    if (userPoints >= product.points && !redeemed.includes(product.id)) {
      setUserPoints(userPoints - product.points);
      setRedeemed([...redeemed, product.id]);
      setTimeout(() => setSelectedProduct(null), 500);
    }
  };

  const canRedeem = (points: number): boolean => userPoints >= points;
  const isRedeemed = (id: number): boolean => redeemed.includes(id);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto mb-12 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 flex items-center gap-3 text-primary">
                <HiSparkles className="text-yellow-400" size={40} />
                Redeem Rewards
              </h1>
              <p className="text-lg text-secondary">
                Unlock exclusive merchandise by earning points in contests
              </p>
            </div>
            <div className="bg-accent rounded-2xl p-6 shadow-xl">
              <p className="text-sm font-semibold mb-1 text-inverse">
                Your Points
              </p>
              <p className="text-4xl font-bold text-inverse">{userPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Info Bar */}
          <div className="bg-secondary border border-primary rounded-xl p-4 flex items-center gap-3 transition-colors">
            <FiTrendingUp className="text-brand" size={20} />
            <p className="text-secondary">
              Contests launching soon! Earn points and unlock premium merchandise. 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid - BRUTALIST STYLE */}
      <div className="max-w-7xl mx-auto p-8 bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative cursor-pointer transition-all duration-300 hover:-translate-x-2 hover:-translate-y-2 active:translate-x-1 active:translate-y-1"
              onClick={() => setSelectedProduct(product)}
            >
              {/* BRUTALIST CARD with thick border and offset shadow */}
              <div className="relative bg-white dark:bg-gray-900 border-[5px] border-black dark:border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] overflow-hidden transition-all duration-300">
                
                {/* Top corner accent (like card::before) */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${product.color} rotate-45 z-10`}></div>
                
                {/* Star badge (like card::after) */}
                <div className="absolute top-3 right-3 text-black dark:text-white text-xl font-bold z-20">★</div>

                {/* Pattern Grid Overlay */}
                <div 
                  className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none z-[1]"
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}
                ></div>

                {/* Dot Pattern Overlay */}
              {/* Pattern Grid Overlay - KEEP THIS */}
<div 
  className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none z-[1]"
  style={{
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
    backgroundSize: '8px 8px'
  }}
></div>


                {/* Badge - BRUTALIST style */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-900 text-black dark:text-white text-xs font-extrabold border-[3px] border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] uppercase tracking-wider rotate-3 group-hover:-rotate-2 transition-transform`}>
                      <FiStar size={12} />
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Redeem Status Overlay */}
                {isRedeemed(product.id) && (
                  <div className="absolute inset-0 bg-green-500/30 backdrop-blur-sm flex items-center justify-center z-30 border-[5px] border-green-600">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-green-500 border-[4px] border-black dark:border-white rounded-full flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <FiCheck size={32} className="text-white font-bold" />
                      </div>
                      <p className="text-green-900 dark:text-green-100 font-extrabold text-lg uppercase tracking-wide">Redeemed!</p>
                    </div>
                  </div>
                )}

                {/* Title Area with Pattern - BRUTALIST header */}
                <div className={`relative p-5 bg-gradient-to-r ${product.color} border-b-[5px] border-black dark:border-white overflow-hidden z-[2]`}>
                  {/* Diagonal stripe pattern (like card-title-area::before) */}
                  <div 
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 8px, transparent 8px, transparent 16px)'
                    }}
                  ></div>
                  
                  <h3 className="relative text-lg font-extrabold text-white uppercase tracking-wide line-clamp-2 z-10">
                    {product.name}
                  </h3>
                </div>

                {/* Image Container */}
                <div className="relative h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center p-4 border-b-[3px] border-black/10 dark:border-white/10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 relative z-[2]">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold line-clamp-2">
                    {product.description}
                  </p>

                  {/* Points with underline accent (like price::before) */}
                  <div className="flex items-center justify-between pt-3 border-t-[3px] border-dashed border-black/20 dark:border-white/20 relative">
                    {/* Scissors icon */}
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 px-2 text-lg rotate-90">✂</span>
                    
                    <div className="flex items-center gap-2">
                      <FiStar className="text-yellow-400" size={18} />
                      <span className="text-xl font-extrabold text-black dark:text-white relative">
                        {product.points.toLocaleString()}
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 -z-10 opacity-50"></span>
                      </span>
                    </div>
                    {!canRedeem(product.points) && !isRedeemed(product.id) && (
                      <FiLock className="text-red-500" size={18} />
                    )}
                  </div>

                  {/* Redeem Button - BRUTALIST style */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canRedeem(product.points) && !isRedeemed(product.id)) {
                        handleRedeem(product);
                      }
                    }}
                    disabled={!canRedeem(product.points) || isRedeemed(product.id)}
                    className={`w-full py-3 font-extrabold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wide border-[3px] rounded-lg overflow-hidden relative ${
                      isRedeemed(product.id)
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-600 cursor-default shadow-[3px_3px_0px_0px_rgba(22,163,74,0.3)]'
                        : canRedeem(product.points)
                        ? `bg-gradient-to-r ${product.color} text-white border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5`
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {/* Shine effect on hover (like card-button::before) */}
                    {canRedeem(product.points) && !isRedeemed(product.id) && (
                      <span className="absolute inset-0 -left-full group-hover:left-full transition-all duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                    )}
                    <FiShoppingCart size={16} className="relative z-10" />
                    <span className="relative z-10">{isRedeemed(product.id) ? 'Redeemed' : 'Redeem Now'}</span>
                  </button>
                </div>

                {/* Bottom corner slice (like corner-slice) */}
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-white dark:bg-gray-900 border-r-[4px] border-t-[4px] border-black dark:border-white rounded-tr-lg z-[1]"></div>

                {/* Accent shape (like accent-shape) */}
                <div className={`absolute w-10 h-10 bg-gradient-to-br ${product.color} border-[3px] border-black dark:border-white rounded-md rotate-45 -bottom-5 right-8 transition-transform group-hover:rotate-[55deg] group-hover:scale-110`}></div>

                {/* Stamp (like stamp) */}
                <div className="absolute bottom-6 left-6 w-16 h-16 flex items-center justify-center border-[3px] border-black/30 dark:border-white/30 rounded-full -rotate-15 opacity-20 z-[1]">
                  <span className="text-[10px] font-extrabold uppercase tracking-tight">Approved</span>
                </div>

                {/* Dots pattern bottom left (like dots-pattern) */}
              <svg className="absolute -bottom-4 -left-8 w-32 h-16 opacity-30 -rotate-12 pointer-events-none z-[1]" viewBox="0 0 80 40">
  <circle fill="currentColor" r={3} cy={10} cx={10} />
  <circle fill="currentColor" r={3} cy={10} cx={30} />
  <circle fill="currentColor" r={3} cy={10} cx={50} />
  <circle fill="currentColor" r={3} cy={10} cx={70} />
  <circle fill="currentColor" r={3} cy={20} cx={20} />
  <circle fill="currentColor" r={3} cy={20} cx={40} />
  <circle fill="currentColor" r={3} cy={20} cx={60} />
  <circle fill="currentColor" r={3} cy={30} cx={10} />
  <circle fill="currentColor" r={3} cy={30} cx={30} />
  <circle fill="currentColor" r={3} cy={30} cx={50} />
  <circle fill="currentColor" r={3} cy={30} cx={70} />
</svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - BRUTALIST style */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border-[6px] border-black dark:border-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] overflow-hidden animate-in fade-in scale-95 duration-200">
            
            {/* Top corner accent */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${selectedProduct.color} rotate-45 z-10`}></div>
            <div className="absolute top-4 right-4 text-black dark:text-white text-2xl font-bold z-20">★</div>

            <div className={`relative h-64 bg-gradient-to-br ${selectedProduct.color} border-b-[6px] border-black dark:border-white flex items-center justify-center p-6`}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="p-8 space-y-6 relative">
              <div>
                <h2 className="text-3xl font-extrabold mb-2 text-black dark:text-white uppercase tracking-wide">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-5 bg-gray-100 dark:bg-gray-800 rounded-xl border-[4px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <span className="font-extrabold text-gray-700 dark:text-gray-300 uppercase text-sm">
                  Points Required:
                </span>
                <div className="flex items-center gap-2">
                  <FiStar className="text-yellow-400" size={24} />
                  <span className="text-3xl font-extrabold text-black dark:text-white">
                    {selectedProduct.points.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={`p-5 rounded-xl border-[4px] ${
                userPoints >= selectedProduct.points
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-600'
                  : 'bg-red-100 dark:bg-red-900/20 border-red-600'
              }`}>
                <p className={`text-sm font-extrabold uppercase ${
                  userPoints >= selectedProduct.points
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {userPoints >= selectedProduct.points
                    ? `✓ You have enough! ${(userPoints - selectedProduct.points).toLocaleString()} points remaining`
                    : `✗ Need ${(selectedProduct.points - userPoints).toLocaleString()} more points`}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 bg-white dark:bg-gray-800 text-black dark:text-white font-extrabold rounded-xl border-[4px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRedeem(selectedProduct)}
                  disabled={!canRedeem(selectedProduct.points) || isRedeemed(selectedProduct.id)}
                  className={`flex-1 py-3 rounded-xl font-extrabold transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wide border-[4px] ${
                    canRedeem(selectedProduct.points) && !isRedeemed(selectedProduct.id)
                      ? `bg-gradient-to-r ${selectedProduct.color} text-white border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 border-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <FiShoppingCart size={18} />
                  {isRedeemed(selectedProduct.id) ? 'Redeemed' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
