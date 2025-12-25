"""add_webhook_event_and_task_tables

Revision ID: 78130ca33269
Revises: 41384a029a6d
Create Date: 2025-12-07 18:08:50.835231

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '78130ca33269'
down_revision: Union[str, None] = '41384a029a6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create webhook_event table
    op.create_table(
        'webhook_event',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_id', sa.String(length=255), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('payment_intent_id', sa.String(length=255), nullable=True),
        sa.Column('processed', sa.Boolean(), nullable=False),
        sa.Column('processed_at', sa.TIMESTAMP(), nullable=True),
        sa.Column('error_message', sa.TEXT(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_webhook_event_id'), 'webhook_event', ['id'], unique=False)
    op.create_index(op.f('ix_webhook_event_event_id'), 'webhook_event', ['event_id'], unique=True)
    op.create_index(op.f('ix_webhook_event_event_type'), 'webhook_event', ['event_type'], unique=False)
    op.create_index(op.f('ix_webhook_event_payment_intent_id'), 'webhook_event', ['payment_intent_id'], unique=False)
    op.create_index(op.f('ix_webhook_event_processed'), 'webhook_event', ['processed'], unique=False)
    op.create_index(op.f('ix_webhook_event_created_at'), 'webhook_event', ['created_at'], unique=False)
    
    # Create webhook_task table
    op.create_table(
        'webhook_task',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_id', sa.String(length=255), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('event_data', sa.JSON(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('retry_count', sa.Integer(), nullable=False),
        sa.Column('max_retries', sa.Integer(), nullable=False),
        sa.Column('error_message', sa.TEXT(), nullable=True),
        sa.Column('next_retry_at', sa.TIMESTAMP(), nullable=True),
        sa.Column('completed_at', sa.TIMESTAMP(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_webhook_task_id'), 'webhook_task', ['id'], unique=False)
    op.create_index(op.f('ix_webhook_task_event_id'), 'webhook_task', ['event_id'], unique=False)
    op.create_index(op.f('ix_webhook_task_event_type'), 'webhook_task', ['event_type'], unique=False)
    op.create_index(op.f('ix_webhook_task_status'), 'webhook_task', ['status'], unique=False)
    op.create_index(op.f('ix_webhook_task_next_retry_at'), 'webhook_task', ['next_retry_at'], unique=False)
    op.create_index(op.f('ix_webhook_task_created_at'), 'webhook_task', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_webhook_task_created_at'), table_name='webhook_task')
    op.drop_index(op.f('ix_webhook_task_next_retry_at'), table_name='webhook_task')
    op.drop_index(op.f('ix_webhook_task_status'), table_name='webhook_task')
    op.drop_index(op.f('ix_webhook_task_event_type'), table_name='webhook_task')
    op.drop_index(op.f('ix_webhook_task_event_id'), table_name='webhook_task')
    op.drop_index(op.f('ix_webhook_task_id'), table_name='webhook_task')
    op.drop_table('webhook_task')
    
    op.drop_index(op.f('ix_webhook_event_created_at'), table_name='webhook_event')
    op.drop_index(op.f('ix_webhook_event_processed'), table_name='webhook_event')
    op.drop_index(op.f('ix_webhook_event_payment_intent_id'), table_name='webhook_event')
    op.drop_index(op.f('ix_webhook_event_event_type'), table_name='webhook_event')
    op.drop_index(op.f('ix_webhook_event_event_id'), table_name='webhook_event')
    op.drop_index(op.f('ix_webhook_event_id'), table_name='webhook_event')
    op.drop_table('webhook_event')
