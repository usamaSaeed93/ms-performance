from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_products import GetProductsRequest, GetProductsResponse


class GetProducts(GetResource):
    request_schema = GetProductsRequest
    response_schema = GetProductsResponse
    authentication_required = False

    # Endpoint details
    api_name = "get_products"
    api_url = "get_products"

    async def get_products(self):
        self.products, self.total = await crud.product.get_multi_with_category(
            self.db,
            category_ids=self.request_data.category_ids,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
            search=self.request_data.search,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Products fetched successfully"
        # Convert Row objects to dicts
        products_list = []
        for p in self.products:
            # Access Row object attributes directly - they exist based on our test
            avg_rating = p.average_rating if hasattr(p, 'average_rating') else None
            review_count = p.review_count if hasattr(p, 'review_count') else None
            
            # Convert Decimal to string for average_rating
            avg_rating_str = str(avg_rating) if avg_rating is not None else "0.00"
            review_count_int = int(review_count) if review_count is not None else 0
            
            product_dict = {
                "id": p.id,
                "product_name": p.product_name,
                "slug": p.slug,
                "description": p.description,
                "category_id": p.category_id,
                "quantity": p.quantity or 0,
                "price": str(p.price),
                "sale_price": str(p.sale_price) if p.sale_price else None,
                "sale_start_date": p.sale_start_date.isoformat() if p.sale_start_date and hasattr(p.sale_start_date, 'isoformat') else None,
                "sale_end_date": p.sale_end_date.isoformat() if p.sale_end_date and hasattr(p.sale_end_date, 'isoformat') else None,
                "sku": p.sku,
                "image_url": p.image_url,
                "weight": str(p.weight) if p.weight else None,
                "is_active": p.is_active,
                "is_featured": getattr(p, 'is_featured', False),
                "average_rating": avg_rating_str,
                "review_count": review_count_int,
                "created_at": p.created_at.isoformat() if hasattr(p.created_at, 'isoformat') else str(p.created_at),
                "updated_at": p.updated_at.isoformat() if hasattr(p.updated_at, 'isoformat') else str(p.updated_at),
                "category_name": p.category_name,
                "category_slug": p.category_slug,
            }
            products_list.append(product_dict)
        
        total_pages = (self.total + self.request_data.per_page - 1) // self.request_data.per_page if self.total else 0
        
        self.response_data = {
            "products": products_list,
            "total": self.total,
            "page": self.request_data.page,
            "per_page": self.request_data.per_page,
            "total_pages": total_pages,
        }

    async def process_flow(self):
        await self.get_products()
        await self.generate_response()
