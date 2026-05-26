type ProductSizeFields = {
  products_size1?: unknown;
  products_size2?: unknown;
  products_size_unit?: unknown;
  product_size_unit?: unknown;
  size_unit?: unknown;
  sizeUnit?: unknown;
};

export function getProductSizeUnit(product: ProductSizeFields) {
  const hasSize =
    product.products_size1 !== undefined ||
    product.products_size2 !== undefined;

  return String(
    product.products_size_unit ||
      product.product_size_unit ||
      product.size_unit ||
      product.sizeUnit ||
      (hasSize ? "Feet" : ""),
  );
}

export function withProductSizeUnit<T extends ProductSizeFields>(product: T) {
  return {
    ...product,
    products_size_unit: getProductSizeUnit(product),
  };
}
