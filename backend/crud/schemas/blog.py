from pydantic import BaseModel, Field, model_validator
from typing import Optional
from datetime import datetime


def _normalize_blog_values(values: dict) -> dict:
    if not values:
        return values

    values = dict(values)

    optional_string_fields = [
        "slug",
        "excerpt",
        "featured_image",
        "author_name",
        "meta_title",
        "meta_description",
        "meta_keywords",
    ]
    for field in optional_string_fields:
        if field in values and isinstance(values[field], str) and values[field].strip() == "":
            values[field] = None

    return values


class BlogBase(BaseModel):
    title: str = Field(..., max_length=500, min_length=3)
    slug: Optional[str] = Field(None, max_length=500)
    excerpt: Optional[str] = None
    content: str = Field(..., min_length=10)
    featured_image: Optional[str] = Field(None, max_length=500)
    author_id: Optional[int] = None
    author_name: Optional[str] = Field(None, max_length=200)
    status: str = Field(default="draft", pattern="^(draft|published|archived)$")
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=500)
    published_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_blank_values(cls, values: dict):
        return _normalize_blog_values(values)


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500, min_length=3)
    slug: Optional[str] = Field(None, max_length=500)
    excerpt: Optional[str] = None
    content: Optional[str] = Field(None, min_length=10)
    featured_image: Optional[str] = Field(None, max_length=500)
    author_id: Optional[int] = None
    author_name: Optional[str] = Field(None, max_length=200)
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=500)
    published_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_blank_values(cls, values: dict):
        return _normalize_blog_values(values)


class Blog(BlogBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

