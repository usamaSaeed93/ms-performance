"""
Request Middleware
==================
This module contains the request middleware for the API. The request middleware
basically checks form_data, body, query_params and converts them to a dictionary
"""

import json
from fastapi import Request


async def process_dict_val_as_json(inp: dict) -> dict:
    for k, v in inp.items():
        if isinstance(v, str):
            try:
                inp[k] = json.loads(v)
            except:
                inp[k] = v


class RequestPreProcessor(object):
    async def __call__(self, request: Request, call_next) -> dict:
        """
        The order of precedence is:
        1. body (json)
        2. form_data
        3. query_params
        
        IMPORTANT: For multipart/form-data (file uploads), we MUST NOT read the body
        or form_data here, as it will consume the stream and prevent FastAPI from
        parsing UploadFile parameters.
        """
        return_dict = {}

        # Process query_params (safe - doesn't consume body)
        if request.query_params:
            try:
                data = dict(request.query_params)
                await process_dict_val_as_json(data)
                return_dict.update(data)
            except:
                pass

        # Check content type - SKIP body reading for multipart/form-data (file uploads)
        content_type = request.headers.get("content-type", "")
        is_multipart = "multipart/form-data" in content_type
        
        if not is_multipart:
            # Process body (only for non-multipart requests like JSON)
            try:
                body = await request.body()
                if body:
                    try:
                        return_dict.update(json.loads(body))
                    except:
                        pass
            except:
                pass

        # Process form_data (only for non-multipart - multipart is handled by FastAPI)
        if not is_multipart:
            try:
                form = await request.form()
                if form:
                    try:
                        data = dict(form)
                        await process_dict_val_as_json(data)
                        return_dict.update(data)
                    except:
                        pass
            except:
                pass

        request.state.data = return_dict

        response = await call_next(request)
        return response
