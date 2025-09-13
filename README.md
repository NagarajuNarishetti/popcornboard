# 🍿 PopcornBoard

A fun, user-driven movie suggestion platform where users can post movies they recommend, see suggestions by others, and manage their own list. It resembles a digital "poster wall" with suggestions.

## 🚀 Features

- **Movie Suggestions**: Users can add movie recommendations with automatic poster fetching
- **Authentication**: Secure login using NextAuth.js
- **User Management**: Users can only edit/delete their own suggestions
- **Movie Search**: Integration with OMDb/TMDb APIs for movie data
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: See new suggestions immediately

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 15+ (App Router)
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **ORM**: Mongoose
- **Styling**: Tailwind CSS
- **Movie API**: OMDb/TMDb API
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- Movie API key (OMDb or TMDb)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd PopcornBoard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local with your values:
# - MOVIE_API_KEY: Your OMDb/TMDb API key
# - NEXTAUTH_SECRET: A strong secret key
# - MONGODB_URI: Your MongoDB connection string
# - NEXTAUTH_URL: Your application URL (http://localhost:3000 for development)
```

### 4. Get a Movie API Key
- **OMDb API**: Visit [omdbapi.com](http://www.omdbapi.com/) and get a free API key
- **TMDb API**: Visit [themoviedb.org](https://www.themoviedb.org/documentation/api) and get a free API key

### 5. Start the development server
```bash
npm run dev
```

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

### Linting
```bash
npm run lint
```

## 🔐 Authentication Setup

This project uses NextAuth.js for authentication. Configure your authentication provider in the environment variables:

### Environment Variables
Make sure these are set in your `.env.local`:
- `NEXTAUTH_SECRET`: A strong secret key for JWT signing
- `NEXTAUTH_URL`: Your application URL
- `MONGODB_URI`: Your MongoDB connection string
- `MOVIE_API_KEY`: Your movie API key (OMDb or TMDb)

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
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console logs in your browser
2. Verify your environment variables are set correctly
3. Ensure your MongoDB connection is working
4. Check that your movie API key is valid

## 🎯 Roadmap

- [ ] User profiles and avatars
- [ ] Movie ratings and reviews
- [ ] Social features (likes, comments)
- [ ] Advanced search and filtering
- [ ] Movie recommendations
- [ ] Mobile app 