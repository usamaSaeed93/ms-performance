"""add page_content to service

Revision ID: c2d3e4f5a6b7
Revises: b1c2d3e4f5a6
Create Date: 2026-07-22

"""
from alembic import op
import sqlalchemy as sa

revision = "c2d3e4f5a6b7"
down_revision = "b1c2d3e4f5a6"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("service", sa.Column("page_content", sa.JSON(), nullable=True))


def downgrade():
    op.drop_column("service", "page_content")
