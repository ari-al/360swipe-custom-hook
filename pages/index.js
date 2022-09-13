import Layout from "../components/Layout";
import Product from "../components/Product";
import ProductDetail from "../components/ProductDetail";

export default function Home() {
  return (
    <Layout>
      <Product />
      <ProductDetail />
    </Layout>
  );
}
