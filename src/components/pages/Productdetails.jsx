'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ProductDetails = () => {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productsData = [
    {
      id: 1,
      name: "Premium Rudraksha Mala",
      category: "Malas",
      price: 1299,
      originalPrice: 1799,
      rating: 4.9,
      reviews: 312,
      description: "108 beads, 5-mukhi, certified",
      longDescription: "Authentic 5-mukhi Rudraksha mala with 108 beads. Each bead is hand-selected, energized with Vedic mantras, and strung with silk thread. Ideal for meditation, japa, and daily worship.",
      image: "https://www.haridwarrudraksha.com/cdn/shop/files/7-mukhi-rudraksha-nepali-mala-33-beads-3-jpg-webp.webp?v=1739192156",
      images: ["https://www.haridwarrudraksha.com/cdn/shop/files/7-mukhi-rudraksha-nepali-mala-33-beads-3-jpg-webp.webp?v=1739192156","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzWmn3GNj41aggv7-Ufvhkq-DT9wqcTTO6tQ&s"],
      badge: "Bestseller",
      badgeColor: "warning",
      inStock: true,
      benefits: ["Reduces stress and anxiety", "Enhances focus during meditation", "Balances the five elements", "Brings clarity and spiritual growth"]
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
      longDescription: "Hand-rolled natural incense sticks made with pure essential oils. Free from charcoal and synthetic fragrances. Each pack contains 6 boxes of 15 sticks each.",
      image: "https://m.media-amazon.com/images/I/71rEXHI8qVL._AC_UF894,1000_QL80_.jpg",
      images: ["https://m.media-amazon.com/images/I/71rEXHI8qVL._AC_UF894,1000_QL80_.jpg","https://vedastika.com/cdn/shop/files/Suvarna-Chandan.webp?v=1755686879&width=980"],
      badge: "Popular",
      badgeColor: "info",
      inStock: true,
      benefits: ["Creates a calming atmosphere", "Removes negative energy", "Natural and eco-friendly", "Long-lasting fragrance"]
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
      longDescription: "Aromatic sandalwood mala with 108 beads. Known for its cooling properties and calming fragrance. Perfect for japa meditation and daily wear.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6hDQOIhGjri1qf5tllOPi-MxssIuQ1juew&s",
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6hDQOIhGjri1qf5tllOPi-MxssIuQ1juew&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6hDQOIhGjri1qf5tllOPi-MxssIuQ1juew&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6hDQOIhGjri1qf5tllOPi-MxssIuQ1juew&s"],
      badge: "Aromatic",
      badgeColor: "warning",
      inStock: false,
      benefits: ["Calms the mind", "Natural fragrance", "Smooth texture", "Durable and long-lasting"]
    }
  ];

  const reviewsData = {
    1: [
      { id: 1, name: "Priya S.", rating: 5, date: "Mar 28", comment: "Absolutely beautiful quality! Exactly as described. Very satisfied.", initial: "P" },
      { id: 2, name: "Rahul K.", rating: 5, date: "Mar 20", comment: "Received within 3 days. Packaging was excellent and product is authentic.", initial: "R" },
      { id: 3, name: "Anita M.", rating: 4, date: "Mar 10", comment: "Good product overall. Would recommend to anyone looking for spiritual items.", initial: "A" }
    ],
    2: [
      { id: 1, name: "Vikram S.", rating: 5, date: "Mar 25", comment: "Best agarbatti I've ever used. The fragrance is divine.", initial: "V" },
      { id: 2, name: "Neha R.", rating: 4, date: "Mar 18", comment: "Good quality. Lasts longer than regular ones.", initial: "N" }
    ],
    6: [
      { id: 1, name: "Manoj T.", rating: 4, date: "Mar 24", comment: "Nice fragrance. Smooth beads.", initial: "M" },
      { id: 2, name: "Priyanka V.", rating: 5, date: "Mar 17", comment: "Very calming. Love wearing it.", initial: "P" }
    ]
  };

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === parseInt(productId));
    if (foundProduct) {
      setProduct(foundProduct);
      const related = productsData.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id);
      setRelatedProducts(related.slice(0, 3));
    }
    setLoading(false);
  }, [productId]);

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  const updateQuantity = (delta) => {
    const next = quantity + delta;
    if (next >= 1 && next <= 10) setQuantity(next);
  };

  const calculateDiscount = () => {
    if (!product) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24"
        fill={i < rating ? "#fbbf24" : "none"}
        stroke={i < rating ? "#fbbf24" : "rgba(255,255,255,0.2)"}
        strokeWidth="2">
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
    ));

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>
          Product not found. <Link href="/Shop" style={{ color: '#fbbf24' }}>Back to Shop</Link>
        </p>
      </div>
    );
  }

  const productReviews = reviewsData[product.id] || [];
  const discount = calculateDiscount();

  return (
    <div className="py-4 pb-5 min-vh-100" style={{ background: 'transparent' }}>
      <style>{`
        .pd-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          backdrop-filter: blur(4px);
        }
        .pd-main-image {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          aspect-ratio: 1 / 1;
        }
        .pd-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pd-thumb {
          width: 4rem;
          height: 4rem;
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.6;
          border: 2px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
        }
        .pd-thumb.active {
          opacity: 1;
          border-color: #f59e0b;
        }
        .pd-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pd-wishlist-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .pd-wishlist-btn:hover { background: rgba(0,0,0,0.65); }
        .pd-badge-img {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: 0.375rem;
        }
        .pd-qty-ctrl {
          background: rgba(255,255,255,0.05);
          border-radius: 0.75rem;
          padding: 0.25rem;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
        }
        .pd-qty-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .pd-qty-btn:hover { background: rgba(255,255,255,0.2); }
        .pd-feature-card {
          background: rgba(255,255,255,0.05);
          border-radius: 0.75rem;
          padding: 0.5rem;
          text-align: center;
          flex: 1;
        }
        .btn-buy-now {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          color: #0f172a;
          font-weight: bold;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        .btn-buy-now:hover {
          background: linear-gradient(135deg, #ea580c, #b45309);
          color: #0f172a;
        }
        .btn-share {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }
        .btn-share:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .pd-review-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
        }
        .pd-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }
        .pd-related-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pd-related-card:hover {
          background: rgba(255,255,255,0.10);
          transform: translateY(-2px);
        }
        .pd-related-card img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }
        .back-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          transition: color 0.2s;
        }
        .back-btn:hover { color: white; }
      `}</style>

      <div className="container" style={{ maxWidth: '70rem' }}>

        {/* Back Button */}
        <button className="back-btn mb-4" onClick={() => router.push('/Shop')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Shop
        </button>

        {/* Product Main Section */}
        <div className="row g-4 mb-4">

          {/* Image Section */}
          <div className="col-12 col-md-5">
            <div className="pd-main-image mb-3">
              <img src={product.images[activeImage] || product.image} alt={product.name} />
              <span className={`pd-badge-img bg-${product.badgeColor} bg-opacity-25 text-${product.badgeColor}`}>
                {product.badge}
              </span>
              <button className="pd-wishlist-btn" onClick={toggleWishlist}>
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={isWishlisted ? "#f43f5e" : "none"}
                  stroke={isWishlisted ? "#f43f5e" : "rgba(255,255,255,0.7)"}
                  strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="d-flex gap-2">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`pd-thumb ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="col-12 col-md-7 d-flex flex-column gap-3">

            {/* Title */}
            <div>
              <p className="mb-1 fw-500" style={{ color: 'rgba(245,158,11,0.8)', fontSize: '0.95rem' }}>
                {product.category}
              </p>
              <h1 className="fw-bold text-white mb-2" style={{ fontSize: '1.9rem' }}>{product.name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>{product.description}</p>
            </div>

            {/* Rating */}
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex gap-1">{renderStars(Math.floor(product.rating))}</div>
              <span className="fw-semibold text-white" style={{ fontSize: '0.875rem' }}>{product.rating}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="d-flex align-items-end gap-2">
              <span className="fw-bold" style={{ color: '#fbbf24', fontSize: '2rem' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-decoration-line-through mb-1" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.4rem' }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="mb-1 px-2 py-1 rounded" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', fontSize: '0.875rem', fontWeight: 600 }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Benefits */}
            <div>
              <p className="mb-2" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 500 }}>Key Benefits</p>
              <div className="row g-2">
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} className="col-6 d-flex align-items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                      <path d="m9 11 3 3L22 4" />
                    </svg>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-3">
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Quantity</span>
              <div className="pd-qty-ctrl">
                <button className="pd-qty-btn" onClick={() => updateQuantity(-1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="text-white fw-semibold" style={{ minWidth: '1.5rem', textAlign: 'center' }}>{quantity}</span>
                <button className="pd-qty-btn" onClick={() => updateQuantity(1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Link href={`/Orderdetails?id=${product.id}&qty=${quantity}`} style={{ flex: 1, textDecoration: 'none' }}>
                <button className="btn btn-buy-now w-100 py-2 fw-bold">
                  Buy Now · ₹{(product.price * quantity).toLocaleString()}
                </button>
              </Link>
              <button className="btn btn-share px-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
              </button>
            </div>

            {/* Feature Cards */}
            <div className="d-flex gap-2">
              {[
                {
                  icon: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>,
                  title: "Authentic", sub: "100% Genuine"
                },
                {
                  icon: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
                  title: "Free Delivery", sub: "On orders ₹999+"
                },
                {
                  icon: <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>,
                  title: "Easy Returns", sub: "7-day returns"
                }
              ].map(({ icon, title, sub }, i) => (
                <div key={i} className="pd-feature-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" className="mb-1">
                    {icon}
                  </svg>
                  <p className="text-white mb-0" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{title}</p>
                  <p className="mb-0" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{sub}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Description */}
        <div className="pd-card p-4 mb-4">
          <h3 className="text-white fw-semibold mb-3" style={{ fontSize: '1.1rem' }}>Product Description</h3>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            {product.longDescription}
          </p>
        </div>

        {/* Reviews */}
        <div className="mb-4">
          <h3 className="text-white fw-semibold mb-3" style={{ fontSize: '1.1rem' }}>Customer Reviews</h3>
          <div className="d-flex flex-column gap-3">
            {productReviews.map(review => (
              <div key={review.id} className="pd-review-card p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="pd-avatar">{review.initial}</div>
                    <span className="text-white fw-500" style={{ fontSize: '0.875rem' }}>{review.name}</span>
                    <div className="d-flex gap-1">{renderStars(review.rating)}</div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{review.date}</span>
                </div>
                <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-white fw-semibold mb-3" style={{ fontSize: '1.1rem' }}>You May Also Like</h3>
            <div className="row g-3">
              {relatedProducts.map(related => (
                <div key={related.id} className="col-6 col-sm-4 col-md-3">
                  <div className="pd-related-card" onClick={() => router.push(`/Productdetails?id=${related.id}`)}>
                    <img src={related.image} alt={related.name} />
                    <div className="p-2">
                      <p className="text-white mb-1" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{related.name}</p>
                      <p className="mb-0 fw-bold" style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                        ₹{related.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;