"""change blog content to longtext

Revision ID: e7f8g9h0i1j2
Revises: f9e8d7c6b5a4
Create Date: 2025-12-05 20:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


# revision identifiers, used by Alembic.
revision: str = 'e7f8g9h0i1j2'
down_revision: Union[str, None] = 'f9e8d7c6b5a4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Change content column from TEXT to LONGTEXT
    op.alter_column('blog', 'content',
                    existing_type=sa.TEXT(),
                    type_=mysql.LONGTEXT(),
                    existing_nullable=False)


def downgrade() -> None:
    # Revert content column from LONGTEXT back to TEXT
    op.alter_column('blog', 'content',
                    existing_type=mysql.LONGTEXT(),
                    type_=sa.TEXT(),
                    existing_nullable=False)


