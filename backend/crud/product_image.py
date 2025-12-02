from crud.base import CRUDBase
from models.product_image import ProductImage
from crud.schemas import ProductImageCreate, ProductImageUpdate


class CRUDProductImage(CRUDBase[ProductImage, ProductImageCreate, ProductImageUpdate]):
    pass


product_image = CRUDProductImage(ProductImage)

