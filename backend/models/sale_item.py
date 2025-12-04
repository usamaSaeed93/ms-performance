from sqlalchemy import ForeignKey, Column, Integer, DECIMAL

from db.base_class import Base


class SaleItem(Base):
    """
    Sale Item Table
    """

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sale.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(DECIMAL(10, 2), nullable=False)  # Price per unit (before tax)
    tax_rate = Column(DECIMAL(5, 4), nullable=True)  # Tax rate applied (e.g., 0.2000 for 20%)
    tax_amount = Column(DECIMAL(10, 2), nullable=False, default=0)  # Tax amount for this line item
    line_total = Column(DECIMAL(10, 2), nullable=False)  # Total for this line (quantity * price_per_unit + tax_amount)
