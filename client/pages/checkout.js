import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"

export default function Checkout() {
    const router = useRouter()
    const [cart, setCart] = useState([])
    const [step, setStep] = useState(1) // 1: Details, 2: Payment, 3: Success
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "cod"
    })
    const [loading, setLoading] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [orderId, setOrderId] = useState("")

    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        } else {
            router.push("/products")
        }
    }, [])

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (step === 1) {
            setStep(2)
        } else if (step === 2) {
            processOrder()
        }
    }

    const processOrder = () => {
        setLoading(true)

        // Simulate order processing
        setTimeout(() => {
            const newOrderId = "ORD" + Date.now()
            setOrderId(newOrderId)
            setOrderPlaced(true)
            setStep(3)
            setLoading(false)

            // Clear cart
            localStorage.removeItem("cart")
            setCart([])
        }, 2000)
    }

    if (orderPlaced && step === 3) {
        return (
            <>
                <Head>
                    <title>Order Placed - Premium Store</title>
                </Head>

                <div className="success-container">
                    <div className="success-card">
                        <div className="success-icon">✅</div>
                        <h1>Order Placed Successfully!</h1>
                        <p className="success-message">Thank you for your order!</p>

                        <div className="order-details">
                            <div className="detail-row">
                                <span className="label">Order ID:</span>
                                <span className="value">{orderId}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Total Amount:</span>
                                <span className="value">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Payment Method:</span>
                                <span className="value">
                                    {formData.paymentMethod === "cod" ? "Cash on Delivery" :
                                        formData.paymentMethod === "upi" ? "UPI" : "Card"}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Delivery Address:</span>
                                <span className="value">{formData.address}, {formData.city}</span>
                            </div>
                        </div>

                        <div className="success-info">
                            <p>📧 Order confirmation sent to <strong>{formData.email}</strong></p>
                            <p>📱 Updates will be sent to <strong>{formData.phone}</strong></p>
                            <p>🚚 Expected delivery in <strong>3-5 business days</strong></p>
                        </div>

                        <div className="success-actions">
                            <button className="btn-primary" onClick={() => router.push("/products")}>
                                Continue Shopping
                            </button>
                            <button className="btn-secondary" onClick={() => window.print()}>
                                Print Receipt
                            </button>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .success-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                    }

                    .success-card {
                        background: white;
                        border-radius: 30px;
                        padding: 60px 50px;
                        max-width: 600px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        animation: slideUp 0.6s ease;
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .success-icon {
                        font-size: 5rem;
                        margin-bottom: 20px;
                        animation: bounce 1s ease;
                    }

                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }

                    .success-card h1 {
                        font-size: 2.2rem;
                        color: #2c3e50;
                        margin-bottom: 10px;
                    }

                    .success-message {
                        font-size: 1.2rem;
                        color: #7f8c8d;
                        margin-bottom: 40px;
                    }

                    .order-details {
                        background: #f8f9fa;
                        border-radius: 15px;
                        padding: 30px;
                        margin-bottom: 30px;
                        text-align: left;
                    }

                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #e0e0e0;
                    }

                    .detail-row:last-child {
                        border-bottom: none;
                    }

                    .label {
                        color: #7f8c8d;
                        font-weight: 600;
                    }

                    .value {
                        color: #2c3e50;
                        font-weight: 700;
                    }

                    .success-info {
                        background: #e8f5e9;
                        border-radius: 15px;
                        padding: 25px;
                        margin-bottom: 30px;
                    }

                    .success-info p {
                        margin: 10px 0;
                        color: #2e7d32;
                        font-size: 0.95rem;
                    }

                    .success-actions {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                    }

                    .btn-primary, .btn-secondary {
                        padding: 15px 30px;
                        border: none;
                        border-radius: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 1rem;
                    }

                    .btn-primary {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }

                    .btn-primary:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                    }

                    .btn-secondary {
                        background: white;
                        color: #667eea;
                        border: 2px solid #667eea;
                    }

                    .btn-secondary:hover {
                        background: #f8f9fa;
                        transform: translateY(-3px);
                    }

                    @media (max-width: 768px) {
                        .success-card {
                            padding: 40px 30px;
                        }

                        .success-card h1 {
                            font-size: 1.8rem;
                        }

                        .success-actions {
                            flex-direction: column;
                        }

                        .btn-primary, .btn-secondary {
                            width: 100%;
                        }
                    }
                `}</style>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Checkout - Premium Store</title>
                <meta name="description" content="Complete your purchase" />
            </Head>

            <div className="checkout-container">
                {/* Header */}
                <div className="checkout-header">
                    <button className="back-btn" onClick={() => router.push("/products")}>
                        ← Back to Store
                    </button>
                    <h1>✨ Checkout</h1>
                    <div className="steps">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Details</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Payment</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Done</span>
                        </div>
                    </div>
                </div>

                <div className="checkout-content">
                    {/* Left Side - Form */}
                    <div className="form-section">
                        {step === 1 && (
                            <form onSubmit={handleSubmit} className="checkout-form">
                                <h2>📋 Delivery Details</h2>

                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name *</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Address *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House no., Street, Area"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State *</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="pincode">Pincode *</label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="6-digit"
                                            pattern="[0-9]{6}"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="continue-btn">
                                    Continue to Payment →
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="checkout-form">
                                <h2>💳 Payment Method</h2>

                                <div className="payment-methods">
                                    <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                        />
                                        <div className="option-content">
                                            <span className="option-icon">💵</span>
                                            <div>
                                                <div className="option-title">Cash on Delivery</div>
                                                <div className="option-desc">Pay when you receive</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === 'upi'}
                                            onChange={handleChange}
                                        />
                                        <div className="option-content">
                                            <span className="option-icon">📱</span>
                                            <div>
                                                <div className="option-title">UPI Payment</div>
                                                <div className="option-desc">GPay, PhonePe, Paytm</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleChange}
                                        />
                                        <div className="option-content">
                                            <span className="option-icon">💳</span>
                                            <div>
                                                <div className="option-title">Credit/Debit Card</div>
                                                <div className="option-desc">Visa, Mastercard, RuPay</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="back-step-btn" onClick={() => setStep(1)}>
                                        ← Back
                                    </button>
                                    <button type="submit" className="place-order-btn" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            "Place Order 🎉"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="summary-section">
                        <div className="summary-card">
                            <h3>📦 Order Summary</h3>

                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item._id} className="summary-item">
                                        <img src={item.image || "https://via.placeholder.com/60"} alt={item.name} />
                                        <div className="item-info">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-qty">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span>Subtotal ({getTotalItems()} items)</span>
                                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Charges</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="summary-row">
                                <span>Discount</span>
                                <span className="discount">-₹0</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span>Total Amount</span>
                                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                            </div>

                            <div className="savings-badge">
                                🎉 You're getting FREE delivery!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .checkout-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }

                .checkout-header {
                    max-width: 1200px;
                    margin: 0 auto 30px;
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .back-btn {
                    background: none;
                    border: none;
                    color: #667eea;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }

                .back-btn:hover {
                    transform: translateX(-5px);
                }

                .checkout-header h1 {
                    font-size: 2.5rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 30px;
                }

                .steps {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e0e0e0;
                    color: #999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }

                .step.active .step-number {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .step-label {
                    font-size: 0.9rem;
                    color: #999;
                    font-weight: 600;
                }

                .step.active .step-label {
                    color: #667eea;
                }

                .step-line {
                    width: 80px;
                    height: 2px;
                    background: #e0e0e0;
                }

                .checkout-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 30px;
                }

                .form-section {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .checkout-form h2 {
                    font-size: 1.8rem;
                    color: #2c3e50;
                    margin-bottom: 30px;
                }

                .form-group {
                    margin-bottom: 25px;
                }

                .form-group label {
                    display: block;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 10px;
                    font-size: 0.95rem;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                }

                .continue-btn,
                .place-order-btn {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                }

                .continue-btn:hover,
                .place-order-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                }

                .place-order-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-right: 10px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .payment-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .payment-option {
                    display: block;
                    padding: 20px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .payment-option:hover {
                    border-color: #667eea;
                    background: #f8f9fa;
                }

                .payment-option.selected {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.05);
                }

                .payment-option input[type="radio"] {
                    display: none;
                }

                .option-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .option-icon {
                    font-size: 2rem;
                }

                .option-title {
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }

                .option-desc {
                    font-size: 0.85rem;
                    color: #7f8c8d;
                }

                .form-actions {
                    display: flex;
                    gap: 15px;
                }

                .back-step-btn {
                    flex: 1;
                    padding: 18px;
                    background: white;
                    color: #667eea;
                    border: 2px solid #667eea;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .back-step-btn:hover {
                    background: #f8f9fa;
                }

                .place-order-btn {
                    flex: 2;
                    margin-top: 0;
                }

                .summary-section {
                    position: sticky;
                    top: 20px;
                    height: fit-content;
                }

                .summary-card {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .summary-card h3 {
                    font-size: 1.5rem;
                    color: #2c3e50;
                    margin-bottom: 25px;
                }

                .summary-items {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                }

                .summary-item {
                    display: flex;
                    gap: 15px;
                    padding: 15px 0;
                    border-bottom: 1px solid #f0f0f0;
                }

                .summary-item:last-child {
                    border-bottom: none;
                }

                .summary-item img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 10px;
                }

                .item-info {
                    flex: 1;
                }

                .item-name {
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                }

                .item-qty {
                    font-size: 0.85rem;
                    color: #7f8c8d;
                }

                .item-price {
                    font-weight: 700;
                    color: #667eea;
                }

                .summary-divider {
                    height: 1px;
                    background: #e0e0e0;
                    margin: 20px 0;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    color: #7f8c8d;
                }

                .free {
                    color: #27ae60;
                    font-weight: 700;
                }

                .discount {
                    color: #e74c3c;
                    font-weight: 700;
                }

                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 0;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #2c3e50;
                }

                .summary-total span:last-child {
                    color: #667eea;
                }

                .savings-badge {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 12px;
                    border-radius: 10px;
                    text-align: center;
                    font-weight: 600;
                    margin-top: 20px;
                }

                @media (max-width: 968px) {
                    .checkout-content {
                        grid-template-columns: 1fr;
                    }

                    .summary-section {
                        position: static;
                    }

                    .steps {
                        flex-wrap: wrap;
                    }

                    .step-line {
                        width: 40px;
                    }
                }

                @media (max-width: 768px) {
                    .form-section {
                        padding: 25px;
                    }

                    .checkout-header {
                        padding: 20px;
                    }

                    .checkout-header h1 {
                        font-size: 2rem;
                    }

                    .form-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </>
    )
}
