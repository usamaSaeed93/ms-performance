from fastapi import status

import crud
from api.base_resource import PostResource
from crud.schemas import User, UserCreate


class Signup(PostResource):
    """
    Public signup endpoint for new users
    Creates a user with 'customer' role by default
    """
    request_schema = UserCreate
    response_schema = User
    authentication_required = False

    api_name = "signup"
    api_url = "signup"

    async def check_user_exists(self):
        existing_user = await crud.user.get_by_email(self.db, email=self.request_data.email)
        if existing_user:
            self.early_response = True
            self.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            self.response_message = "User with this email already exists"
            self.response_data = {}

    async def create_user(self):
        # Create user - role defaults to "customer" in the User model
        created_user = await crud.user.create(self.db, obj_in=self.request_data)
        
        # Ensure role is set to customer (in case it wasn't set)
        async with self.db as session:
            if not created_user.role or created_user.role != "customer":
                created_user.role = "customer"
                session.add(created_user)
                await session.commit()
                await session.refresh(created_user)
        
        self.response_data = created_user.to_dict()
        self.status_code = status.HTTP_201_CREATED
        self.response_message = "User registered successfully"

    async def process_flow(self):
        await self.check_user_exists()
        if self.early_response:
            return
        await self.create_user()

