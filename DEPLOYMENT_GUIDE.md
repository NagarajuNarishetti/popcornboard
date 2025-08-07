# PopcornBoard Deployment Guide

This guide will help you deploy PopcornBoard with Keycloak authentication using Docker containers.

## Prerequisites

- Docker and Docker Compose installed
- Git installed
- A movie API key (OMDb or TMDb)

## Step 1: Get Movie API Key

1. **For OMDb API (Recommended for simplicity):**
   - Go to http://www.omdbapi.com/
   - Request a free API key
   - You'll receive it via email

2. **For TMDb API:**
   - Go to https://www.themoviedb.org/settings/api
   - Create an account and request an API key

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```bash
   # Update these values
   MOVIE_API_KEY=your_actual_api_key_here
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   ```

## Step 3: Build and Deploy

1. **Build the Docker images:**
   ```bash
   docker-compose build
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Check if all services are running:**
   ```bash
   docker-compose ps
   ```

## Step 4: Configure Keycloak

### Option A: Automatic Setup (Recommended)

1. **Wait for Keycloak to be ready** (about 2-3 minutes):
   ```bash
   docker-compose logs keycloak
   ```

2. **Run the Keycloak setup script:**
   ```bash
   docker exec popcornboard-keycloak /opt/keycloak/bin/kc.sh import --file=/opt/keycloak/data/import/realm-export.json
   ```

3. **Get the client secret:**
   ```bash
   docker exec popcornboard-keycloak /opt/keycloak/bin/kc.sh get-client-secret --client-id=nextjs-client
   ```

4. **Update docker-compose.yml with the client secret:**
   - Replace `your-keycloak-client-secret` with the actual secret

### Option B: Manual Setup

1. **Access Keycloak Admin Console:**
   - Open http://localhost:8080
   - Login with admin/admin

2. **Create a new realm:**
   - Click "Create Realm"
   - Name: `myrealm`
   - Click "Create"

3. **Create a client:**
   - Go to "Clients" → "Create"
   - Client ID: `nextjs-client`
   - Client Protocol: `openid-connect`
   - Click "Save"

4. **Configure the client:**
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web Origins: `http://localhost:3000`
   - Click "Save"

5. **Get the client secret:**
   - Go to "Credentials" tab
   - Copy the secret
   - Update `docker-compose.yml`

6. **Create users:**
   - Go to "Users" → "Add User"
   - Create test users with passwords

## Step 5: Test the Application

1. **Access the application:**
   - Open http://localhost:3000

2. **Test authentication:**
   - Click "Login / Sign Up"
   - Use Keycloak to authenticate
   - Try adding and deleting movies

3. **Test users:**
   - user1@example.com / password123
   - user2@example.com / password123

## Step 6: Production Deployment

### Security Considerations

1. **Change default passwords:**
   - Keycloak admin password
   - Database passwords
   - NextAuth secret

2. **Use HTTPS:**
   - Set up SSL certificates
   - Update redirect URIs to use HTTPS

3. **Environment variables:**
   ```bash
   # Production environment variables
   NODE_ENV=production
   NEXTAUTH_URL=https://yourdomain.com
   KEYCLOAK_ISSUER=https://keycloak.yourdomain.com/realms/myrealm
   ```

### Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=https://yourdomain.com
      - NEXTAUTH_SECRET=your-production-secret
      - KEYCLOAK_CLIENT_ID=nextjs-client
      - KEYCLOAK_CLIENT_SECRET=your-production-client-secret
      - KEYCLOAK_ISSUER=https://keycloak.yourdomain.com/realms/myrealm
      - MONGODB_URI=mongodb://mongo:27017/popcornboard
      - MOVIE_API_KEY=your_api_key
    depends_on:
      - mongo
      - keycloak
    restart: unless-stopped

  # ... other services
```

## Troubleshooting

### Common Issues

1. **Keycloak not accessible:**
   ```bash
   docker-compose logs keycloak
   # Check if Keycloak is fully started
   ```

2. **Database connection issues:**
   ```bash
   docker-compose logs mongo
   docker-compose logs app
   ```

3. **Authentication not working:**
   - Check client secret in docker-compose.yml
   - Verify redirect URIs in Keycloak
   - Check browser console for errors

4. **Movie API not working:**
   - Verify MOVIE_API_KEY is set correctly
   - Check API quota/limits

### Useful Commands

```bash
# View logs
docker-compose logs -f app
docker-compose logs -f keycloak
docker-compose logs -f mongo

# Restart services
docker-compose restart app
docker-compose restart keycloak

# Access containers
docker exec -it popcornboard-app sh
docker exec -it popcornboard-keycloak /bin/bash

# Clean up
docker-compose down -v
docker system prune -a
```

## Monitoring

1. **Application logs:**
   ```bash
   docker-compose logs -f app
   ```

2. **Database monitoring:**
   ```bash
   docker exec -it popcornboard-mongo mongosh popcornboard
   ```

3. **Keycloak monitoring:**
   - Access http://localhost:8080/admin
   - View realm statistics

## Backup and Restore

### Backup
```bash
# Backup MongoDB
docker exec popcornboard-mongo mongodump --db popcornboard --out /backup

# Backup Keycloak
docker exec popcornboard-keycloak /opt/keycloak/bin/kc.sh export --dir=/opt/keycloak/data/backup
```

### Restore
```bash
# Restore MongoDB
docker exec popcornboard-mongo mongorestore --db popcornboard /backup/popcornboard

# Restore Keycloak
docker exec popcornboard-keycloak /opt/keycloak/bin/kc.sh import --dir=/opt/keycloak/data/backup
```

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all services are running: `docker-compose ps`
4. Check network connectivity between containers 