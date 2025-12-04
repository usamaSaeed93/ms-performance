from crud.schemas import ProductUpdate, Product


class UpdateProductRequest(ProductUpdate):
    product_id: int


class UpdateProductResponse(Product):
    pass
