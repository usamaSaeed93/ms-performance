from datetime import datetime
from typing import Any, Dict, Optional, Union

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from core.security import get_password_hash
from crud.base import CRUDBase
from models.user import User
from crud.schemas import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """Get a user by email.

        Args:
            db (AsyncSession): SQLAlchemy session
            email (str): The email

        Returns:
            Optional[User]: The user object or None
        """

        stmt = select(self.model).filter(self.model.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        """Create a new user.

        Args:
            db (AsyncSession): SQLAlchemy session
            obj_in (UserCreate): The user object

        Returns:
            User: The created user object
        """

        # Create the user, and hash the password
        obj_in = jsonable_encoder(obj_in)
        obj_in["hashed_password"] = get_password_hash(obj_in.pop("password"))
        # Commit the user to the database
        return await super().create(db, obj_in=obj_in)

    async def update(
        self, db: AsyncSession, *, db_obj: User, obj_in: UserUpdate
    ) -> User:
        """Update a user.

        Args:
            db (AsyncSession): SQLAlchemy session
            db_obj (User): The user object
            obj_in UserUpdate: The user object with the new values

        Returns:
            User: The updated user object
        """

        # Check user object type
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        # If the password is set, hash it
        if update_data.new_password:
            hashed_password = get_password_hash(update_data.new_password)
            update_data.hashed_password = hashed_password

        return super().update(db, db_obj=db_obj, obj_in=update_data)

    async def touch_last_login(self, db: AsyncSession, *, db_obj: User) -> User:
        """Update the last login time of a user.

        Args:
            db (AsyncSession): SQLAlchemy session
            db_obj (User): The user object

        Returns:
            User: The updated user object
        """

        db_obj.last_login = datetime.utcnow()
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def set_email_confirmation_token(
        self, db: AsyncSession, *, db_obj: User, token: str
    ) -> User:
        """Set email confirmation token for a user.

        Args:
            db (AsyncSession): SQLAlchemy session
            db_obj (User): The user object
            token (str): The confirmation token

        Returns:
            User: The updated user object
        """
        from datetime import datetime
        db_obj.email_confirmation_token = token
        db_obj.email_confirmation_sent_at = datetime.utcnow()
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def confirm_email(self, db: AsyncSession, *, db_obj: User) -> User:
        """Confirm a user's email address.

        Args:
            db (AsyncSession): SQLAlchemy session
            db_obj (User): The user object

        Returns:
            User: The updated user object
        """
        db_obj.email_confirmed = True
        db_obj.email_confirmation_token = None
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_by_confirmation_token(
        self, db: AsyncSession, *, token: str
    ) -> Optional[User]:
        """Get a user by email confirmation token.

        Args:
            db (AsyncSession): SQLAlchemy session
            token (str): The confirmation token

        Returns:
            Optional[User]: The user object or None
        """
        stmt = select(self.model).filter(self.model.email_confirmation_token == token)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


user = CRUDUser(User)
