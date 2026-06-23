set -a
source .env
set -e

docker exec -i cp476-postgres-1 psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT * FROM transaction_categories;"
Sleep 1000