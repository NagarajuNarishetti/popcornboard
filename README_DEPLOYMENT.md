# 🍿 PopcornBoard - Complete Deployment Guide

This repository contains a fully functional movie suggestion platform with Keycloak authentication, ready for Docker deployment.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Movie API key (OMDb or TMDb)

### One-Command Deployment
```bash
# 1. Get a movie API key from http://www.omdbapi.com/
# 2. Run the deployment script
./deploy.sh
```

## 📋 What's Included

### ✅ Authentication System
- **Keycloak Integration**: Full OIDC authentication
- **Development Fallback**: Credentials provider for local development
- **Session Management**: Robust session handling with NextAuth.js
- **User Management**: Pre-configured test users

### ✅ Application Features
- **Movie Suggestions**: Add, view, and delete movie recommendations
- **User Permissions**: Users can only manage their own suggestions
- **Movie API Integration**: Automatic movie data fetching
- **Responsive Design**: Modern UI with Tailwind CSS

### ✅ Infrastructure
- **Docker Containers**: All services containerized
- **MongoDB Database**: Persistent data storage
- **Keycloak Server**: Authentication and user management
- **PostgreSQL**: Keycloak database (optional)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │    Keycloak     │    │    MongoDB      │
│   (Port 3000)   │◄──►│   (Port 8080)   │    │   (Port 27017)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    Docker Network                          │
    └─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration Files

### Docker Configuration
- `Dockerfile`: Multi-stage build for production
- `docker-compose.yml`: Complete service orchestration
- `next.config.js`: Next.js with standalone output

### Keycloak Setup
- `keycloak-init/realm-export.json`: Pre-configured realm
- `keycloak-init/import-realm.sh`: Automatic realm import

### Database
- `mongo-init.js`: MongoDB initialization script

## 📁 File Structure

```
PopcornBoard/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   └── movies/              # Movie API endpoints
│   ├── auth/                     # Authentication pages
│   └── page.tsx                  # Main application
├── components/                    # React components
├── lib/                          # Database and utilities
├── keycloak-init/                # Keycloak configuration
├── docker-compose.yml            # Service orchestration
├── Dockerfile                    # Application container
├── deploy.sh                     # Quick deployment script
└── DEPLOYMENT_GUIDE.md          # Detailed deployment guide
```

## 🔐 Authentication Flow

1. **User clicks "Login"**
2. **Redirected to Keycloak** (or development form)
3. **User authenticates** with Keycloak
4. **Redirected back** to application
5. **Session established** with NextAuth.js
6. **User can add/delete** their own movies

## 🎬 Movie Management

### Adding Movies
1. User searches for a movie title
2. Application fetches data from OMDb/TMDb API
3. Movie is saved to MongoDB with user attribution
4. Movie appears in the grid with delete option

### Deleting Movies
1. User sees delete button on their own movies
2. Confirmation dialog appears
3. Movie is removed from database
4. Grid updates automatically

## 🛠️ Development vs Production

### Development Mode
- Uses credentials provider for quick testing
- Development form available
- Debug information in header
- Local MongoDB connection

### Production Mode
- Keycloak authentication only
- No development form
- Optimized for performance
- Containerized deployment

## 🔍 Troubleshooting

### Common Issues

1. **Keycloak not accessible**
   ```bash
   docker-compose logs keycloak
   # Wait for Keycloak to fully start (2-3 minutes)
   ```

2. **Authentication not working**
   - Check client secret in docker-compose.yml
   - Verify redirect URIs in Keycloak
   - Check browser console for errors

3. **Database connection issues**
   ```bash
   docker-compose logs mongo
   docker-compose logs app
   ```

4. **Movie API not working**
   - Verify MOVIE_API_KEY is set
   - Check API quota/limits

### Debug Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f keycloak
docker-compose logs -f mongo

# Access containers
docker exec -it popcornboard-app sh
docker exec -it popcornboard-keycloak /bin/bash

# Restart services
docker-compose restart app
docker-compose restart keycloak
```

## 📊 Monitoring

### Application Health
- **App**: http://localhost:3000
- **Keycloak Admin**: http://localhost:8080 (admin/admin)
- **MongoDB**: localhost:27017

### Logs
```bash
# Real-time logs
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

## 🔒 Security Considerations

### Production Deployment
1. **Change default passwords**
   - Keycloak admin password
   - Database passwords
   - NextAuth secret

2. **Use HTTPS**
   - Set up SSL certificates
   - Update redirect URIs

3. **Environment variables**
   ```bash
   NODE_ENV=production
   NEXTAUTH_URL=https://yourdomain.com
   KEYCLOAK_ISSUER=https://keycloak.yourdomain.com/realms/myrealm
   ```

## 🚀 Deployment Options

### Local Development
```bash
npm run dev
```

### Docker Development
```bash
docker-compose up -d
```

### Production
```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 API Documentation

### Movie Endpoints
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Add new movie
- `DELETE /api/movies/[id]` - Delete movie

### Authentication Endpoints
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all services are running: `docker-compose ps`
4. Check network connectivity between containers
5. Review the troubleshooting section in `DEPLOYMENT_GUIDE.md`

---

**🎉 Your PopcornBoard is now ready for deployment!** 