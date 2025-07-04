FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=geneinsight
ENV MYSQL_USER=geneinsight_user
ENV MYSQL_PASSWORD=geneinsight_password

# Copy initialization scripts if any
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1
