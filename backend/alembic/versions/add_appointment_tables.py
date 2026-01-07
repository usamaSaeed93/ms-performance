"""Add appointment and shop_hours tables

Revision ID: add_appointment_tables
Revises: f7bb11c22fa4
Create Date: 2026-01-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_appointment_tables'
down_revision: Union[str, None] = 'f7bb11c22fa4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create shop_hours table
    op.create_table(
        'shop_hours',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('day_of_week', sa.Integer(), nullable=False, comment='0=Monday, 6=Sunday'),
        sa.Column('is_open', sa.Boolean(), nullable=True, server_default='1'),
        sa.Column('open_time', sa.Time(), nullable=True),
        sa.Column('close_time', sa.Time(), nullable=True),
        sa.Column('slot_duration_minutes', sa.Integer(), nullable=True, server_default='30'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_shop_hours_id'), 'shop_hours', ['id'], unique=False)
    op.create_index(op.f('ix_shop_hours_day_of_week'), 'shop_hours', ['day_of_week'], unique=False)
    
    # Create appointments table
    op.create_table(
        'appointments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('appointment_date', sa.Date(), nullable=False),
        sa.Column('appointment_time', sa.Time(), nullable=False),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('customer_email', sa.String(255), nullable=False),
        sa.Column('customer_phone', sa.String(50), nullable=False),
        sa.Column('vehicle_make', sa.String(100), nullable=True),
        sa.Column('vehicle_model', sa.String(100), nullable=True),
        sa.Column('vehicle_registration', sa.String(20), nullable=True),
        sa.Column('service_type', sa.String(100), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(50), nullable=True, server_default='confirmed'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_appointments_id'), 'appointments', ['id'], unique=False)
    op.create_index(op.f('ix_appointments_appointment_date'), 'appointments', ['appointment_date'], unique=False)
    op.create_index(op.f('ix_appointments_status'), 'appointments', ['status'], unique=False)
    
    # Insert default shop hours (Mon-Fri 9-5, closed weekends)
    op.execute("""
        INSERT INTO shop_hours (day_of_week, is_open, open_time, close_time, slot_duration_minutes, created_at, updated_at)
        VALUES 
        (0, 1, '09:00:00', '17:00:00', 30, NOW(), NOW()),
        (1, 1, '09:00:00', '17:00:00', 30, NOW(), NOW()),
        (2, 1, '09:00:00', '17:00:00', 30, NOW(), NOW()),
        (3, 1, '09:00:00', '17:00:00', 30, NOW(), NOW()),
        (4, 1, '09:00:00', '17:00:00', 30, NOW(), NOW()),
        (5, 0, NULL, NULL, 30, NOW(), NOW()),
        (6, 0, NULL, NULL, 30, NOW(), NOW())
    """)


def downgrade() -> None:
    op.drop_index(op.f('ix_appointments_status'), table_name='appointments')
    op.drop_index(op.f('ix_appointments_appointment_date'), table_name='appointments')
    op.drop_index(op.f('ix_appointments_id'), table_name='appointments')
    op.drop_table('appointments')
    
    op.drop_index(op.f('ix_shop_hours_day_of_week'), table_name='shop_hours')
    op.drop_index(op.f('ix_shop_hours_id'), table_name='shop_hours')
    op.drop_table('shop_hours')
