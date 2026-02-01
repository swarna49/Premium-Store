import { useState, useEffect, useRef } from "react"
import api from "../utils/api"
import Head from "next/head"
import { useRouter } from "next/router"

export default function Home() {
    const router = useRouter()
    const productsRef = useRef(null)
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [zoomedImage, setZoomedImage] = useState(null)
    const [toast, setToast] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)

    const handleSearch = (e) => {
        if (e) e.preventDefault()
        setShowSearchDropdown(false)
        if (productsRef.current) {
            productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleDropdownClick = (productId) => {
        setShowSearchDropdown(false)
        // Find the element and scroll to it
        const element = document.getElementById(productId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('highlight-product')
            setTimeout(() => element.classList.remove('highlight-product'), 2000)
        } else {
            // If grid is filtered, it will be there
            if (productsRef.current) {
                productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }

    useEffect(() => {
        fetchProducts()
        const userData = localStorage.getItem("user")
        if (userData) {
            setUser(JSON.parse(userData))
        }
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
        const savedTheme = localStorage.getItem("darkMode")
        if (savedTheme) {
            setDarkMode(savedTheme === "true")
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-bar')) {
                setShowSearchDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        localStorage.setItem("darkMode", newMode.toString())
    }

    const showToast = (message, type = "success") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data } = await api.get("/products")
            setProducts(data)
        } catch (err) {
            console.error("Error fetching products:", err)
            setError("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id)
        let newCart

        if (existingItem) {
            newCart = cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            showToast(`Updated ${product.name} quantity!`, "success")
        } else {
            newCart = [...cart, { ...product, quantity: 1 }]
            showToast(`${product.name} added to cart!`, "success")
        }

        setCart(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
    }

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item._id !== productId)
        setCart(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            return
        }

        const newCart = cart.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        )
        setCart(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    }

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("cart")
        setUser(null)
        setCart([])
        router.reload()
    }

    return (
        <>
            <Head>
                <title>Premium Store - Shop the Best Products</title>
                <meta name="description" content="Discover amazing products at unbeatable prices" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="page-wrapper">
                {/* Header */}
                <header className="header">
                    <div className="logo">
                        <h1>✨ Premium Store</h1>
                        <p className="tagline">Quality You Can Trust</p>
                    </div>

                    <form className="search-bar" onSubmit={handleSearch}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setShowSearchDropdown(e.target.value.length > 0)
                            }}
                            onFocus={() => {
                                if (searchQuery.length > 0) setShowSearchDropdown(true)
                            }}
                        />
                        {searchQuery && (
                            <button type="button" className="clear-search" onClick={() => {
                                setSearchQuery("")
                                setShowSearchDropdown(false)
                            }} title="Clear search">✕</button>
                        )}
                        <button type="submit" className="search-btn" title="Search">
                            Search
                        </button>

                        {/* Search Suggestions Dropdown */}
                        {showSearchDropdown && (
                            <div className="search-dropdown">
                                {products.filter(p =>
                                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).slice(0, 5).map(product => (
                                    <div
                                        key={product._id}
                                        className="search-result-item"
                                        onClick={() => handleDropdownClick(product._id)}
                                    >
                                        <img src={product.image || "https://via.placeholder.com/40"} alt={product.name} />
                                        <div className="result-info">
                                            <span className="result-name">{product.name}</span>
                                            <span className="result-price">₹{product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                    <div className="dropdown-footer" onClick={handleSearch}>
                                        View all {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length} results
                                    </div>
                                ) : (
                                    <div className="dropdown-empty">No products found</div>
                                )}
                            </div>
                        )}
                    </form>

                    <nav className="nav">
                        <button className="nav-btn" onClick={() => router.push("/welcome")}>
                            <span className="icon">🏠</span>
                            Home
                        </button>

                        <button className="nav-btn cart-btn" onClick={() => setShowCart(!showCart)}>
                            <span className="icon">🛒</span>
                            Cart
                            {getTotalItems() > 0 && (
                                <span className="badge">{getTotalItems()}</span>
                            )}
                        </button>
                        <button className="nav-btn theme-toggle" onClick={toggleDarkMode} title={darkMode ? "Light Mode" : "Dark Mode"}>
                            <span className="icon">{darkMode ? "☀️" : "🌙"}</span>
                        </button>
                        {user ? (
                            <>
                                <span className="user-name">Hi, {user.name}!</span>
                                <button className="nav-btn" onClick={handleLogout}>
                                    <span className="icon">👋</span>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button className="nav-btn primary" onClick={() => router.push("/login")}>
                                <span className="icon">🔐</span>
                                Login
                            </button>
                        )}
                    </nav>
                </header>

                {/* Cart Sidebar */}
                {showCart && (
                    <div className="cart-overlay" onClick={() => setShowCart(false)}>
                        <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
                            <div className="cart-header">
                                <h2>🛒 Shopping Cart</h2>
                                <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <span className="empty-icon">🛒</span>
                                    <p>Your cart is empty</p>
                                    <small>Add some products to get started!</small>
                                </div>
                            ) : (
                                <>
                                    <div className="cart-items">
                                        {cart.map(item => (
                                            <div key={item._id} className="cart-item">
                                                <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} />
                                                <div className="item-details">
                                                    <h4>{item.name}</h4>
                                                    <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                                                    <div className="quantity-controls">
                                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                                    </div>
                                                </div>
                                                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cart-footer">
                                        <div className="total">
                                            <span>Total:</span>
                                            <span className="total-price">₹{Math.round(cart.reduce((total, item) => total + (item.price * item.quantity), 0)).toLocaleString('en-IN')}</span>
                                        </div>
                                        <button className="checkout-btn" onClick={() => router.push("/checkout")}>
                                            Proceed to Checkout 🚀
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h2 className="hero-title">Discover Amazing Products</h2>
                        <p className="hero-subtitle">Premium quality at unbeatable prices</p>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">{products.length}</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Authentic</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">Support</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main className="main" ref={productsRef}>
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading amazing products...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-box">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="empty-state">
                            <span className="empty-icon">📦</span>
                            <h3>No products available yet</h3>
                            <p>Check back soon for amazing deals!</p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (() => {
                        const filteredProducts = products.filter(p =>
                            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        );

                        if (filteredProducts.length === 0) {
                            return (
                                <div className="empty-state">
                                    <span className="empty-icon">🔍</span>
                                    <h3>No matches found for "{searchQuery}"</h3>
                                    <p>Try searching for something else!</p>
                                    <button className="nav-btn" style={{ marginTop: '20px' }} onClick={() => setSearchQuery("")}>Clear Search</button>
                                </div>
                            );
                        }

                        return (
                            <>
                                <div className="section-header">
                                    <h2>{searchQuery ? `Search results for "${searchQuery}"` : "Featured Products"}</h2>
                                    <p>{searchQuery ? `We found ${filteredProducts.length} items` : "Handpicked selection just for you"}</p>
                                </div>

                                <div className="products-grid">
                                    {filteredProducts.map(product => (
                                        <div key={product._id} id={product._id} className="product-card">
                                            {product.stock < 10 && product.stock > 0 && (
                                                <div className="badge-limited">⚡ Limited Stock</div>
                                            )}
                                            {product.stock === 0 && (
                                                <div className="badge-sold">Sold Out</div>
                                            )}

                                            <div className="product-image" onClick={() => setZoomedImage(product.image || "https://via.placeholder.com/800x800?text=Product")}>
                                                <img
                                                    src={product.image || "https://via.placeholder.com/300x300?text=Product"}
                                                    alt={product.name}
                                                    onError={(e) => e.target.src = "https://via.placeholder.com/300x300?text=No+Image"}
                                                />
                                                <div className="zoom-hint">🔍 Click to zoom</div>
                                            </div>

                                            <div className="product-info">
                                                {product.category && (
                                                    <span className="category">{product.category}</span>
                                                )}
                                                <h3>{product.name}</h3>
                                                <p className="description">{product.description}</p>

                                                <div className="product-footer">
                                                    <div className="price-section">
                                                        <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                                                        {product.stock !== undefined && product.stock > 0 && (
                                                            <span className="stock">✓ {product.stock} in stock</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="add-to-cart-btn"
                                                        onClick={() => addToCart(product)}
                                                        disabled={product.stock === 0}
                                                    >
                                                        {product.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </main>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>✨ Premium Store</h3>
                            <p>Your trusted online shopping destination</p>
                        </div>
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <a href="#">About Us</a>
                            <a href="#">Contact</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                        <div className="footer-section">
                            <h4>Customer Service</h4>
                            <a href="#">Shipping Info</a>
                            <a href="#">Returns</a>
                            <a href="#">FAQ</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 Premium Store. All rights reserved. Made with ❤️</p>
                    </div>
                </footer>

                {/* Toast Notification */}
                {toast && (
                    <div className={`toast toast-${toast.type}`}>
                        <span className="toast-icon">
                            {toast.type === "success" ? "✅" : "⚠️"}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                    </div>
                )}

                {/* Image Zoom Modal */}
                {zoomedImage && (
                    <div className="zoom-modal" onClick={() => setZoomedImage(null)}>
                        <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="zoom-close" onClick={() => setZoomedImage(null)}>✕</button>
                            <img src={zoomedImage} alt="Zoomed product" />
                        </div>
                    </div>
                )}

                {/* Scroll to Top Button */}
                <button
                    className="scroll-to-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ display: 'block' }}
                >
                    ↑
                </button>
            </div>

            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .page-wrapper {
                    min-height: 100vh;
                    background: ${darkMode
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
                    transition: background 0.5s ease;
                }

                /* Dark Mode Variables */
                ${darkMode ? `
                    .header {
                        background: rgba(30, 30, 46, 0.98) !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .product-card {
                        background: rgba(30, 30, 46, 0.95) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .product-card h3,
                    .product-card .description {
                        color: #e0e0e0 !important;
                    }
                    .hero {
                        background: rgba(30, 30, 46, 0.5) !important;
                    }
                    .hero-title,
                    .section-header h2 {
                        color: #ffffff !important;
                    }
                    .hero-subtitle,
                    .section-header p {
                        color: #b0b0b0 !important;
                    }
                    .footer {
                        background: rgba(20, 20, 30, 0.95) !important;
                        color: #e0e0e0 !important;
                    }
                    .cart-sidebar {
                        background: rgba(30, 30, 46, 0.98) !important;
                    }
                    .cart-sidebar h2 {
                        color: #ffffff !important;
                    }
                ` : ''}

                /* Header Styles */
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 40px;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    transition: all 0.3s ease;
                }

                .logo h1 {
                    margin: 0;
                    font-size: 1.8rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .tagline {
                    margin: 5px 0 0 0;
                    font-size: 0.85rem;
                    color: #666;
                }

                /* Search Bar Styles */
                .search-bar {
                    flex: 1;
                    max-width: 500px;
                    margin: 0 40px;
                    display: flex;
                    align-items: center;
                    background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6'};
                    border: 2px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
                    border-radius: 12px;
                    padding: 8px 16px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .search-dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    left: 0;
                    right: 0;
                    background: ${darkMode ? '#1e1e2e' : '#ffffff'};
                    border-radius: 12px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
                    border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'};
                    z-index: 1000;
                    overflow: hidden;
                    animation: slideDownFade 0.3s ease;
                }

                @keyframes slideDownFade {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .search-result-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5'};
                }

                .search-result-item:hover {
                    background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa'};
                }

                .search-result-item img {
                    width: 45px;
                    height: 45px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .result-info {
                    display: flex;
                    flex-direction: column;
                }

                .result-name {
                    font-weight: 600;
                    color: ${darkMode ? '#ffffff' : '#333'};
                    font-size: 0.95rem;
                }

                .result-price {
                    color: #667eea;
                    font-size: 0.85rem;
                    font-weight: 700;
                }

                .dropdown-footer {
                    padding: 12px;
                    text-align: center;
                    background: ${darkMode ? 'rgba(102, 126, 234, 0.1)' : '#f9fafb'};
                    color: #667eea;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                }

                .dropdown-footer:hover {
                    text-decoration: underline;
                }

                .dropdown-empty {
                    padding: 20px;
                    text-align: center;
                    color: #888;
                    font-style: italic;
                }

                .highlight-product {
                    animation: highlightPulse 2s ease;
                    border-color: #667eea !important;
                }

                @keyframes highlightPulse {
                    0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(102, 126, 234, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
                }

                .search-bar:focus-within {
                    background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : '#ffffff'};
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .search-icon {
                    font-size: 1.2rem;
                    margin-right: 12px;
                    opacity: 0.5;
                }

                .search-bar input {
                    flex: 1;
                    background: none;
                    border: none;
                    outline: none;
                    padding: 8px 0;
                    font-size: 1rem;
                    color: ${darkMode ? '#ffffff' : '#333'};
                    font-family: inherit;
                }

                .search-bar input::placeholder {
                    color: ${darkMode ? '#888' : '#999'};
                }

                .clear-search {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    font-size: 1.1rem;
                    padding: 4px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .clear-search:hover {
                    background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
                    color: #e74c3c;
                }

                .search-btn {
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-left: 10px;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }

                .search-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    opacity: 0.9;
                }

                .nav {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .user-name {
                    color: #667eea;
                    font-weight: 600;
                    padding: 0 10px;
                }

                .nav-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 28px;
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    color: #333;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    min-height: 48px;
                }

                .nav-btn:hover {
                    background: #f8f9fa;
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
                }

                .nav-btn.primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                }

                .nav-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                .nav-btn.admin-btn {
                    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                    color: white;
                    border: none;
                }

                .nav-btn.admin-btn:hover {
                    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
                }

                .icon {
                    font-size: 1.4rem;
                    line-height: 1;
                }

                .badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                /* Cart Sidebar */
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .cart-sidebar {
                    position: fixed;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    width: 420px;
                    max-width: 90vw;
                    background: white;
                    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .cart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px;
                    border-bottom: 2px solid #f0f0f0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .cart-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    font-size: 1.8rem;
                    cursor: pointer;
                    color: white;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .cart-items {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }

                .cart-item {
                    display: flex;
                    gap: 15px;
                    padding: 15px;
                    background: #f9f9f9;
                    border-radius: 12px;
                    margin-bottom: 15px;
                    transition: all 0.3s ease;
                }

                .cart-item:hover {
                    background: #f0f0f0;
                    transform: translateX(-5px);
                }

                .cart-item img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .item-details {
                    flex: 1;
                }

                .item-details h4 {
                    margin: 0 0 8px 0;
                    color: #333;
                    font-size: 1.05rem;
                }

                .item-price {
                    color: #667eea;
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin: 5px 0;
                }

                .quantity-controls {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-top: 12px;
                }

                .quantity-controls button {
                    width: 38px;
                    height: 38px;
                    border: none;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 1.3rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    min-width: 38px;
                }

                .quantity-controls button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .quantity-controls span {
                    min-width: 40px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 1.15rem;
                    color: #333;
                }

                .remove-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                    padding: 8px;
                    min-width: 40px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .remove-btn:hover {
                    opacity: 1;
                    transform: scale(1.3);
                }

                .empty-cart {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #999;
                    padding: 40px;
                    text-align: center;
                }

                .empty-cart .empty-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                    opacity: 0.3;
                }

                .empty-cart p {
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                }

                .empty-cart small {
                    color: #bbb;
                }

                .cart-footer {
                    padding: 25px;
                    border-top: 2px solid #f0f0f0;
                    background: #fafafa;
                }

                .total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #333;
                }

                .total-price {
                    color: #667eea;
                    font-size: 1.8rem;
                    font-weight: 700;
                }

                .checkout-btn {
                    width: 100%;
                    padding: 20px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 1.15rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    min-height: 60px;
                }

                .checkout-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
                }

                /* Hero Section */
                .hero {
                    padding: 80px 40px;
                    text-align: center;
                    color: white;
                }

                .hero-title {
                    font-size: 3.5rem;
                    margin: 0 0 20px 0;
                    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    font-weight: 800;
                }

                .hero-subtitle {
                    font-size: 1.4rem;
                    margin: 0 0 50px 0;
                    opacity: 0.95;
                    font-weight: 300;
                }

                .hero-stats {
                    display: flex;
                    justify-content: center;
                    gap: 80px;
                    flex-wrap: wrap;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    min-width: 120px;
                }

                .stat-number {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                }

                .stat-label {
                    font-size: 1.05rem;
                    opacity: 0.9;
                    font-weight: 500;
                }

                /* Main Content */
                .main {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 50px;
                    color: white;
                }

                .section-header h2 {
                    font-size: 2.8rem;
                    margin: 0 0 15px 0;
                    font-weight: 800;
                }

                .section-header p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    margin: 0;
                    font-weight: 300;
                }

                .loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px;
                    color: white;
                }

                .spinner {
                    width: 60px;
                    height: 60px;
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 25px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .loading p {
                    font-size: 1.2rem;
                    font-weight: 500;
                }

                .error-box {
                    text-align: center;
                    padding: 50px;
                    background: rgba(255, 71, 87, 0.15);
                    border-radius: 20px;
                    color: white;
                    border: 2px solid rgba(255, 71, 87, 0.3);
                }

                .error-icon {
                    font-size: 4rem;
                    display: block;
                    margin-bottom: 20px;
                }

                .error-box p {
                    font-size: 1.3rem;
                    font-weight: 500;
                }

                .empty-state {
                    text-align: center;
                    padding: 80px;
                    color: white;
                }

                .empty-state .empty-icon {
                    font-size: 5rem;
                    display: block;
                    margin-bottom: 25px;
                    opacity: 0.8;
                }

                .empty-state h3 {
                    font-size: 2rem;
                    margin: 0 0 15px 0;
                    font-weight: 700;
                }

                .empty-state p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    font-weight: 300;
                }

                /* Products Grid */
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 35px;
                }

                .product-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                }

                .product-card:hover {
                    transform: translateY(-15px) scale(1.02);
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
                }

                .badge-limited, .badge-sold {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    padding: 10px 18px;
                    border-radius: 25px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    z-index: 10;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .badge-limited {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                }

                .badge-sold {
                    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
                    color: white;
                }

                .product-image {
                    width: 100%;
                    height: 300px;
                    overflow: hidden;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    position: relative;
                    cursor: pointer;
                }

                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .zoom-hint {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }

                .product-image:hover .zoom-hint {
                    opacity: 1;
                }

                .product-card:hover .product-image img {
                    transform: scale(1.15) rotate(1deg);
                }

                .product-info {
                    padding: 28px;
                }

                .category {
                    display: inline-block;
                    padding: 6px 14px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .product-info h3 {
                    margin: 0 0 15px 0;
                    font-size: 1.5rem;
                    color: #2c3e50;
                    line-height: 1.4;
                    font-weight: 700;
                }

                .description {
                    color: #7f8c8d;
                    font-size: 0.95rem;
                    margin-bottom: 25px;
                    line-height: 1.7;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-footer {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .price-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .price {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stock {
                    font-size: 0.85rem;
                    color: #27ae60;
                    font-weight: 600;
                }

                .add-to-cart-btn {
                    width: 100%;
                    padding: 18px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    min-height: 56px;
                }

                .add-to-cart-btn:hover:not(:disabled) {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
                }

                .add-to-cart-btn:active:not(:disabled) {
                    transform: translateY(-2px);
                }

                .add-to-cart-btn:disabled {
                    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                /* Footer */
                .footer {
                    background: rgba(255, 255, 255, 0.98);
                    padding: 50px 40px;
                    margin-top: 80px;
                }

                .footer-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 50px;
                }

                .footer-section h3, .footer-section h4 {
                    margin: 0 0 20px 0;
                    color: #2c3e50;
                    font-weight: 700;
                }

                .footer-section p {
                    color: #7f8c8d;
                    margin: 0;
                    line-height: 1.6;
                }

                .footer-section a {
                    display: block;
                    color: #7f8c8d;
                    text-decoration: none;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .footer-section a:hover {
                    color: #667eea;
                    transform: translateX(5px);
                }

                .footer-bottom {
                    text-align: center;
                    padding-top: 35px;
                    margin-top: 35px;
                    border-top: 2px solid #ecf0f1;
                    color: #7f8c8d;
                    font-weight: 500;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .header {
                        flex-direction: column;
                        gap: 15px;
                        padding: 15px;
                    }

                    .search-bar {
                        margin: 0;
                        width: 100%;
                        max-width: none;
                        order: 2;
                    }

                    .nav {
                        order: 3;
                    }

                    .logo {
                        order: 1;
                    }

                    .nav {
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .nav-btn {
                        padding: 10px 18px;
                        font-size: 0.9rem;
                    }

                    .hero {
                        padding: 50px 20px;
                    }

                    .hero-title {
                        font-size: 2.2rem;
                    }

                    .hero-subtitle {
                        font-size: 1.1rem;
                    }

                    .hero-stats {
                        gap: 40px;
                    }

                    .stat-number {
                        font-size: 2.2rem;
                    }

                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 25px;
                    }

                    .main {
                        padding: 30px 20px;
                    }

                    .section-header h2 {
                        font-size: 2.2rem;
                    }

                    .cart-sidebar {
                        width: 100%;
                    }
                }

                /* Toast Notification Styles */
                .toast {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    padding: 16px 24px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    font-weight: 600;
                    max-width: 350px;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .toast-success {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                    color: white;
                }

                .toast-error {
                    background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
                    color: white;
                }

                .toast-icon {
                    font-size: 1.5rem;
                }

                .toast-message {
                    flex: 1;
                }

                /* Zoom Modal Styles */
                .zoom-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                    cursor: zoom-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .zoom-modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    cursor: default;
                }

                @keyframes zoomIn {
                    from {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .zoom-modal-content img {
                    max-width: 100%;
                    max-height: 90vh;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .zoom-close {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .zoom-close:hover {
                    transform: rotate(90deg) scale(1.1);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }

                /* Scroll to Top Button */
                .scroll-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .scroll-to-top:hover {
                    transform: translateY(-5px) scale(1.1);
                    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
                }

                .scroll-to-top:active {
                    transform: translateY(-2px) scale(1.05);
                }

                /* Theme Toggle Button */
                .theme-toggle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    min-width: 48px;
                }

                .theme-toggle:hover {
                    transform: rotate(180deg) scale(1.1);
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .theme-toggle .icon {
                    font-size: 1.5rem;
                }

                /* Enhanced Product Card Animation */
                .product-card {
                    animation: fadeInUp 0.6s ease backwards;
                }

                .product-card:nth-child(1) { animation-delay: 0.1s; }
                .product-card:nth-child(2) { animation-delay: 0.2s; }
                .product-card:nth-child(3) { animation-delay: 0.3s; }
                .product-card:nth-child(4) { animation-delay: 0.4s; }
                .product-card:nth-child(5) { animation-delay: 0.5s; }
                .product-card:nth-child(6) { animation-delay: 0.6s; }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Parallax Effect for Hero */
                .hero {
                    background-attachment: fixed;
                    background-size: cover;
                }

                /* Smooth Transitions for All Interactive Elements */
                button, a, .product-card, .cart-item {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </>
    )
}
