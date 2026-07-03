from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, TIMESTAMP, TEXT

from db.base_class import Base


class Client(Base):
    """
    Client Table
    Stores client showcase entries displayed in the Our Clients carousel on the homepage.
    """
    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(200), nullable=False)
    details = Column(String(500), nullable=True)       # short subtitle e.g. "444 bhp | ECU & TCU remap"
    description = Column(TEXT, nullable=True)          # long description shown on the detail page
    registration = Column(String(20), nullable=True)   # VRM plate used to pull performance data
    image_url = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
