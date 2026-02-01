import api from "../utils/api"
export default function Home({ products }) {
    return (
        <div>
            <h1>My Store</h1>
            {products.map(p => (
                <div key={p._id}>
                    <img src={p.image} width="150" />
                    <h3>{p.name}</h3>
                    <p>${p.price}</p>
                </div>
            ))}
        </div>
    )
}

export async function getServerSideProps() {
    const { data } = await api.get("/products")
    return { props: { products: data } }
}
