// Simple test script to verify session functionality
// Run this in the browser console to test session state

console.log('=== Session Test Script ===');

// Test session state
function testSession() {
  console.log('Current session state:');
  console.log('Session:', window.sessionStorage.getItem('next-auth.session-token'));
  console.log('Local storage:', localStorage.getItem('next-auth.session-token'));
  
  // Check if user is logged in
  fetch('/api/auth/session')
    .then(res => res.json())
    .then(data => {
      console.log('Session API response:', data);
    })
    .catch(err => {
      console.error('Error fetching session:', err);
    });
}

// Test movie deletion permissions
function testMoviePermissions() {
  fetch('/api/movies')
    .then(res => res.json())
    .then(movies => {
      console.log('Available movies:', movies);
      movies.forEach(movie => {
        console.log(`Movie: ${movie.title}, Suggested by: ${movie.suggestedBy}`);
      });
    })
    .catch(err => {
      console.error('Error fetching movies:', err);
    });
}

// Run tests
testSession();
testMoviePermissions();

console.log('=== End Test Script ==='); 