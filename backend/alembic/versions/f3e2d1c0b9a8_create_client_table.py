"""create_client_table

Revision ID: f3e2d1c0b9a8
Revises: b7c9d4e5f6a8
Create Date: 2026-07-02 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f3e2d1c0b9a8'
down_revision: Union[str, None] = 'b7c9d4e5f6a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'client',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('details', sa.String(length=500), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    with op.batch_alter_table('client', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_client_id'), ['id'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('client', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_client_id'))
    op.drop_table('client')
