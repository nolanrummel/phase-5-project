"""changed user

Revision ID: 3ba4ef38864f
Revises: ea7e52bf4a7e
Create Date: 2023-08-18 10:01:25.647425

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3ba4ef38864f'
down_revision = 'ea7e52bf4a7e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('_password_hash', sa.String(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('_password_hash')
        batch_op.drop_column('user_name')

    # ### end Alembic commands ###
