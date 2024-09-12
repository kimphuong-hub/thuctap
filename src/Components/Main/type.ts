
export interface Product {
    id: number;
    sku: string;
    name: string;
    detail: string;
    thumbnail: string;
    price: number;
  }
  export interface FormValues {
    sku: string;
    name: string;
    price: number | string;
    detail: string;
    thumbnail: string;
  };
  
  export interface AddEditProductProps {
  product?: Product;
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  cancelEdit: () => void;
  products: Product[];
}