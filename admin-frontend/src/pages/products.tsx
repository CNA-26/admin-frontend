import AdminLayout from "../layout/AdminLayout";
import ProductCard from "../components/products/productCard";

const products = () => {
    return(
        <AdminLayout>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <ProductCard name="Monstera Deliciosa" price="€49.99" stock={15}/>
                <ProductCard name="Pothos Golden" price="€29.99" stock={22}/>
                <ProductCard name="Snake Plant" price="€34.99" stock={18}/>
                <ProductCard name="Philodendron" price="€39.99" stock={14}/>
                <ProductCard name="ZZ Plant" price="€44.99" stock={10}/>
                <ProductCard name="Rubber Plant" price="€54.99" stock={8}/>
                <ProductCard name="Calathea Orbifolia" price="€59.99" stock={12}/>
                <ProductCard name="Fiddle Leaf Fig" price="€69.99" stock={6}/>
            </div>
        </AdminLayout>
    ) 
}

export default products;
