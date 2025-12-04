"""
Tax Calculation Service
WooCommerce-like tax system for UK VAT
"""
from decimal import Decimal
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.tax import TaxClass, TaxRate
from models.product import Product


class TaxCalculator:
    """
    Tax calculation service similar to WooCommerce
    Handles tax calculation based on product tax classes and rates
    """
    
    DEFAULT_COUNTRY_CODE = "GB"  # UK
    DEFAULT_STANDARD_VAT_RATE = Decimal("0.2000")  # 20% UK VAT standard rate
    
    @staticmethod
    async def get_tax_rate_for_product(
        db: AsyncSession,
        product: Product,
        country_code: str = DEFAULT_COUNTRY_CODE,
        state_code: Optional[str] = None,
        postcode: Optional[str] = None,
        city: Optional[str] = None
    ) -> Decimal:
        """
        Get the applicable tax rate for a product based on its tax class and location
        
        Args:
            db: Database session
            product: Product instance
            country_code: Customer's country code (default: GB for UK)
            state_code: Customer's state/province code (optional)
            postcode: Customer's postcode (optional)
            city: Customer's city (optional)
        
        Returns:
            Tax rate as Decimal (e.g., 0.2000 for 20%)
        """
        # If product is not taxable, return 0
        if product.tax_status == "none":
            return Decimal("0.0000")
        
        # If product has a tax class, find the rate for that class
        if product.tax_class_id:
            stmt = select(TaxRate).where(
                TaxRate.tax_class_id == product.tax_class_id,
                TaxRate.country_code == country_code,
                TaxRate.is_active == True
            )
            
            # Add location filters if provided
            if state_code:
                stmt = stmt.where(TaxRate.state_code == state_code)
            if postcode:
                stmt = stmt.where(TaxRate.postcode == postcode)
            if city:
                stmt = stmt.where(TaxRate.city == city)
            
            # Order by priority and order
            stmt = stmt.order_by(TaxRate.priority.desc(), TaxRate.order.asc())
            
            result = await db.execute(stmt)
            tax_rate = result.scalar_one_or_none()
            
            if tax_rate:
                return tax_rate.rate
        
        # If no specific tax class or rate found, use standard rate for the country
        # For UK, this would be the standard VAT rate
        stmt = select(TaxRate).where(
            TaxRate.tax_class_id.is_(None),  # Standard rate (no specific tax class)
            TaxRate.country_code == country_code,
            TaxRate.is_active == True
        )
        
        # Add location filters if provided
        if state_code:
            stmt = stmt.where(TaxRate.state_code == state_code)
        if postcode:
            stmt = stmt.where(TaxRate.postcode == postcode)
        if city:
            stmt = stmt.where(TaxRate.city == city)
        
        stmt = stmt.order_by(TaxRate.priority.desc(), TaxRate.order.asc())
        
        result = await db.execute(stmt)
        tax_rate = result.scalar_one_or_none()
        
        if tax_rate:
            return tax_rate.rate
        
        # Fallback to default UK VAT rate if no rate found
        if country_code == "GB":
            return TaxCalculator.DEFAULT_STANDARD_VAT_RATE
        
        # Return 0 if no rate found for other countries
        return Decimal("0.0000")
    
    @staticmethod
    async def calculate_line_item_tax(
        db: AsyncSession,
        product: Product,
        quantity: int,
        price_per_unit: Decimal,
        country_code: str = DEFAULT_COUNTRY_CODE,
        state_code: Optional[str] = None,
        postcode: Optional[str] = None,
        city: Optional[str] = None
    ) -> dict:
        """
        Calculate tax for a line item (product quantity)
        
        Args:
            db: Database session
            product: Product instance
            quantity: Quantity of product
            price_per_unit: Price per unit (before tax)
            country_code: Customer's country code
            state_code: Customer's state/province code (optional)
            postcode: Customer's postcode (optional)
            city: Customer's city (optional)
        
        Returns:
            Dictionary with:
            - tax_rate: Tax rate applied (Decimal)
            - tax_amount: Total tax amount for this line item (Decimal)
            - line_subtotal: Subtotal before tax (quantity * price_per_unit)
            - line_total: Total including tax (line_subtotal + tax_amount)
        """
        # Get tax rate for product
        tax_rate = await TaxCalculator.get_tax_rate_for_product(
            db, product, country_code, state_code, postcode, city
        )
        
        # Calculate line subtotal (before tax)
        line_subtotal = Decimal(quantity) * Decimal(price_per_unit)
        
        # Calculate tax amount
        tax_amount = line_subtotal * tax_rate
        
        # Calculate line total (including tax)
        line_total = line_subtotal + tax_amount
        
        return {
            "tax_rate": tax_rate,
            "tax_amount": tax_amount,
            "line_subtotal": line_subtotal,
            "line_total": line_total
        }
    
    @staticmethod
    async def calculate_shipping_tax(
        db: AsyncSession,
        shipping_cost: Decimal,
        country_code: str = DEFAULT_COUNTRY_CODE,
        state_code: Optional[str] = None,
        postcode: Optional[str] = None,
        city: Optional[str] = None,
        shipping_taxable: bool = True
    ) -> dict:
        """
        Calculate tax on shipping
        
        Args:
            db: Database session
            shipping_cost: Shipping cost (before tax)
            country_code: Customer's country code
            state_code: Customer's state/province code (optional)
            postcode: Customer's postcode (optional)
            city: Customer's city (optional)
            shipping_taxable: Whether shipping is taxable
        
        Returns:
            Dictionary with:
            - tax_rate: Tax rate applied (Decimal)
            - tax_amount: Tax amount on shipping (Decimal)
            - shipping_total: Shipping cost including tax (Decimal)
        """
        if not shipping_taxable or shipping_cost == 0:
            return {
                "tax_rate": Decimal("0.0000"),
                "tax_amount": Decimal("0.00"),
                "shipping_total": shipping_cost
            }
        
        # Get standard tax rate for shipping (usually same as standard product rate)
        stmt = select(TaxRate).where(
            TaxRate.tax_class_id.is_(None),  # Standard rate
            TaxRate.country_code == country_code,
            TaxRate.shipping == True,  # Rate applies to shipping
            TaxRate.is_active == True
        )
        
        # Add location filters if provided
        if state_code:
            stmt = stmt.where(TaxRate.state_code == state_code)
        if postcode:
            stmt = stmt.where(TaxRate.postcode == postcode)
        if city:
            stmt = stmt.where(TaxRate.city == city)
        
        stmt = stmt.order_by(TaxRate.priority.desc(), TaxRate.order.asc())
        
        result = await db.execute(stmt)
        tax_rate_obj = result.scalar_one_or_none()
        
        if tax_rate_obj:
            tax_rate = tax_rate_obj.rate
        elif country_code == "GB":
            # Fallback to UK standard VAT rate
            tax_rate = TaxCalculator.DEFAULT_STANDARD_VAT_RATE
        else:
            tax_rate = Decimal("0.0000")
        
        # Calculate shipping tax
        shipping_tax = shipping_cost * tax_rate
        shipping_total = shipping_cost + shipping_tax
        
        return {
            "tax_rate": tax_rate,
            "tax_amount": shipping_tax,
            "shipping_total": shipping_total
        }

