"""add_email_confirmation_fields

Revision ID: email_confirmation_001
Revises: e7f8g9h0i1j2
Create Date: 2025-01-XX XX:XX:XX.XXXXXX

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'email_confirmation_001'
down_revision: Union[str, None] = 'e7f8g9h0i1j2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add email_confirmed column
    op.add_column('user', sa.Column('email_confirmed', sa.Boolean(), nullable=False, server_default='0'))
    
    # Add email_confirmation_token column
    op.add_column('user', sa.Column('email_confirmation_token', sa.String(length=255), nullable=True))
    
    # Add email_confirmation_sent_at column
    op.add_column('user', sa.Column('email_confirmation_sent_at', sa.TIMESTAMP(), nullable=True))
    
    # Create index on email_confirmed
    op.create_index(op.f('ix_user_email_confirmed'), 'user', ['email_confirmed'], unique=False)
    
    # Create unique index on email_confirmation_token
    op.create_index(op.f('ix_user_email_confirmation_token'), 'user', ['email_confirmation_token'], unique=True)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_user_email_confirmation_token'), table_name='user')
    op.drop_index(op.f('ix_user_email_confirmed'), table_name='user')
    
    # Drop columns
    op.drop_column('user', 'email_confirmation_sent_at')
    op.drop_column('user', 'email_confirmation_token')
    op.drop_column('user', 'email_confirmed')

