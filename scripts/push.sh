PUSH_DATABASE="${DATABASE}"

echo "Creating backup"
heroku pg:backups:capture HEROKU_POSTGRESQL_GRAY_URL --app longlostapi

# Exit if the backup fails
[ $? -eq 0 ] || exit 1

echo "Resetting remote database"
heroku pg:reset HEROKU_POSTGRESQL_GRAY_URL --app longlostapi

echo "Pushing local database to Heroku: $PUSH_DATABASE"

# This command relies on DB_USERNAME/DB_PASSWORD environment variables.
# Do not commit plaintext credentials — set these in your environment or CI secrets store.
PGUSER=$DB_USERNAME PGPASSWORD=$DB_PASSWORD heroku pg:push postgres://$DB_HOST/$PUSH_DATABASE HEROKU_POSTGRESQL_GRAY_URL --app longlostapi