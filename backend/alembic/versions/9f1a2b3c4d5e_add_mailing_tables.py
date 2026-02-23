"""add mailing subscription and job tables

Revision ID: 9f1a2b3c4d5e
Revises: c87ae59e0cfb
Create Date: 2026-02-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f1a2b3c4d5e'
down_revision: Union[str, None] = 'c87ae59e0cfb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'mailing_subscription',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    with op.batch_alter_table('mailing_subscription', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_mailing_subscription_email'), ['email'], unique=True)
        batch_op.create_index(batch_op.f('ix_mailing_subscription_id'), ['id'], unique=False)

    op.create_table(
        'mailing_job',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('subject', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('total_recipients', sa.Integer(), nullable=False),
        sa.Column('sent_count', sa.Integer(), nullable=False),
        sa.Column('failed_count', sa.Integer(), nullable=False),
        sa.Column('last_error', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('mailing_job', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_mailing_job_id'), ['id'], unique=False)
        batch_op.create_index(batch_op.f('ix_mailing_job_status'), ['status'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('mailing_job', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_mailing_job_status'))
        batch_op.drop_index(batch_op.f('ix_mailing_job_id'))

    op.drop_table('mailing_job')

    with op.batch_alter_table('mailing_subscription', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_mailing_subscription_id'))
        batch_op.drop_index(batch_op.f('ix_mailing_subscription_email'))

    op.drop_table('mailing_subscription')
