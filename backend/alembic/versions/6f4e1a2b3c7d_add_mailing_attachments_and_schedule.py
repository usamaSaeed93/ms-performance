"""add mailing attachments and schedule

Revision ID: 6f4e1a2b3c7d
Revises: 9f1a2b3c4d5e
Create Date: 2026-02-23 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6f4e1a2b3c7d'
down_revision: Union[str, None] = '9f1a2b3c4d5e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('mailing_job', schema=None) as batch_op:
        batch_op.add_column(sa.Column('scheduled_at', sa.DateTime(), nullable=True))

    op.create_table(
        'mailing_attachment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('object_name', sa.String(length=500), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('content_type', sa.String(length=100), nullable=False),
        sa.Column('size', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['job_id'], ['mailing_job.id']),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('mailing_attachment', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_mailing_attachment_id'), ['id'], unique=False)
        batch_op.create_index(batch_op.f('ix_mailing_attachment_job_id'), ['job_id'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('mailing_attachment', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_mailing_attachment_job_id'))
        batch_op.drop_index(batch_op.f('ix_mailing_attachment_id'))

    op.drop_table('mailing_attachment')

    with op.batch_alter_table('mailing_job', schema=None) as batch_op:
        batch_op.drop_column('scheduled_at')
