import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"

export default function Welcome() {
    const router = useRouter()
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        setAnimate(true)

        // Check if user is already logged in
        const token = localStorage.getItem("token")
        if (token) {
            const userData = localStorage.getItem("user")
            if (userData) {
                const user = JSON.parse(userData)
                if (user.isAdmin) {
                    router.push("/admin")
                } else {
                    router.push("/products")
                }
            } else {
                router.push("/products")
            }
        }
    }, [])

    return (
        <>
            <Head>
                <title>Welcome to Premium Store</title>
                <meta name="description" content="Your premium shopping destination" />
            </Head>

            <div className="welcome-container">
                {/* Animated Background */}
                <div className="background-animation">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>

                {/* Main Content */}
                <div className={`content ${animate ? 'animate' : ''}`}>
                    {/* Logo */}
                    <div className="logo-section">
                        <div className="logo-icon">✨</div>
                        <h1 className="store-title">Premium Store</h1>
                        <p className="store-tagline">Quality You Can Trust</p>
                    </div>

                    {/* Features */}
                    <div className="features">
                        <div className="feature">
                            <span className="feature-icon">🛍️</span>
                            <h3>Premium Products</h3>
                            <p>Handpicked quality items</p>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🚚</span>
                            <h3>Free Delivery</h3>
                            <p>On all orders</p>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">💳</span>
                            <h3>Secure Payment</h3>
                            <p>100% safe & secure</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="cta-section">
                        <button
                            className="cta-btn primary"
                            onClick={() => router.push("/login")}
                        >
                            Get Started 🚀
                        </button>
                        <button
                            className="cta-btn secondary"
                            onClick={() => router.push("/products")}
                        >
                            Browse Products
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="stats">
                        <div className="stat">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="welcome-footer">
                    <p>© 2026 Premium Store. All rights reserved.</p>
                </footer>
            </div>

            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .welcome-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 20px;
                }

                /* Animated Background */
                .background-animation {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
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
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .circle-2 {
                    width: 200px;
                    height: 200px;
                    top: 60%;
                    right: 10%;
                    animation-delay: 5s;
                }

                .circle-3 {
                    width: 150px;
                    height: 150px;
                    bottom: 20%;
                    left: 50%;
                    animation-delay: 10s;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-50px) rotate(180deg);
                    }
                }

                /* Main Content */
                .content {
                    position: relative;
                    z-index: 10;
                    max-width: 900px;
                    width: 100%;
                    text-align: center;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .content.animate {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Logo Section */
                .logo-section {
                    margin-bottom: 60px;
                }

                .logo-icon {
                    font-size: 6rem;
                    margin-bottom: 20px;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .store-title {
                    font-size: 4.5rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 15px;
                    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    letter-spacing: -2px;
                }

                .store-tagline {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 300;
                    letter-spacing: 2px;
                }

                /* Features */
                .features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 30px;
                    margin-bottom: 60px;
                }

                .feature {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    padding: 35px 25px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }

                .feature:hover {
                    transform: translateY(-10px);
                    background: rgba(255, 255, 255, 0.25);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .feature-icon {
                    font-size: 3rem;
                    display: block;
                    margin-bottom: 15px;
                }

                .feature h3 {
                    color: white;
                    font-size: 1.3rem;
                    margin-bottom: 8px;
                    font-weight: 700;
                }

                .feature p {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95rem;
                }

                /* CTA Section */
                .cta-section {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-bottom: 60px;
                    flex-wrap: wrap;
                }

                .cta-btn {
                    padding: 20px 50px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 60px;
                    min-width: 220px;
                    letter-spacing: 0.5px;
                }

                .cta-btn.primary {
                    background: white;
                    color: #667eea;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .cta-btn.primary:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
                }

                .cta-btn.secondary {
                    background: transparent;
                    color: white;
                    border: 3px solid white;
                }

                .cta-btn.secondary:hover {
                    background: white;
                    color: #667eea;
                    transform: translateY(-5px) scale(1.05);
                }

                /* Stats */
                .stats {
                    display: flex;
                    justify-content: center;
                    gap: 60px;
                    flex-wrap: wrap;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .stat-number {
                    font-size: 3rem;
                    font-weight: 900;
                    color: white;
                    text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .stat-label {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-top: 5px;
                    font-weight: 500;
                }

                /* Footer */
                .welcome-footer {
                    position: absolute;
                    bottom: 20px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .store-title {
                        font-size: 3rem;
                    }

                    .store-tagline {
                        font-size: 1.2rem;
                    }

                    .logo-icon {
                        font-size: 4rem;
                    }

                    .features {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .cta-section {
                        flex-direction: column;
                        align-items: center;
                    }

                    .cta-btn {
                        width: 100%;
                        max-width: 300px;
                    }

                    .stats {
                        gap: 40px;
                    }

                    .stat-number {
                        font-size: 2.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .store-title {
                        font-size: 2.5rem;
                    }

                    .feature-icon {
                        font-size: 2.5rem;
                    }

                    .stats {
                        flex-direction: column;
                        gap: 30px;
                    }
                }
            `}</style>
        </>
    )
}
