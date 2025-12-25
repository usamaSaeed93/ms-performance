from pydantic import BaseModel
from crud.schemas import Product, Inventory, ProductVariant


class GetProductRequest(BaseModel):
    product_id: int


class GetProductResponse(Product):
    inventory: list[Inventory]
    variants: list[ProductVariant] = []
