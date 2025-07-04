FROM postgres:15

# Set environment variables
ENV POSTGRES_DB=geneinsight
ENV POSTGRES_USER=geneinsight_user
ENV POSTGRES_PASSWORD=geneinsight_password

# Copy initialization scripts if any
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
