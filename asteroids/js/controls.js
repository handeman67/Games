/**
 * UI Controls and HUD display management
 * Handles game interface elements, buttons, and status displays
 */

class Controls {
  constructor() {
    // Color properties for damage-based visual feedback
    this.btnStyle = ''
    this.damg = 0;
    this.myred = 255;
    this.mygreen = 255 - this.damg;
    this.myblue = 255 - this.damg;
    this.buttonsCreated = false; // Flag to prevent duplicate buttons
  }

  /**
   * Create transparent header with game buttons and HUD
   */
  createHeader() {
    // Create semi-transparent header background
    push();
    fill(0, 0, 0, 150); // Semi-transparent black
    noStroke();
    rect(0, 0, width, innerWidth); // Header height of 80px
    pop();

    // Create game control buttons in header (only once)
    this.createButtons();
  }

  /**
   * Create game control buttons positioned in the header
   */

  createButtons() {
    let thiscolor = color(255, 255, 255, 190); // White with transparency
    // Only create buttons if they don't already exist
    if (!this.buttonsCreated) {
      // Reset game button
      let resetBtn = createButton("Reset");
      resetBtn.mousePressed(() => {
        return new resetGame(true); // true means full reset
      });
      resetBtn.size(70, 30);
      resetBtn.position(20, 20);
      resetBtn.style('color', 'yellow');

      // Sound toggle button (placeholder)
      let soundBtn = createButton("🔊");

      soundBtn.size(40, 30);
      soundBtn.position(100, 20)
      soundBtn.mousePressed(() => {
        G.soundOn = !G.soundOn;
        soundBtn.html(G.soundOn ? "🔊" : "🔈");
      })
      // Test page button
      let testBtn = createButton("Tests");
      testBtn.mousePressed(() => {
        window.open('test.html', '_blank');
      });
      testBtn.position(160, 20);
      testBtn.size(60, 30);
      this.buttonsCreated = true;
    }
  }

  /**
   * Display HUD elements in the header
   */
  displayHUD() {
    // Set text properties for HUD
    textAlign(LEFT, CENTER);
    textSize(18);
    fill(255);

    // Score display
    text(`Score: ${G.score}`, 250, 40);

    // Level display
    text(`Level: ${G.level.length}`, 400, 40);

    // Lives display with ship icon
    text(`Lives: ${G.ship.length}`, 550, 40);
    // Draw small ship icon next to lives
    push();
    translate(520, 40);
    scale(0.6);
    fill(this.myred, this.mygreen, this.myblue, 255);
    triangle(-10, 10, 10, 10, 0, -15);
    pop();

    // Damage display
    let damageValue = G.ship[0] ? G.ship[0].damg : 0;
    text(`Damage: ${damageValue}`, 650, 40);
  }

  /**
   * Legacy methods for backward compatibility (deprecated)
   */
  button() {
    // This method is now handled by createHeader()
    console.warn('Controls.button() is deprecated. Use Controls.createHeader() instead.');
  }

  Scored() {
    // This method is now handled by createHeader()
    console.warn('Controls.Scored() is deprecated. HUD is now in header.');
  }

  LevelT() {
    // This method is now handled by createHeader()
    console.warn('Controls.LevelT() is deprecated. HUD is now in header.');
  }

  AsteroidCount() {
    // Removed as requested
    console.warn('Controls.AsteroidCount() is removed. Not displayed in header.');
  }

  FRAMERATE() {
    // Removed as requested
    console.warn('Controls.FRAMERATE() is removed. Not displayed in header.');
  }

  lives() {
    // This method is now handled by createHeader()
    console.warn('Controls.lives() is deprecated. HUD is now in header.');
  }

  damage() {
    // This method is now handled by createHeader()
    console.warn('Controls.damage() is deprecated. HUD is now in header.');
  }
}
