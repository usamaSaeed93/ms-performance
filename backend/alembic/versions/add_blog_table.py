"""add blog table

Revision ID: f9e8d7c6b5a4
Revises: a1b2c3d4e5f6
Create Date: 2025-01-15 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9e8d7c6b5a4'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'blog',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('slug', sa.String(length=500), nullable=True),
        sa.Column('excerpt', sa.TEXT(), nullable=True),
        sa.Column('content', sa.TEXT(), nullable=False),
        sa.Column('featured_image', sa.String(length=500), nullable=True),
        sa.Column('author_id', sa.Integer(), nullable=True),
        sa.Column('author_name', sa.String(length=200), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='draft'),
        sa.Column('meta_title', sa.String(length=255), nullable=True),
        sa.Column('meta_description', sa.TEXT(), nullable=True),
        sa.Column('meta_keywords', sa.String(length=500), nullable=True),
        sa.Column('published_at', sa.TIMESTAMP(), nullable=True),
        sa.Column('view_count', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['author_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blog_id'), 'blog', ['id'], unique=False)
    op.create_index(op.f('ix_blog_slug'), 'blog', ['slug'], unique=True)
    op.create_index(op.f('ix_blog_title'), 'blog', ['title'], unique=False)
    op.create_index(op.f('ix_blog_author_id'), 'blog', ['author_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_blog_author_id'), table_name='blog')
    op.drop_index(op.f('ix_blog_title'), table_name='blog')
    op.drop_index(op.f('ix_blog_slug'), table_name='blog')
    op.drop_index(op.f('ix_blog_id'), table_name='blog')
    op.drop_table('blog')

