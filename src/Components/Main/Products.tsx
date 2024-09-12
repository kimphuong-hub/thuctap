import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AddEditProduct from './AddEditProduct';
import { Product } from './type'; 


interface ProductsProps {}

const Products: React.FC<ProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem('products') || '[]') as Product[];
      console.log('Loaded products from localStorage:', savedProducts);
      setProducts(savedProducts);
    } catch (error) {
      console.error('Failed to parse products from localStorage', error);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    console.log('Saving products to localStorage:', products);
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product.sku === updatedProduct.sku ? updatedProduct : product
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    setEditingProduct(null);
  }, []);

  const handleDelete = useCallback((sku: string) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(product => product.sku !== sku);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, []);

  const startEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const productList = useMemo(() => filteredProducts.map(item => (
    <tr key={item.sku}>
      <td>{item.id}</td>
      <td>{item.sku}</td>
      <td>{item.name}</td>
      <td>{item.detail}</td>
      <td>
        <img src={item.thumbnail} alt={item.name} style={{ width: '100px', height: 'auto' }} />
      </td>
      <td>{item.price.toLocaleString()} VND</td>
      <td>
        <button onClick={() => startEditProduct(item)}>Chỉnh Sửa</button> |
        <button onClick={() => handleDelete(item.sku)}>Xóa</button>
      </td>
    </tr>
  )), [filteredProducts, startEditProduct, handleDelete]);

  return (
    <div>
      <section className="product-list">
        <h2>Danh Sách Sản Phẩm</h2>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => { setEditingProduct(null); setShowAddProduct(true); }}>
          Thêm Sản Phẩm
        </button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>NAME</th>
              <th>DETAIL</th>
              <th>THUMBNAIL</th>
              <th>PRICE</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {productList.length > 0 ? productList : (
              <tr>
                <td colSpan={7}>Không có sản phẩm nào để hiển thị.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      {(showAddProduct || editingProduct) && (
        <AddEditProduct
          product={editingProduct || undefined}
          addProduct={addProduct}
          updateProduct={updateProduct}
          cancelEdit={() => { setShowAddProduct(false); setEditingProduct(null); }}
          products={products}
        />
      )}
    </div>
  );
};

export default Products;
