# Troubleshooting Guide for PopcornBoard

## Issues Fixed

### 1. Login/Logout Issues
- **Problem**: Session state not updating properly after login/logout
- **Solution**: 
  - Improved session handling in Header component
  - Added proper loading states
  - Enhanced error handling for sign-in/sign-out operations
  - Added debug information in development mode

### 2. Movie Deletion Permission Issues
- **Problem**: Users couldn't delete their own movies after logging in again
- **Solution**:
  - Enhanced `canDelete` logic in MovieCard component
  - Improved permission checking in API route
  - Added support for different user identifier formats
  - Added better error messages for debugging

## How to Test the Fixes

### 1. Test Login/Logout
1. Start your development server: `npm run dev`
2. Go to the application
3. Click "Login / Sign Up"
4. Enter your email and name
5. Verify you're logged in (should see "Welcome, [your name]")
6. Click "Logout"
7. Verify you're logged out (should see "Login / Sign Up" button)
8. Login again with the same credentials
9. Verify the session persists correctly

### 2. Test Movie Deletion
1. Login to the application
2. Add a movie using the form
3. Verify you can see a "Delete" button on your movie
4. Logout and login again with the same credentials
5. Verify you can still see the "Delete" button on your movie
6. Try deleting the movie - it should work

### 3. Debug Information
In development mode, you'll see debug information in the header showing:
- Session status
- Whether client/server session is available
- Current user information

## Key Changes Made

### MovieCard.tsx
- Enhanced `canDelete` logic to handle different user identifier formats
- Added loading state while session is loading
- Improved error handling for delete operations

### Header.tsx
- Added proper session status handling
- Improved error handling for sign-in/sign-out
- Added debug information in development mode

### API Route ([id]/route.ts)
- Enhanced permission checking logic
- Added better error messages with debugging information
- Improved user identifier comparison

### MovieGrid.tsx
- Added session status dependency to refetch movies when session changes
- This ensures delete buttons appear/disappear correctly

## Common Issues and Solutions

### Issue: Still can't delete movies after login
**Solution**: 
1. Check the browser console for any errors
2. Verify the user email/name matches exactly what's stored in `suggestedBy`
3. Use the debug information in the header to verify session state
4. Try clearing browser storage and logging in again

### Issue: Session not persisting
**Solution**:
1. Check if cookies are enabled in your browser
2. Verify the NextAuth configuration is correct
3. Check the browser console for any authentication errors

### Issue: Delete button not appearing
**Solution**:
1. Refresh the page after login
2. Check the debug information in the header
3. Verify the movie was added by the same user account

## Testing Script
Run the `test-session.js` script in your browser console to verify:
- Session state
- Available movies and their permissions
- API responses

## Environment Variables
Make sure these are set in your `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
```

## Still Having Issues?
1. Check the browser console for errors
2. Look at the debug information in the header
3. Verify your database connection
4. Try clearing browser storage and cookies
5. Restart the development server 