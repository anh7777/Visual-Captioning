"""update tables

Revision ID: f2e66ee575db
Revises: eb710dc7ba80
Create Date: 2025-03-20 06:16:42.774100

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2e66ee575db'
down_revision: Union[str, None] = 'eb710dc7ba80'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
