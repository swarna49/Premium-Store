import { useState, useEffect } from "react"
import api from "../utils/api"
import Head from "next/head"
import { useRouter } from "next/router"

export default function AdminDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("stats")
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [darkMode, setDarkMode] = useState(false)

    // Form states
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
        stock: ""
    })

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            if (!parsedUser.isAdmin) {
                router.push("/products")
            }
        } else {
            router.push("/login")
        }

        const savedTheme = localStorage.getItem("darkMode")
        if (savedTheme) {
            setDarkMode(savedTheme === "true")
        }

        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [productsRes, usersRes] = await Promise.all([
                api.get("/products"),
                api.get("/users")
            ])
            setProducts(productsRes.data)
            setUsers(usersRes.data)
        } catch (err) {
            console.error("Error fetching admin data:", err)
            setError("Failed to load dashboard data. Are you an admin?")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, productForm)
            } else {
                await api.post("/products", productForm)
            }
            setShowModal(false)
            setEditingProduct(null)
            setProductForm({ name: "", price: "", description: "", category: "", image: "", stock: "" })
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await api.delete(`/products/${id}`)
            fetchData()
        } catch (err) {
            setError("Failed to delete product")
        }
    }

    const openEditModal = (product) => {
        setEditingProduct(product)
        setProductForm({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            stock: product.stock
        })
        setShowModal(true)
    }

    if (!user || !user.isAdmin) return <div className="loading-screen">Verifying Admin Status...</div>

    return (
        <div className={`admin-container ${darkMode ? 'dark' : ''}`}>
            <Head>
                <title>Admin Dashboard - Premium Store</title>
            </Head>

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>✨ Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === "stats" ? "active" : ""}
                        onClick={() => setActiveTab("stats")}
                    >
                        📊 Stats Overview
                    </button>
                    <button
                        className={activeTab === "products" ? "active" : ""}
                        onClick={() => setActiveTab("products")}
                    >
                        📦 Manage Products
                    </button>
                    <button
                        className={activeTab === "users" ? "active" : ""}
                        onClick={() => setActiveTab("users")}
                    >
                        👥 Registered Users
                    </button>
                    <div className="sidebar-spacer"></div>
                    <button onClick={() => router.push("/products")}>🛒 Back to Store</button>
                    <button onClick={handleLogout} className="logout-btn">👋 Logout</button>
                </nav>
            </aside>

            <main className="content">
                <header className="content-header">
                    <h1>{activeTab === "stats" ? "Dashboard Stats" : activeTab === "products" ? "Product Management" : "User Database"}</h1>
                    <div className="user-info">
                        <span>Welcome, <strong>Admin</strong></span>
                    </div>
                </header>

                {error && <div className="error-banner">{error}</div>}

                {loading && !products.length ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === "stats" && (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-data">
                                        <h3>Total Products</h3>
                                        <p>{products.length}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👤</div>
                                    <div className="stat-data">
                                        <h3>Total Users</h3>
                                        <p>{users.length}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📦</div>
                                    <div className="stat-data">
                                        <h3>Out of Stock</h3>
                                        <p>{products.filter(p => !p.stock || p.stock === 0).length}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🛡️</div>
                                    <div className="stat-data">
                                        <h3>System Status</h3>
                                        <p>Secure & Active</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "products" && (
                            <div className="products-section">
                                <div className="section-actions">
                                    <button className="add-btn" onClick={() => {
                                        setEditingProduct(null);
                                        setProductForm({ name: "", price: "", description: "", category: "", image: "", stock: "" });
                                        setShowModal(true);
                                    }}>
                                        ➕ Add New Product
                                    </button>
                                </div>
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td><img src={product.image || 'https://via.placeholder.com/50'} className="table-img" /></td>
                                                    <td>{product.name}</td>
                                                    <td><span className="cat-badge">{product.category}</span></td>
                                                    <td>₹{product.price.toLocaleString()}</td>
                                                    <td>{product.stock || 0}</td>
                                                    <td>
                                                        <div className="action-btns">
                                                            <button onClick={() => openEditModal(product)} className="edit-btn">Edit</button>
                                                            <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="users-section">
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Joined Date</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id}>
                                                    <td><strong>{u.name}</strong></td>
                                                    <td>{u.email}</td>
                                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={u.isAdmin ? 'role-admin' : 'role-user'}>
                                                            {u.isAdmin ? 'ADMIN' : 'USER'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Product Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleProductSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={productForm.price}
                                        onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        value={productForm.stock}
                                        onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={productForm.category}
                                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={productForm.image}
                                    onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="4"
                                    value={productForm.description}
                                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background: #f0f2f5;
                    font-family: 'Inter', sans-serif;
                }

                .admin-container.dark {
                    background: #0f172a;
                    color: white;
                }

                /* Sidebar */
                .sidebar {
                    width: 280px;
                    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                    color: white;
                    padding: 30px 20px;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-header h2 {
                    margin: 0 0 40px 0;
                    font-size: 1.5rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    flex: 1;
                }

                .sidebar-nav button {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 15px 20px;
                    border-radius: 12px;
                    text-align: left;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .sidebar-nav button:hover, .sidebar-nav button.active {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .sidebar-nav button.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .sidebar-spacer {
                    flex: 1;
                }

                .logout-btn {
                    margin-top: 20px;
                }

                /* Content Area */
                .content {
                    flex: 1;
                    padding: 40px;
                    overflow-y: auto;
                }

                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }

                .content-header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .dark .content-header h1 {
                    color: #f1f5f9;
                }

                /* Stats Cards */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }

                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                }

                .dark .stat-card {
                    background: #1e293b;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .stat-icon {
                    font-size: 2.5rem;
                    background: #f1f5f9;
                    width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                }

                .dark .stat-icon {
                    background: #334155;
                }

                .stat-data h3 {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .stat-data p {
                    margin: 5px 0 0 0;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .dark .stat-data p {
                    color: #f1f5f9;
                }

                /* Tables */
                .table-wrapper {
                    background: white;
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                    overflow-x: auto;
                }

                .dark .table-wrapper {
                    background: #1e293b;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .admin-table th {
                    padding: 15px;
                    color: #64748b;
                    font-weight: 600;
                    border-bottom: 1px solid #f1f5f9;
                }

                .dark .admin-table th {
                    border-bottom-color: #334155;
                }

                .admin-table td {
                    padding: 20px 15px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .dark .admin-table td {
                    border-bottom-color: #334155;
                }

                .table-img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 10px;
                }

                .cat-badge {
                    background: #f1f5f9;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #667eea;
                }

                .dark .cat-badge {
                    background: #334155;
                }

                /* Buttons */
                .add-btn {
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-bottom: 25px;
                    transition: all 0.3s ease;
                }

                .add-btn:hover {
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                    transform: translateY(-2px);
                }

                .action-btns {
                    display: flex;
                    gap: 10px;
                }

                .edit-btn, .delete-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .edit-btn {
                    background: #e0e7ff;
                    color: #4f46e5;
                }

                .edit-btn:hover { background: #c7d2fe; }

                .delete-btn {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .delete-btn:hover { background: #fecaca; }

                /* Role Badges */
                .role-admin, .role-user {
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .role-admin { background: #dcfce7; color: #16a34a; }
                .role-user { background: #f1f5f9; color: #64748b; }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }

                .modal-content {
                    background: white;
                    width: 500px;
                    max-width: 90vw;
                    padding: 40px;
                    border-radius: 30px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .modal-content h2 {
                    margin-top: 0;
                    margin-bottom: 30px;
                    font-weight: 800;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #64748b;
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #f1f5f9;
                    border-radius: 12px;
                    font-family: inherit;
                    transition: all 0.3s;
                }

                .form-group input:focus, .form-group textarea:focus {
                    border-color: #667eea;
                    outline: none;
                    background: white;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    margin-top: 30px;
                }

                .save-btn {
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .cancel-btn {
                    padding: 12px 30px;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .loading-screen {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: #f0f2f5;
                }

                .loader-container {
                    display: flex;
                    justify-content: center;
                    padding: 100px;
                }

                .loader {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-banner {
                    background: #fee2e2;
                    color: #dc2626;
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    font-weight: 600;
                    border: 1px solid #fecaca;
                }
            `}</style>
        </div>
    )
}
