from api.base_routing import BaseRouting

from .endpoints.register_user import RegisterUser
from .endpoints.signup import Signup
from .endpoints.login_user import LoginUser
from .endpoints.confirm_email import ConfirmEmailGet, ConfirmEmailPost, ResendConfirmationEmail
from .endpoints.create_product import CreateProduct
from .endpoints.add_inventory import AddInventory
from .endpoints.get_product import GetProduct
from .endpoints.get_low_stock_products import GetLowStockProducts
from .endpoints.purchase_products import PurchaseProducts
from .endpoints.create_category import CreateCategory
from .endpoints.get_categories import GetCategories
from .endpoints.get_products import GetProducts
from .endpoints.get_sales_data import GetSalesData
from .endpoints.get_users import GetUsers
from .endpoints.update_product import UpdateProduct
from .endpoints.delete_product import DeleteProduct
from .endpoints.get_orders import GetOrders
from .endpoints.update_order import UpdateOrder
from .endpoints.update_category import UpdateCategory
from .endpoints.update_user import UpdateUser
from .endpoints.upload_image import UploadImage
from .endpoints.create_discount import CreateDiscount
from .endpoints.get_discounts import GetDiscounts
from .endpoints.create_product_image import CreateProductImage
from .endpoints.get_product_images import GetProductImages
from .endpoints.update_product_images import UpdateProductImages
from .endpoints.create_product_review import CreateProductReview
from .endpoints.get_product_reviews import GetProductReviews
from .endpoints.update_product_review import UpdateProductReview
from .endpoints.delete_product_review import DeleteProductReview
from .endpoints.create_blog import CreateBlog
from .endpoints.update_blog import UpdateBlog
from .endpoints.get_blog import GetBlog
from .endpoints.get_blogs import GetBlogs
from .endpoints.get_published_blogs import GetPublishedBlogs
from .endpoints.delete_blog import DeleteBlog


class RoutingV1(BaseRouting):
    api_version: str = "v1"

    def set_routing_collection(self):
        self.routing_collection[RegisterUser.api_name] = (
            RegisterUser(),
            RegisterUser.api_url,
        )
        self.routing_collection[Signup.api_name] = (
            Signup(),
            Signup.api_url,
        )
        self.routing_collection[LoginUser.api_name] = (LoginUser(), LoginUser.api_url)
        self.routing_collection[ConfirmEmailGet.api_name] = (ConfirmEmailGet(), ConfirmEmailGet.api_url)
        self.routing_collection[ConfirmEmailPost.api_name] = (ConfirmEmailPost(), ConfirmEmailPost.api_url)
        self.routing_collection[ResendConfirmationEmail.api_name] = (ResendConfirmationEmail(), ResendConfirmationEmail.api_url)
        self.routing_collection[CreateProduct.api_name] = (
            CreateProduct(),
            CreateProduct.api_url,
        )
        self.routing_collection[AddInventory.api_name] = (
            AddInventory(),
            AddInventory.api_url,
        )
        self.routing_collection[GetProduct.api_name] = (
            GetProduct(),
            GetProduct.api_url,
        )
        self.routing_collection[GetLowStockProducts.api_name] = (
            GetLowStockProducts(),
            GetLowStockProducts.api_url,
        )
        self.routing_collection[PurchaseProducts.api_name] = (
            PurchaseProducts(),
            PurchaseProducts.api_url,
        )
        self.routing_collection[CreateCategory.api_name] = (
            CreateCategory(),
            CreateCategory.api_url,
        )
        self.routing_collection[GetCategories.api_name] = (
            GetCategories(),
            GetCategories.api_url,
        )
        self.routing_collection[GetProducts.api_name] = (
            GetProducts(),
            GetProducts.api_url,
        )
        self.routing_collection[GetSalesData.api_name] = (
            GetSalesData(),
            GetSalesData.api_url,
        )
        self.routing_collection[GetUsers.api_name] = (
            GetUsers(),
            GetUsers.api_url,
        )
        self.routing_collection[UpdateProduct.api_name] = (
            UpdateProduct(),
            UpdateProduct.api_url,
        )
        self.routing_collection[DeleteProduct.api_name] = (
            DeleteProduct(),
            DeleteProduct.api_url,
        )
        self.routing_collection[GetOrders.api_name] = (
            GetOrders(),
            GetOrders.api_url,
        )
        self.routing_collection[UpdateOrder.api_name] = (
            UpdateOrder(),
            UpdateOrder.api_url,
        )
        self.routing_collection[UpdateCategory.api_name] = (
            UpdateCategory(),
            UpdateCategory.api_url,
        )
        self.routing_collection[UpdateUser.api_name] = (
            UpdateUser(),
            UpdateUser.api_url,
        )
        self.routing_collection[UploadImage.api_name] = (
            UploadImage(),
            UploadImage.api_url,
        )
        self.routing_collection[CreateDiscount.api_name] = (
            CreateDiscount(),
            CreateDiscount.api_url,
        )
        self.routing_collection[GetDiscounts.api_name] = (
            GetDiscounts(),
            GetDiscounts.api_url,
        )
        self.routing_collection[CreateProductImage.api_name] = (
            CreateProductImage(),
            CreateProductImage.api_url,
        )
        self.routing_collection[GetProductImages.api_name] = (
            GetProductImages(),
            GetProductImages.api_url,
        )
        self.routing_collection[UpdateProductImages.api_name] = (
            UpdateProductImages(),
            UpdateProductImages.api_url,
        )
        self.routing_collection[CreateProductReview.api_name] = (
            CreateProductReview(),
            CreateProductReview.api_url,
        )
        self.routing_collection[GetProductReviews.api_name] = (
            GetProductReviews(),
            GetProductReviews.api_url,
        )
        self.routing_collection[UpdateProductReview.api_name] = (
            UpdateProductReview(),
            UpdateProductReview.api_url,
        )
        self.routing_collection[DeleteProductReview.api_name] = (
            DeleteProductReview(),
            DeleteProductReview.api_url,
        )
        self.routing_collection[CreateBlog.api_name] = (
            CreateBlog(),
            CreateBlog.api_url,
        )
        self.routing_collection[UpdateBlog.api_name] = (
            UpdateBlog(),
            UpdateBlog.api_url,
        )
        self.routing_collection[GetBlog.api_name] = (
            GetBlog(),
            GetBlog.api_url,
        )
        self.routing_collection[GetBlogs.api_name] = (
            GetBlogs(),
            GetBlogs.api_url,
        )
        self.routing_collection[GetPublishedBlogs.api_name] = (
            GetPublishedBlogs(),
            GetPublishedBlogs.api_url,
        )
        self.routing_collection[DeleteBlog.api_name] = (
            DeleteBlog(),
            DeleteBlog.api_url,
        )
