PULL_DATABASE="${DATABASE}"

echo "Dropping local database: $PULL_DATABASE"
dropdb --host=localhost --username=$DB_USERNAME $PULL_DATABASE

# This command uses DB_USERNAME/DB_PASSWORD from the environment. Do NOT hardcode credentials here.
# Ensure these variables are set in your shell or CI environment before running this script.
PGUSER=$DB_USERNAME PGPASSWORD=$DB_PASSWORD heroku pg:pull HEROKU_POSTGRESQL_GRAY_URL postgres://$DB_HOST/$PULL_DATABASE --app longlostapi