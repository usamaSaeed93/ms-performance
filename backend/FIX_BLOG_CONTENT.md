# Fix Blog Content Column - Instructions

The blog `content` column needs to be changed from `TEXT` to `LONGTEXT` to support large blog content.

## Option 1: Run SQL Directly (Quickest)

Connect to your MySQL database and run:

```sql
ALTER TABLE blog MODIFY COLUMN content LONGTEXT NOT NULL;
```

## Option 2: Run the Migration Script

If you have Poetry installed:
```bash
cd backend
poetry run python fix_blog_content_column.py
```

Or if you have the virtual environment activated:
```bash
cd backend
python fix_blog_content_column.py
```

## Option 3: Run Alembic Migration

If you have Poetry:
```bash
cd backend
poetry run alembic upgrade head
```

Or with virtual environment:
```bash
cd backend
alembic upgrade head
```

## Verification

After running any of the above, verify the change:
```sql
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'blog' 
AND COLUMN_NAME = 'content';
```

You should see `longtext` as the column type.


