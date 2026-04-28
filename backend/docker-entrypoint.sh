#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

if [ -f "/app/base.sql" ]; then
  export PGPASSWORD="$POSTGRES_PASSWORD"
  has_data=$(psql -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc 'SELECT 1 FROM "User" LIMIT 1;' || true)

  if [ "$has_data" = "1" ]; then
    echo "ℹ️  Database already has data, skipping base.sql import."
  else
    echo "📥 Importing base data from base.sql..."
    sed '/^SET transaction_timeout = /d' /app/base.sql | psql \
      -h postgres \
      -U "$POSTGRES_USER" \
      -d "$POSTGRES_DB" \
      -v ON_ERROR_STOP=1
    echo "✅ Base data imported."
  fi
else
  echo "ℹ️  No base.sql found, skipping import."
fi

echo "✅ Database initialization complete."

exec npm run start
