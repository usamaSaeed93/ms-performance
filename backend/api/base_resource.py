from abc import abstractmethod
from typing import Any

from fastapi import Depends, Request, status
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi_restful import Resource
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from starlette_context import context

from core.logger import Logger
from db.dependency import get_db


class FinalResponse(BaseModel):
    status_code: int
    success: bool
    message: str
    data: Any = None


class BaseResource(Resource):
    # add more things here later on...

    request_schema = None
    response_schema = None
    response_data = None
    authentication_required = False

    @abstractmethod
    async def process_flow(self):
        raise NotImplementedError

    async def run_preprocess(self, request: Request):
        if self.request_schema:
            self.request_data = self.request_schema(**request.state.data)

    async def run_postprocess(self):
        # Close DB connection
        await self.db.close()

        if (
            self.response_schema
            and not self.dont_postprocess
            and not self.early_response
        ):
            if isinstance(self.response_data, list):
                self.response_data = [
                    self.response_schema(**data) for data in self.response_data
                ]
            else:
                self.response_data = self.response_schema(**self.response_data)

        self.response_data = FinalResponse(
            status_code=self.status_code,
            success=self.success,
            message=self.response_message,
            data=self.response_data,
        )

        # Log final response
        response = JSONResponse(
            content=jsonable_encoder(self.response_data),
            status_code=self.status_code,
        )
        self.logger.debug(f"Final response from {self.api_name}: Status {self.status_code}, Content length: {len(str(self.response_data))}")
        return response

    async def set_pre_request_vars(self):
        # Initialize Logger
        self.logger = Logger.get_logger(self.api_url, self.api_name)

    async def _base_req_params(self, request: Request, db: AsyncSession):
        self.dont_postprocess = False
        self.db = db
        self.request = request
        self.status_code = status.HTTP_200_OK
        self.success = True
        self.response_message = ""
        self.early_response = False

    async def _process_request(self, request: Request, db: AsyncSession):
        # Set pre request vars
        await self._base_req_params(request, db)
        await self.set_pre_request_vars()
        
        # Log endpoint entry
        self.logger.info(f"Entering endpoint: {self.api_name} ({request.method} {request.url.path})")
        
        try:
            # Check authentication data
            if self.authentication_required:
                user = context.data.get("user")
                if not user:
                    self.logger.warning(f"Authentication failed for {self.api_name}: No user found in context")
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Not authorized to access this resource",
                    )
                else:
                    self.logger.debug(f"Authentication successful for {self.api_name}: User ID {user.get('id') if isinstance(user, dict) else 'unknown'}")
            
            # Run preprocess
            await self.run_preprocess(request)
            
            # Log request data if available
            if hasattr(self, 'request_data') and self.request_data:
                import json
                try:
                    request_data_dict = self.request_data.dict() if hasattr(self.request_data, 'dict') else str(self.request_data)
                    self.logger.debug(f"Request data for {self.api_name}: {json.dumps(request_data_dict, indent=2, default=str)}")
                except Exception as e:
                    self.logger.debug(f"Request data for {self.api_name}: {str(self.request_data)} (could not serialize: {e})")
            
            # Run API specific process flow
            self.logger.debug(f"Executing process_flow for {self.api_name}")
            await self.process_flow()
            self.logger.debug(f"Process flow completed for {self.api_name}")
            
        # TODO: Add DB related exceptions too for rollback
        except HTTPException as e:
            await self.db.close()
            self.logger.warning(f"HTTPException in {self.api_name}: {e.status_code} - {e.detail}")
            raise e
        except Exception as e:
            await self.db.close()
            self.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            self.success = False
            
            # Log full exception with traceback
            import traceback
            self.logger.exception(f"Exception in {self.api_name}: {str(e)}")
            self.logger.error(f"Full traceback:\n{''.join(traceback.format_exc())}")

            # Get errors from Pydantic if applicable
            errors = getattr(e, "errors", None)
            if errors:
                errors = errors()
                errors = {e["loc"]: e["msg"] for e in errors}
            else:
                errors = {}
            self.response_message = "We're unable to process your request at this time."
            self.response_data = errors
            self.dont_postprocess = True

        # Log response before postprocess
        if not self.early_response:
            self.logger.info(f"Response from {self.api_name}: Status {self.status_code}, Success: {self.success}")
            if hasattr(self, 'response_data') and self.response_data:
                import json
                try:
                    response_data_dict = self.response_data if isinstance(self.response_data, dict) else str(self.response_data)
                    self.logger.debug(f"Response data from {self.api_name}: {json.dumps(response_data_dict, indent=2, default=str)}")
                except Exception as e:
                    self.logger.debug(f"Response data from {self.api_name}: {str(self.response_data)} (could not serialize: {e})")
        else:
            self.logger.warning(f"Early response from {self.api_name}: Status {self.status_code}")

        # Run postprocess
        return await self.run_postprocess()


class PostResource(BaseResource):
    async def post(self, request: Request, db: AsyncSession = Depends(get_db)):
        return await self._process_request(request=request, db=db)


class GetResource(BaseResource):
    async def get(self, request: Request, db: AsyncSession = Depends(get_db)):
        return await self._process_request(request=request, db=db)


class PutResource(BaseResource):
    async def put(self, request: Request, db: AsyncSession = Depends(get_db)):
        return await self._process_request(request=request, db=db)


class DeleteResource(BaseResource):
    async def delete(self, request: Request, db: AsyncSession = Depends(get_db)):
        return await self._process_request(request=request, db=db)
