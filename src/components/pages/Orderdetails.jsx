'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const OrderPage = () => {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const quantityParam = searchParams.get('qty');

  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [quantity] = useState(parseInt(quantityParam) || 1);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', city: '', pincode: ''
  });

  const productsData = [
    {
      id: 1, name: "Premium Rudraksha Mala", category: "Malas", price: 1299, originalPrice: 1799,
      rating: 4.9, reviews: 312, description: "108 beads, 5-mukhi, certified",
      image: "https://www.haridwarrudraksha.com/cdn/shop/files/7-mukhi-rudraksha-nepali-mala-33-beads-3-jpg-webp.webp?v=1739192156",
      badge: "Bestseller", badgeColor: "warning", inStock: true
    },
    {
      id: 2, name: "Sattvic Agarbatti Set", category: "Incense", price: 349, originalPrice: 499,
      rating: 4.8, reviews: 524, description: "Pack of 6 — Rose, Sandalwood & Jasmine",
      image: "https://m.media-amazon.com/images/I/71rEXHI8qVL._AC_UF894,1000_QL80_.jpg",
      badge: "Popular", badgeColor: "info", inStock: true
    },
    {
      id: 6, name: "Sandalwood Chandan Mala", category: "Malas", price: 899, originalPrice: 1199,
      rating: 4.8, reviews: 176, description: "Aromatic 108-bead sandalwood mala",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6hDQOIhGjri1qf5tllOPi-MxssIuQ1juew&s",
      badge: "Aromatic", badgeColor: "warning", inStock: false
    }
  ];

  useEffect(() => {
    const found = productsData.find(p => p.id === parseInt(productId));
    if (found) setProduct(found);
    setLoading(false);
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateDeliveryForm = () => {
    const { fullName, phone, address, city, pincode } = formData;
    return fullName.trim() && phone.trim() && phone.length >= 10 &&
      address.trim() && city.trim() && pincode.trim() && pincode.length >= 6;
  };

  const handleContinueToPayment = () => {
    if (validateDeliveryForm()) setStep(2);
    else alert('Please fill all delivery details correctly.');
  };

  const handlePlaceOrder = () => {
    const newOrderId = 'ORD' + Math.floor(Math.random() * 1000000);
    setOrderId(newOrderId);
    setOrderPlaced(true);
    setStep(3);
  };

  const totalAmount = product ? product.price * quantity : 0;
  const isFreeDelivery = totalAmount >= 999;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading order details...</p>
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

  const paymentOptions = [
    {
      id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive the product',
      icon: <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4" /><path d="M16 12h2" /></>
    },
    {
      id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay',
      icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8h20" /><path d="M6 12h4" /></>
    },
    {
      id: 'upi', name: 'UPI / BHIM', desc: 'Google Pay, PhonePe, Paytm',
      icon: <><path d="M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" /></>
    }
  ];

  return (
    <div className="py-4 pb-5 min-vh-100" style={{ background: 'transparent' }}>
      <style>{`
        .op-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          backdrop-filter: blur(4px);
          padding: 1.25rem;
        }
        .op-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .op-input::placeholder { color: rgba(255,255,255,0.25); }
        .op-input:focus { border-color: rgba(245,158,11,0.5); }
        .op-step-circle {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .op-step-circle.active   { background: #f59e0b; color: #0f172a; }
        .op-step-circle.done     { background: #f59e0b; color: #0f172a; }
        .op-step-circle.inactive { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .op-step-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.75rem;
        }
        .op-payment-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s;
        }
        .op-payment-option:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(245,158,11,0.3);
        }
        .op-radio {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .op-radio.selected   { background: #f59e0b; border: 2px solid rgba(255,255,255,0.2); }
        .op-radio.unselected { background: transparent; border: 2px solid rgba(255,255,255,0.3); }
        .btn-op-primary {
          width: 100%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 0.5rem;
          padding: 0.6rem 1rem;
          color: #0f172a;
          font-weight: bold;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-op-primary:hover { background: linear-gradient(135deg, #ea580c, #b45309); }
        .op-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 0.5rem 0; }
        .op-address-review {
          background: rgba(255,255,255,0.03);
          border-radius: 0.75rem;
          padding: 0.75rem;
        }
        .op-confirm-icon {
          width: 4rem;
          height: 4rem;
          color: #34d399;
        }
        .back-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 0.875rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          transition: color 0.2s;
        }
        .back-btn:hover { color: white; }
      `}</style>

      <div className="container" style={{ maxWidth: '56rem' }}>

        {/* Back Button */}
        <button className="back-btn mb-3" onClick={() => router.push(`/Productdetails?id=${product.id}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Product
        </button>

        <h1 className="text-white fw-bold mb-3" style={{ fontSize: '1.5rem' }}>Checkout</h1>

        {/* Steps Indicator */}
        <div className="d-flex align-items-center mb-4">
          {['Delivery', 'Payment', 'Confirm'].map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <React.Fragment key={label}>
                <div className="d-flex align-items-center gap-2">
                  <div className={`op-step-circle ${isActive ? 'active' : isDone ? 'done' : 'inactive'}`}>
                    {isDone
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5 5L20 7" /></svg>
                      : num
                    }
                  </div>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 500,
                    color: isActive || isDone ? 'white' : 'rgba(255,255,255,0.4)'
                  }}>{label}</span>
                </div>
                {i < 2 && <div className="op-step-line" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main Layout */}
        <div className={`row g-3 ${step === 3 ? 'justify-content-center' : ''}`}>

          {/* Left — Form */}
          <div className={step === 3 ? 'col-12 col-md-8' : 'col-12 col-md-8'}>

            {/* Step 1 — Delivery */}
            {step === 1 && (
              <div className="op-card">
                <h3 className="d-flex align-items-center gap-2 text-white fw-semibold mb-3" style={{ fontSize: '1rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Delivery Address
                </h3>

                <div className="row g-2 mb-2">
                  <div className="col-12">
                    <label className="d-block mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Full Name</label>
                    <input type="text" name="fullName" placeholder="Your full name"
                      className="op-input" value={formData.fullName} onChange={handleInputChange} />
                  </div>
                  <div className="col-12">
                    <label className="d-block mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX"
                      className="op-input" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="col-12">
                    <label className="d-block mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Address </label>
                    <input type="text" name="address" placeholder="House no., Street, Area"
                      className="op-input" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="col-6">
                    <label className="d-block mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>City</label>
                    <input type="text" name="city" placeholder="City"
                      className="op-input" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div className="col-6">
                    <label className="d-block mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Pincode</label>
                    <input type="text" name="pincode" placeholder="6-digit pincode"
                      className="op-input" value={formData.pincode} onChange={handleInputChange} />
                  </div>
                </div>

                <button className="btn-op-primary mt-2" onClick={handleContinueToPayment}>
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="op-card">
                {/* Address Review */}
                <h3 className="d-flex align-items-center gap-2 text-white fw-semibold mb-2" style={{ fontSize: '1rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Delivery Address
                </h3>
                <div className="op-address-review mb-4">
                  <p className="text-white mb-1" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{formData.fullName}</p>
                  <p className="mb-0" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{formData.address}</p>
                  <p className="mb-0" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{formData.city} - {formData.pincode}</p>
                  <p className="mb-0" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{formData.phone}</p>
                </div>

                {/* Payment Methods */}
                <h3 className="d-flex align-items-center gap-2 text-white fw-semibold mb-3" style={{ fontSize: '1rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8h20" /><path d="M6 12h4" />
                  </svg>
                  Select Payment Method
                </h3>

                <div className="d-flex flex-column gap-2 mb-3">
                  {paymentOptions.map(opt => (
                    <div key={opt.id} className="op-payment-option" onClick={() => setPaymentMethod(opt.id)}>
                      <div className="d-flex align-items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                          {opt.icon}
                        </svg>
                        <div>
                          <p className="mb-0 text-white" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{opt.name}</p>
                          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{opt.desc}</p>
                        </div>
                      </div>
                      <div className={`op-radio ${paymentMethod === opt.id ? 'selected' : 'unselected'}`} />
                    </div>
                  ))}
                </div>

                <button className="btn-op-primary" onClick={handlePlaceOrder}>
                  Place Order · ₹{totalAmount.toLocaleString()}
                </button>
              </div>
            )}

            {/* Step 3 — Confirmation */}
            {step === 3 && orderPlaced && (
              <div className="op-card text-center py-5">
                <div className="d-flex justify-content-center mb-3">
                  <svg className="op-confirm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h2 className="text-white fw-bold mb-2" style={{ fontSize: '1.25rem' }}>Order Confirmed! 🎉</h2>
                <p className="mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Thank you for your purchase</p>
                <p className="mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                  We've sent a confirmation email to your registered email address.
                </p>
                <p className="mb-4 fw-semibold" style={{ color: '#fbbf24', fontSize: '0.875rem' }}>Order ID: {orderId}</p>
                <button className="btn-op-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                  onClick={() => router.push('/Shop')}>
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          {step !== 3 && (
            <div className="col-12 col-md-4">
              <div className="op-card" style={{ position: 'sticky', top: '6rem' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-100 rounded-3 mb-3"
                  style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                />
                <span className={`badge bg-${product.badgeColor} bg-opacity-25 text-${product.badgeColor} mb-1`}
                  style={{ fontSize: '0.65rem' }}>
                  {product.badge}
                </span>
                <p className="text-white fw-semibold mb-1" style={{ fontSize: '0.875rem' }}>{product.name}</p>
                <p className="mb-3" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{product.description}</p>

                <div className="d-flex justify-content-between mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Price</span>
                  <span className="text-white" style={{ fontSize: '0.875rem' }}>₹{product.price.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Qty</span>
                  <span className="text-white" style={{ fontSize: '0.875rem' }}>{quantity}</span>
                </div>

                <div className="op-divider" />

                <div className="d-flex justify-content-between mt-2">
                  <span className="fw-bold" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>Total</span>
                  <span className="fw-bold" style={{ color: '#fbbf24', fontSize: '1rem' }}>₹{totalAmount.toLocaleString()}</span>
                </div>

                {isFreeDelivery && (
                  <div className="text-center mt-3 py-1 rounded"
                    style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
                    Free Delivery Applicable 🎉
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderPage;