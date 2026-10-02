const fs = require('fs');

let mcContent = fs.readFileSync('js/MarketController.js', 'utf8');

const oldCheckFuncStart = "  async checkAndAutoReconnect() {\n    if (!this.playerSessionService) return false;";
const nextFuncStart = "\n  // --- Core Lifecycle Hooks ---";
const endIndex = mcContent.indexOf(nextFuncStart);

if (endIndex > -1) {
  const oldFuncText = mcContent.substring(mcContent.indexOf(oldCheckFuncStart), endIndex);
  
  const newFuncText = `  async checkAndAutoReconnect() {
    if (!this.playerSessionService) return false;
    const lastRoomCode = this.playerSessionService.getLastActiveRoomCode();
    if (!lastRoomCode) return false;

    const session = this.playerSessionService.getRoomSession(lastRoomCode);
    if (!session || !session.sessionToken) return false;

    // Do not auto-join. Let the user press JOIN manually.
    // Just auto-fill the lobby code.
    if (this.lobbyController && typeof this.lobbyController.updateRoomCodeSlots === 'function') {
      this.lobbyController.updateRoomCodeSlots(lastRoomCode);
    }
    return false;
  }`;

  mcContent = mcContent.replace(oldFuncText, newFuncText);
  fs.writeFileSync('js/MarketController.js', mcContent);
  console.log("Patched MarketController.js");
} else {
  console.log("Could not find endIndex");
}
