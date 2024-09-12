import React, { useMemo, useCallback } from 'react';
import { useFormik, FormikErrors } from 'formik';
import { Product, FormValues, AddEditProductProps } from './type';

const AddEditProduct: React.FunctionComponent<AddEditProductProps> = ({
  product,
  addProduct,
  updateProduct,
  cancelEdit,
  products,
}) => {
  const existingSkus = useMemo(() => new Set(products.map(p => p.sku)), [products]);

  const validate = useCallback((values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    if (!values.sku) {
      errors.sku = 'SKU không được rỗng';
    } else if (values.sku.length !== 6) {
      errors.sku = 'SKU phải có 6 ký tự';
    } else if (existingSkus.has(values.sku) && (!product || values.sku !== product.sku)) {
      errors.sku = 'SKU đã tồn tại';
    }
    if (!values.name) {
      errors.name = 'Tên sản phẩm không được rỗng';
    } else if (values.name.length < 5) {
      errors.name = 'Tên sản phẩm phải ít nhất 5 ký tự';
    } else if (values.name.length > 25) {
      errors.name = 'Tên sản phẩm không được dài quá 25 ký tự';
    }
    if (!values.price) {
      errors.price = 'Giá không được phép rỗng';
    } else if (Number(values.price) <= 0) {
      errors.price = 'Giá phải lớn hơn 0';
    }
    if (!values.detail) {
      errors.detail = 'Chi tiết không được rỗng';
    }

    return errors;
  }, [existingSkus, product]);

  const formik = useFormik<FormValues>({
    initialValues: {
      sku: product ? product.sku : '',
      name: product ? product.name : '',
      price: product ? product.price : '',
      detail: product ? product.detail : '',
      thumbnail: product ? product.thumbnail : '',
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      const price = typeof values.price === 'string' ? Number(values.price) : values.price;

      if (product) {
        updateProduct({
          ...product,
          sku: values.sku,
          name: values.name,
          price,
          detail: values.detail,
          thumbnail: values.thumbnail,
        });
      } else {
        const newProduct: Product = {
          id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
          sku: values.sku,
          name: values.name,
          price,
          detail: values.detail,
          thumbnail: values.thumbnail,
        };
        addProduct(newProduct);
      }
      resetForm();
      cancelEdit();
    }


  });

  return (
    <section className="product-form">
      <h2>{product ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          id="sku"
          name="sku"
          onChange={formik.handleChange}
          value={formik.values.sku}
        />
        {formik.errors.sku && formik.touched.sku && (
          <p className="error">{formik.errors.sku}</p>
        )}

        <label htmlFor="name">NAME:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name && formik.touched.name && (
          <p className="error">{formik.errors.name}</p>
        )}

        <label htmlFor="price">PRICE:</label>
        <input
          type="number"
          id="price"
          name="price"
          onChange={formik.handleChange}
          value={formik.values.price}
        />
        {formik.errors.price && formik.touched.price && (
          <p className="error">{formik.errors.price}</p>
        )}

        <label htmlFor="detail">DETAIL:</label>
        <input
          type="text"
          id="detail"
          name="detail"
          onChange={formik.handleChange}
          value={formik.values.detail}
        />
        {formik.errors.detail && formik.touched.detail && (
          <p className="error">{formik.errors.detail}</p>
        )}

        <label htmlFor="thumbnail">THUMBNAIL:</label>
        <input
          type="text"
          id="thumbnail"
          name="thumbnail"
          onChange={formik.handleChange}
          value={formik.values.thumbnail}
        />
        <button type="submit">{product ? 'Cập Nhật' : 'Thêm Mới'}</button>
        <button type="button" onClick={cancelEdit}>Hủy</button>
      </form>
    </section>
  );
};

export default AddEditProduct;
