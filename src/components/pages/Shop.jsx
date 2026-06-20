'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SpiritualShop = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);

  const products = [
    {
      id: 1,
      name: "Premium Rudraksha Mala",
      category: "Malas",
      price: 1299,
      originalPrice: 1799,
      rating: 4.9,
      reviews: 312,
      description: "108 beads, 5-mukhi, certified",
      image: "https://www.haridwarrudraksha.com/cdn/shop/files/7-mukhi-rudraksha-nepali-mala-33-beads-3-jpg-webp.webp?v=1739192156",
      badge: "Bestseller",
      badgeColor: "warning",
      inStock: true
    },
    {
      id: 2,
      name: "Sattvic Agarbatti Set",
      category: "Incense",
      price: 349,
      originalPrice: 499,
      rating: 4.8,
      reviews: 524,
      description: "Pack of 6 — Rose, Sandalwood & Jasmine",
      image: "https://m.media-amazon.com/images/I/71rEXHI8qVL._AC_UF894,1000_QL80_.jpg",
      badge: "Popular",
      badgeColor: "info",
      inStock: true
    },
    {
      id: 6,
      name: "Sandalwood Chandan Mala",
      category: "Malas",
      price: 899,
      originalPrice: 1199,
      rating: 4.8,
      reviews: 176,
      description: "Aromatic 108-bead sandalwood mala",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6hDQOIhGjri1qf5tllOPi-MxssIuQ1juew&s",
      badge: "Aromatic",
      badgeColor: "warning",
      inStock: false
    }
  ];

  const categories = ['All', 'Malas', 'Incense', 'Puja Kits', 'Diyas', 'Yantras'];

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-4 min-vh-100" style={{ background: 'transparent' }}>
      <style>{`
        .shop-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          transition: all 0.2s ease;
          overflow: hidden;
        }
        .shop-card:hover {
          background: rgba(255,255,255,0.10);
          transform: translateY(-2px);
        }
        .product-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 2 / 1;
        }
        .product-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-img-wrap:hover img {
          transform: scale(1.05);
        }
        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.6), transparent);
        }
        .out-of-stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wishlist-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .wishlist-btn:hover {
          background: rgba(0,0,0,0.65);
        }
        .product-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: 0.375rem;
        }
        .category-btn {
          white-space: nowrap;
          flex-shrink: 0;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        .category-btn.active {
          background: rgba(245,158,11,0.25) !important;
          color: #fbbf24 !important;
          border-color: rgba(245,158,11,0.4) !important;
        }
        .category-btn:not(.active) {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          border-color: rgba(255,255,255,0.1);
        }
        .shop-search {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          color: white;
          padding-left: 2.75rem;
        }
        .shop-search::placeholder { color: rgba(255,255,255,0.3); }
        .shop-search:focus {
          background: rgba(255,255,255,0.07);
          border-color: rgba(245,158,11,0.5);
          color: white;
          box-shadow: none;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }
        .icon-box {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .btn-buy {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.75rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        .btn-buy:hover {
          background: linear-gradient(135deg, #ea580c, #b45309);
          color: #0f172a;
        }
        .btn-buy:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .categories-scroll {
          overflow-x: auto;
          scrollbar-width: none;
        }
        .categories-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="container-xl px-3">

        {/* Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className="icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h1 className="fw-bold text-white fs-3 mb-0">Spiritual Shop</h1>
          </div>
          <p className="mb-0 ms-5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Authentic, hand-curated products for your spiritual journey
          </p>
        </div>

        {/* Search */}
        <div className="position-relative mb-3">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="form-control shop-search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="d-flex gap-2 mb-4 categories-scroll pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn category-btn px-3 py-1 ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
            No products found. Try another search or category.
          </div>
        ) : (
          <div className="row g-3">
            {filteredProducts.map(product => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="shop-card h-100 d-flex flex-column">

                    {/* Image */}
                    <div className="product-img-wrap">
                      <img src={product.image} alt={product.name} />
                      <div className="img-overlay" />

                      {/* Badge */}
                      <span className={`product-badge bg-${product.badgeColor} bg-opacity-25 text-${product.badgeColor}`}>
                        {product.badge}
                      </span>

                      {/* Wishlist */}
                      <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)}>
                        <svg
                          width="14" height="14" viewBox="0 0 24 24"
                          fill={isWishlisted ? "#f43f5e" : "none"}
                          stroke={isWishlisted ? "#f43f5e" : "rgba(255,255,255,0.7)"}
                          strokeWidth="2"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>

                      {/* Out of Stock */}
                      {!product.inStock && (
                        <div className="out-of-stock-overlay">
                          <span className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <p className="mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {product.category}
                      </p>
                      <p className="mb-1 fw-semibold text-white" style={{ fontSize: '0.875rem', lineHeight: 1.3 }}>
                        {product.name}
                      </p>
                      <p className="mb-3 text-truncate" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="d-flex align-items-center gap-1 mb-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24">
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{product.rating}</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="d-flex align-items-center mb-2">
                        <span className="fw-bold" style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="ms-2 text-decoration-line-through" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Button */}
                      <button
                        className="btn btn-buy w-100 mt-auto d-flex align-items-center justify-content-center gap-1 py-2"
                        disabled={!product.inStock}
                        onClick={() => product.inStock && router.push(`/Productdetails?id=${product.id}`)}
                      >
                        View Details
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default SpiritualShop;