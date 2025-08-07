# 🍿 PopcornBoard

A fun, user-driven movie suggestion platform where users can post movies they recommend, see suggestions by others, and manage their own list. It resembles a digital "poster wall" with suggestions.

## 🚀 Features

- **Movie Suggestions**: Users can add movie recommendations with automatic poster fetching
- **Authentication**: Secure login using Keycloak
- **User Management**: Users can only edit/delete their own suggestions
- **Movie Search**: Integration with OMDb/TMDb APIs for movie data
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: See new suggestions immediately

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **Authentication**: Keycloak (OIDC)
- **Database**: MongoDB
- **ORM**: Mongoose
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js with Keycloak Provider
- **Movie API**: OMDb/TMDb API
- **Deployment**: Docker + Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Movie API key (OMDb or TMDb)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd PopcornBoard
```

### 2. Set up environment variables
Create a `.env.local` file with the following variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecretstring
KEYCLOAK_CLIENT_ID=nextjs-client
KEYCLOAK_CLIENT_SECRET=client-secret
KEYCLOAK_ISSUER=http://keycloak:8080/realms/myrealm
MONGODB_URI=mongodb://mongo:27017/moviedb
MOVIE_API_KEY=your_omdb_or_tmdb_api_key
MOVIE_API_PROVIDER=omdb
```

### 3. Get a Movie API Key
- **OMDb API**: Visit [omdbapi.com](http://www.omdbapi.com/) and get a free API key
- **TMDb API**: Visit [themoviedb.org](https://www.themoviedb.org/documentation/api) and get a free API key

### 4. Start the application
```bash
docker-compose up --build
```

### 5. Set up Keycloak
1. Open [http://localhost:8080](http://localhost:8080)
2. Login with admin/admin
3. Create a new realm called "myrealm"
4. Create a new client:
   - Client ID: `nextjs-client`
   - Protocol: `openid-connect`
   - Redirect URI: `http://localhost:3000/api/auth/callback/keycloak`
5. Create test users in the realm

### 6. Access the application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
PopcornBoard/
├── app/                    # App Router pages and routes
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/
│       ├── auth/          # NextAuth routes
│       └── movies/        # Movie API routes
├── components/            # React components
├── lib/                   # Utilities and models
│   ├── db.ts             # MongoDB connection
│   └── models/
│       └── Movie.ts      # Movie schema
├── public/               # Static assets
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker orchestration
└── README.md            # This file
```

## 🔧 Development

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 🐳 Docker Commands

### Start all services
```bash
docker-compose up --build
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f app
```

### Rebuild application
```bash
docker-compose up --build app
```

## 🔐 Authentication Setup

### Keycloak Configuration
1. **Realm**: Create a realm named "myrealm"
2. **Client**: 
   - Client ID: `nextjs-client`
   - Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
3. **Users**: Create test users with email/password

### Environment Variables
Make sure these are set in your `.env.local`:
- `KEYCLOAK_CLIENT_ID`: Your Keycloak client ID
- `KEYCLOAK_CLIENT_SECRET`: Your Keycloak client secret
- `KEYCLOAK_ISSUER`: Your Keycloak issuer URL

## 🎬 Movie API Integration

The application supports both OMDb and TMDb APIs:

### OMDb API
- Free tier available
- Simple setup
- Good for basic movie data

### TMDb API
- More comprehensive data
- Better image quality
- Requires registration

Set `MOVIE_API_PROVIDER=omdb` or `MOVIE_API_PROVIDER=tmdb` in your environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the Docker logs: `docker-compose logs`
2. Verify your environment variables
3. Ensure Keycloak is properly configured
4. Check that your movie API key is valid

## 🎯 Roadmap

- [ ] User profiles and avatars
- [ ] Movie ratings and reviews
- [ ] Social features (likes, comments)
- [ ] Advanced search and filtering
- [ ] Movie recommendations
- [ ] Mobile app 