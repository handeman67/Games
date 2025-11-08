# TODO: Clean up resetGame class and verify function usage

## Tasks
- [x] Refactor resetGame methods to eliminate redundant astnum calculations
- [x] Remove duplicate property assignments in fullReset
- [x] Remove unused it_hit class
- [x] Ensure preload() remains for asset loading
- [x] Test game reset functionality
- [x] Run tests in test.html to verify no regressions
- [x] Fix exponential level progression by using G.level.length instead of G.level[0]
- [x] Fix pool initialization error by ensuring pools are initialized before use in constructor
- [x] Fix ship destruction errors by adding null checks in turning() and moving() functions
- [x] Fix high score reset issue - preserve G.allTime in fullReset method
- [x] Fix level reset issue - reset G.level in constructor when isFullReset is true
