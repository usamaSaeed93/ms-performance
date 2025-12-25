from fastapi import status
from sqlalchemy import select, and_, or_
from datetime import datetime

import crud
from api.base_resource import GetResource
from ..schemas.get_orders import GetOrdersRequest, GetOrdersResponse
from models.sale import Sale
from starlette_context import context


class GetOrders(GetResource):
    request_schema = GetOrdersRequest
    response_schema = GetOrdersResponse
    authentication_required = True

    api_name = "get_orders"
    api_url = "get_orders"

    async def get_orders(self):
        # Get current user
        user = context.data.get("user")
        if not user:
            self.early_response = True
            self.status_code = status.HTTP_401_UNAUTHORIZED
            self.response_message = "Authentication required"
            self.response_data = {}
            return
        
        user_obj = await crud.user.get(self.db, id=user["id"])
        if not user_obj:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "User not found"
            self.response_data = {}
            return
        
        # Build query with filters
        stmt = select(Sale)
        filters = []
        
        # Customers can only see their own orders, admins can see all (unless filtered)
        if user_obj.role != "admin":
            filters.append(Sale.user_id == user["id"])
        elif self.request_data.user_id:
            filters.append(Sale.user_id == self.request_data.user_id)
        
        # Apply filters
        if self.request_data.order_status:
            filters.append(Sale.order_status == self.request_data.order_status)
        
        if self.request_data.payment_status:
            filters.append(Sale.payment_status == self.request_data.payment_status)
        
        if self.request_data.payment_method:
            filters.append(Sale.payment_method == self.request_data.payment_method)
        
        if self.request_data.start_date:
            try:
                # Handle different date formats
                date_str = self.request_data.start_date
                if 'T' not in date_str:
                    # If no time, assume start of day
                    date_str = f"{date_str}T00:00:00"
                if 'Z' in date_str:
                    date_str = date_str.replace('Z', '+00:00')
                elif '+' not in date_str and '-' not in date_str[-6:]:
                    # No timezone, assume UTC
                    date_str = f"{date_str}+00:00"
                start_dt = datetime.fromisoformat(date_str)
                filters.append(Sale.created_at >= start_dt)
            except Exception as e:
                import logging
                logger = logging.getLogger("orders")
                logger.warning(f"Invalid start_date format: {self.request_data.start_date}, error: {str(e)}")
                pass  # Invalid date format, ignore
        
        if self.request_data.end_date:
            try:
                # Handle different date formats
                date_str = self.request_data.end_date
                if 'T' not in date_str:
                    # If no time, assume end of day
                    date_str = f"{date_str}T23:59:59"
                if 'Z' in date_str:
                    date_str = date_str.replace('Z', '+00:00')
                elif '+' not in date_str and '-' not in date_str[-6:]:
                    # No timezone, assume UTC
                    date_str = f"{date_str}+00:00"
                end_dt = datetime.fromisoformat(date_str)
                # Add one day to include the entire end date
                from datetime import timedelta
                end_dt = end_dt + timedelta(days=1)
                filters.append(Sale.created_at < end_dt)
            except Exception as e:
                import logging
                logger = logging.getLogger("orders")
                logger.warning(f"Invalid end_date format: {self.request_data.end_date}, error: {str(e)}")
                pass  # Invalid date format, ignore
        
        if self.request_data.search:
            search_term = f"%{self.request_data.search}%"
            filters.append(
                or_(
                    Sale.order_number.like(search_term),
                    Sale.payment_intent_id.like(search_term),
                )
            )
        
        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))
        
        # Apply ordering
        order_column = getattr(Sale, self.request_data.order_by, None)
        if order_column is None:
            order_column = Sale.id  # Default to id if column doesn't exist
        
        if self.request_data.order == "desc":
            stmt = stmt.order_by(order_column.desc())
        else:
            stmt = stmt.order_by(order_column.asc())
        
        # Get total count (same filters)
        from sqlalchemy import func
        count_stmt = select(func.count(Sale.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        count_result = await self.db.execute(count_stmt)
        self.total = count_result.scalar() or 0
        
        # Apply pagination
        offset = (self.request_data.page - 1) * self.request_data.per_page
        stmt = stmt.offset(offset).limit(self.request_data.per_page)
        
        # Execute query
        result = await self.db.execute(stmt)
        self.orders = result.scalars().all()

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Orders retrieved successfully"
        
        orders_list = [x.to_dict() for x in self.orders]
        total_pages = (self.total + self.request_data.per_page - 1) // self.request_data.per_page if self.total else 0
        
        self.response_data = {
            "orders": orders_list,
            "total": self.total,
            "page": self.request_data.page,
            "per_page": self.request_data.per_page,
            "total_pages": total_pages,
        }
        
    async def process_flow(self):
        await self.get_orders()
        if not self.early_response:
            await self.generate_response()

