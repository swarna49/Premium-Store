import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to welcome page
        router.push("/welcome")
    }, [])

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '1.5rem'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
                <p>Loading Premium Store...</p>
            </div>
        </div>
    )
}
