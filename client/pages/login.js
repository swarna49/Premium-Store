import { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import api from "../utils/api"

export default function Login() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            if (isLogin) {
                // Login
                const { data } = await api.post("/users/login", {
                    email: formData.email,
                    password: formData.password
                })

                // Save token and user data
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                // Clear existing cart for a fresh login session
                localStorage.removeItem("cart")

                setSuccess("Login successful! Redirecting...")
                setTimeout(() => {
                    if (data.user.isAdmin) {
                        router.push("/admin")
                    } else {
                        router.push("/products")
                    }
                }, 1500)
            } else {
                // Register
                const { data } = await api.post("/users/register", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })

                // Save token and user data
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                // Clear existing cart for a new registration
                localStorage.removeItem("cart")

                setSuccess("Registration successful! Redirecting...")
                setTimeout(() => {
                    if (data.user.isAdmin) {
                        router.push("/admin")
                    } else {
                        router.push("/products")
                    }
                }, 1500)
            }
        } catch (err) {
            console.error("Auth error:", err)
            if (err.response) {
                // Server responded with an error
                setError(err.response.data.message || "Authentication failed. Please check your credentials.")
            } else if (err.request) {
                // Request was made but no response received
                setError("Unable to reach the server. Please check if the backend is running.")
            } else {
                // Something happened in setting up the request
                setError("An error occurred during authentication. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setError("")
        setSuccess("")
        setFormData({ name: "", email: "", password: "" })
    }

    return (
        <>
            <Head>
                <title>{`${isLogin ? "Login" : "Register"} - Premium Store`}</title>
                <meta name="description" content="Login or register to start shopping" />
            </Head>

            <div className="auth-container">
                {/* Background Decoration */}
                <div className="bg-decoration">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>

                {/* Back to Home Button */}
                <button className="back-btn" onClick={() => router.push("/welcome")}>
                    ← Back to Home
                </button>

                {/* Auth Card */}
                <div className="auth-card">
                    {/* Logo Section */}
                    <div className="logo-section">
                        <div className="logo-icon">✨</div>
                        <h1>Premium Store</h1>
                        <p className="subtitle">
                            {isLogin ? "Welcome back!" : "Create your account"}
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">
                                    <span className="icon">👤</span>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">
                                <span className="icon">📧</span>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <span className="icon">🔒</span>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                minLength="6"
                            />
                            {!isLogin && (
                                <small className="hint">Minimum 6 characters</small>
                            )}
                        </div>

                        {error && (
                            <div className="message error-message">
                                <span className="icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="message success-message">
                                <span className="icon">✅</span>
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Login" : "Create Account"}
                                    <span className="arrow">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="toggle-section">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button onClick={toggleMode} className="toggle-btn">
                            {isLogin ? "Create Account" : "Login"}
                        </button>
                    </div>

                    {/* Features */}
                    <div className="features">
                        <div className="feature">
                            <span className="feature-icon">🚀</span>
                            <span>Fast Checkout</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🔒</span>
                            <span>Secure</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">💳</span>
                            <span>Easy Payment</span>
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

                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }

                /* Background Decoration */
                .bg-decoration {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    overflow: hidden;
                    z-index: 0;
                }

                .circle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    animation: float 20s infinite ease-in-out;
                }

                .circle-1 {
                    width: 300px;
                    height: 300px;
                    top: -100px;
                    left: -100px;
                    animation-delay: 0s;
                }

                .circle-2 {
                    width: 200px;
                    height: 200px;
                    bottom: -50px;
                    right: -50px;
                    animation-delay: 7s;
                }

                .circle-3 {
                    width: 150px;
                    height: 150px;
                    top: 50%;
                    right: 10%;
                    animation-delay: 14s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                /* Back Button */
                .back-btn {
                    position: absolute;
                    top: 30px;
                    left: 30px;
                    padding: 12px 24px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .back-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateX(-5px);
                }

                /* Auth Card */
                .auth-card {
                    background: white;
                    border-radius: 30px;
                    padding: 50px;
                    max-width: 480px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                    z-index: 1;
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

                /* Logo Section */
                .logo-section {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .logo-icon {
                    font-size: 4rem;
                    margin-bottom: 15px;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .logo-section h1 {
                    font-size: 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                }

                .subtitle {
                    color: #7f8c8d;
                    font-size: 1.1rem;
                }

                /* Form */
                .auth-form {
                    margin-bottom: 30px;
                }

                .form-group {
                    margin-bottom: 25px;
                }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 10px;
                    font-size: 0.95rem;
                }

                .form-group label .icon {
                    font-size: 1.2rem;
                }

                .form-group input {
                    width: 100%;
                    padding: 15px 20px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .form-group input::placeholder {
                    color: #bdc3c7;
                }

                .hint {
                    display: block;
                    margin-top: 8px;
                    color: #95a5a6;
                    font-size: 0.85rem;
                }

                /* Messages */
                .message {
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .error-message {
                    background: #ffe5e5;
                    color: #c0392b;
                    border: 2px solid #e74c3c;
                }

                .success-message {
                    background: #d4edda;
                    color: #155724;
                    border: 2px solid #28a745;
                }

                .message .icon {
                    font-size: 1.3rem;
                }

                /* Submit Button */
                .submit-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                }

                .submit-btn:active:not(:disabled) {
                    transform: translateY(-1px);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .arrow {
                    font-size: 1.3rem;
                    transition: transform 0.3s ease;
                }

                .submit-btn:hover .arrow {
                    transform: translateX(5px);
                }

                .spinner-small {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Toggle Section */
                .toggle-section {
                    text-align: center;
                    padding-top: 25px;
                    border-top: 2px solid #ecf0f1;
                }

                .toggle-section p {
                    color: #7f8c8d;
                    margin-bottom: 15px;
                    font-size: 0.95rem;
                }

                .toggle-btn {
                    background: none;
                    border: none;
                    color: #667eea;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: underline;
                }

                .toggle-btn:hover {
                    color: #764ba2;
                    transform: scale(1.05);
                }

                /* Features */
                .features {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 30px;
                    padding-top: 25px;
                    border-top: 2px solid #ecf0f1;
                }

                .feature {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    color: #7f8c8d;
                    font-weight: 600;
                }

                .feature-icon {
                    font-size: 1.8rem;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .auth-card {
                        padding: 35px 25px;
                        border-radius: 20px;
                    }

                    .logo-section h1 {
                        font-size: 1.6rem;
                    }

                    .logo-icon {
                        font-size: 3rem;
                    }

                    .back-btn {
                        top: 15px;
                        left: 15px;
                        padding: 10px 18px;
                        font-size: 0.9rem;
                    }

                    .features {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .feature {
                        flex-direction: row;
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    )
}
