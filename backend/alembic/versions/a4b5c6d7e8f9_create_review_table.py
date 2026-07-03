"""create review table

Revision ID: a4b5c6d7e8f9
Revises: f3e2d1c0b9a8
Create Date: 2026-07-03

"""
from alembic import op
import sqlalchemy as sa

revision = 'a4b5c6d7e8f9'
down_revision = 'f3e2d1c0b9a8'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'review',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_name', sa.String(200), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('text', sa.TEXT(), nullable=True),
        sa.Column('profile_photo_url', sa.String(500), nullable=True),
        sa.Column('relative_time', sa.String(100), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_review_id'), 'review', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_review_id'), table_name='review')
    op.drop_table('review')
