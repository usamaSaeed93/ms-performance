from fastapi import status
from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime

from api.base_resource import PostResource
from crud.discount import discount


class ValidateDiscountRequest(BaseModel):
    code: str = Field(..., min_length=1)
    order_amount: float = Field(..., ge=0)


class ValidateDiscountResponse(BaseModel):
    valid: bool
    code: Optional[str] = None
    name: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    discount_amount: Optional[float] = None
    minimum_order_amount: Optional[float] = None
    maximum_discount_amount: Optional[float] = None
    message: str


class ValidateDiscount(PostResource):
    request_schema = ValidateDiscountRequest
    response_schema = ValidateDiscountResponse
    authentication_required = False  # Allow checking promo codes without login

    api_name = "validate_discount"
    api_url = "validate-discount"

    async def process_flow(self):
        code = self.request_data.code.strip().upper()
        order_amount = self.request_data.order_amount
        now = datetime.utcnow()

        # Validate the discount code
        discount_obj = await discount.validate_discount(
            self.db,
            code=code,
            order_amount=order_amount
        )

        if not discount_obj:
            # Check if the code exists but is invalid for another reason
            existing = await discount.get_by_code(self.db, code=code)
            
            if not existing:
                self.response_data = {
                    "valid": False,
                    "message": "Invalid promo code"
                }
            elif not existing.is_active:
                self.response_data = {
                    "valid": False,
                    "message": "This promo code is no longer active"
                }
            else:
                # Normalize timezone for valid_until check
                valid_until = existing.valid_until
                if valid_until and valid_until.tzinfo is not None:
                    valid_until = valid_until.replace(tzinfo=None)
                
                # Normalize timezone for valid_from check
                valid_from = existing.valid_from
                if valid_from.tzinfo is not None:
                    valid_from = valid_from.replace(tzinfo=None)
                
                if valid_until and valid_until < now:
                    self.response_data = {
                        "valid": False,
                        "message": "This promo code has expired"
                    }
                elif valid_from > now:
                    self.response_data = {
                        "valid": False,
                        "message": "This promo code is not yet valid"
                    }
                elif existing.usage_limit and existing.usage_count >= existing.usage_limit:
                    self.response_data = {
                        "valid": False,
                        "message": "This promo code has reached its usage limit"
                    }
                elif existing.minimum_order_amount and order_amount < float(existing.minimum_order_amount):
                    self.response_data = {
                        "valid": False,
                        "message": f"Minimum order amount of £{float(existing.minimum_order_amount):.2f} required"
                    }
                else:
                    self.response_data = {
                        "valid": False,
                        "message": "This promo code cannot be applied"
                    }
            
            self.status_code = status.HTTP_200_OK
            self.response_message = "Discount validation completed"
            return

        # Calculate the discount amount
        discount_type = discount_obj.discount_type
        discount_value = float(discount_obj.discount_value)
        
        if discount_type == "percentage":
            calculated_discount = (order_amount * discount_value) / 100
            # Apply maximum discount cap if set
            if discount_obj.maximum_discount_amount:
                max_discount = float(discount_obj.maximum_discount_amount)
                calculated_discount = min(calculated_discount, max_discount)
        else:  # fixed
            calculated_discount = min(discount_value, order_amount)

        self.response_data = {
            "valid": True,
            "code": discount_obj.code,
            "name": discount_obj.name,
            "discount_type": discount_type,
            "discount_value": discount_value,
            "discount_amount": round(calculated_discount, 2),
            "minimum_order_amount": float(discount_obj.minimum_order_amount) if discount_obj.minimum_order_amount else None,
            "maximum_discount_amount": float(discount_obj.maximum_discount_amount) if discount_obj.maximum_discount_amount else None,
            "message": f"Promo code applied! You save £{calculated_discount:.2f}"
        }
        
        self.status_code = status.HTTP_200_OK
        self.response_message = "Discount validated successfully"
