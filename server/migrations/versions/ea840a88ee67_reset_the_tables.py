"""reset the tables

Revision ID: ea840a88ee67
Revises: d05ca1c06ff9
Create Date: 2023-08-29 12:59:49.370919

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ea840a88ee67'
down_revision = 'd05ca1c06ff9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('routes', schema=None) as batch_op:
        batch_op.drop_column('waypoints')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('routes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('waypoints', sa.BLOB(), nullable=True))

    # ### end Alembic commands ###
