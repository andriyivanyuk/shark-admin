# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables
ENV POSTGRES_DB=users
ENV POSTGRES_USER=andrii
ENV POSTGRES_PASSWORD=root

# Expose the PostgreSQL port
EXPOSE 5432

# Set the default command for the container, which is to run PostgreSQL
CMD ["postgres"]
