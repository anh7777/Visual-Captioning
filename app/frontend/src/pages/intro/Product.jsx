import React from "react";

function Product() {
  const products = [
    {
      id: 1,
      title: "Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=80",
      caption: "Immerse yourself in crystal-clear sound with our noise-cancelling technology. Perfect for music lovers on the go.",
      color: "bg-gradient-to-br from-purple-400 to-indigo-500"
    },
    {
      id: 2,
      title: "Pro Camera",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop&q=80",
      caption: "Capture life's most precious moments with exceptional clarity. Advanced night mode and AI enhancement included.",
      color: "bg-gradient-to-br from-emerald-400 to-teal-500"
    },
    {
      id: 3,
      title: "Ultra Laptop",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&q=80",
      caption: "Incredibly thin yet powerful. The perfect companion for creative professionals who demand performance on the move.",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Smart Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
      caption: "Track your well-being 24/7 with comprehensive health monitoring. Seamlessly connects to your digital ecosystem.",
      color: "bg-gradient-to-br from-pink-400 to-rose-500"
    },
    {
      id: 5,
      title: "Smart Speaker",
      image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=400&fit=crop&q=80",
      caption: "Fill your space with immersive 360° sound. Voice-controlled assistant helps manage your home with simple commands.",
      color: "bg-gradient-to-br from-amber-400 to-orange-500"
    },
    {
      id: 6,
      title: "Foldable Phone",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop&q=80",
      caption: "Experience the future of mobile technology with our revolutionary foldable display. Elegance meets innovation.",
      color: "bg-gradient-to-br from-red-400 to-pink-500"
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full items-center p-8 bg-gradient-to-b from-white to-blue-50">
      <div className="flex not-md:flex-col gap-6 justify-between max-w-[1860px]">
        {products.slice(0, 3).map((product, index) => (
          <div 
            key={product.id} 
            className="w-1/3 not-md:w-full overflow-hidden bg-white rounded-3xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-100/50 animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className={`h-56 ${product.color} flex justify-center items-center overflow-hidden rounded-t-3xl relative group`}>
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-b-3xl border-t border-blue-100/50">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{product.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{product.caption}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex not-md:flex-col gap-6 justify-between max-w-[1860px]">
        {products.slice(3, 6).map((product, index) => (
          <div 
            key={product.id} 
            className="w-1/3 not-md:w-full overflow-hidden bg-white rounded-3xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-100/50 animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className={`h-56 ${product.color} flex justify-center items-center overflow-hidden rounded-t-3xl relative group`}>
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-b-3xl border-t border-blue-100/50">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{product.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{product.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;