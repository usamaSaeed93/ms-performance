"""add password reset fields to user table

Revision ID: b7c9d4e5f6a8
Revises: 6f4e1a2b3c7d
Create Date: 2026-05-25
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c9d4e5f6a8'
down_revision: Union[str, None] = '6f4e1a2b3c7d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add password_reset_token column
    op.add_column('user', sa.Column('password_reset_token', sa.String(length=255), nullable=True))
    
    # Add password_reset_sent_at column
    op.add_column('user', sa.Column('password_reset_sent_at', sa.TIMESTAMP(), nullable=True))
    
    # Create unique index on password_reset_token
    op.create_index(op.f('ix_user_password_reset_token'), 'user', ['password_reset_token'], unique=True)


def downgrade() -> None:
    # Drop index
    op.drop_index(op.f('ix_user_password_reset_token'), table_name='user')
    
    # Drop columns
    op.drop_column('user', 'password_reset_sent_at')
    op.drop_column('user', 'password_reset_token')
