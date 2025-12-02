from crud.base import CRUDBase
from models.product_variant import ProductVariant
from crud.schemas import ProductVariantCreate, ProductVariantUpdate


class CRUDProductVariant(CRUDBase[ProductVariant, ProductVariantCreate, ProductVariantUpdate]):
    pass


product_variant = CRUDProductVariant(ProductVariant)

