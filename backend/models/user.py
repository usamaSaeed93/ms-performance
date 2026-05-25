from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean

from db.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False, index=True)
    last_name = Column(String(50), nullable=False, index=True)
    email = Column(String(50), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Integer, nullable=False, default=1)
    role = Column(String(20), nullable=False, default="customer", index=True)  # customer, admin
    timezone = Column(String(50), nullable=True)
    last_login = Column(TIMESTAMP, nullable=True)
    email_confirmed = Column(Boolean, nullable=False, default=False, index=True)
    email_confirmation_token = Column(String(255), nullable=True, unique=True, index=True)
    email_confirmation_sent_at = Column(TIMESTAMP, nullable=True)
    password_reset_token = Column(String(255), nullable=True, unique=True, index=True)
    password_reset_sent_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
