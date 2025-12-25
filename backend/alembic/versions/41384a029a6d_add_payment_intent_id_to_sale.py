"""add_payment_intent_id_to_sale

Revision ID: 41384a029a6d
Revises: email_confirmation_001
Create Date: 2025-12-07 02:43:32.684563

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '41384a029a6d'
down_revision: Union[str, None] = 'email_confirmation_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add payment_intent_id column to sale table
    # Check if column already exists to avoid errors
    from sqlalchemy import inspect
    conn = op.get_bind()
    inspector = inspect(conn)
    sale_columns = [col['name'] for col in inspector.get_columns('sale')]
    
    if 'payment_intent_id' not in sale_columns:
        op.add_column('sale', sa.Column('payment_intent_id', sa.String(length=255), nullable=True))
        
        # Create unique index on payment_intent_id
        op.create_index(op.f('ix_sale_payment_intent_id'), 'sale', ['payment_intent_id'], unique=True)


def downgrade() -> None:
    # Drop index and column
    from sqlalchemy import inspect
    conn = op.get_bind()
    inspector = inspect(conn)
    sale_columns = [col['name'] for col in inspector.get_columns('sale')]
    indexes = [idx['name'] for idx in inspector.get_indexes('sale')]
    
    if 'ix_sale_payment_intent_id' in indexes:
        op.drop_index(op.f('ix_sale_payment_intent_id'), table_name='sale')
    
    if 'payment_intent_id' in sale_columns:
        op.drop_column('sale', 'payment_intent_id')
