// MongoDB initialization script for PopcornBoard
db = db.getSiblingDB('popcornboard');

// Create collections
db.createCollection('movies');
db.createCollection('sessions');
db.createCollection('accounts');
db.createCollection('users');

// Create indexes for better performance
db.movies.createIndex({ "suggestedBy": 1 });
db.movies.createIndex({ "createdAt": -1 });
db.sessions.createIndex({ "expires": 1 }, { expireAfterSeconds: 0 });

print('PopcornBoard database initialized successfully!'); 