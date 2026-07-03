"""add registration and description to client

Revision ID: b1c2d3e4f5a6
Revises: a4b5c6d7e8f9
Create Date: 2026-07-03

"""
from alembic import op
import sqlalchemy as sa

revision = 'b1c2d3e4f5a6'
down_revision = 'a4b5c6d7e8f9'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('client', sa.Column('description', sa.TEXT(), nullable=True))
    op.add_column('client', sa.Column('registration', sa.String(20), nullable=True))


def downgrade():
    op.drop_column('client', 'registration')
    op.drop_column('client', 'description')
