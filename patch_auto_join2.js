const fs = require('fs');

let mcContent = fs.readFileSync('js/MarketController.js', 'utf8');

const oldCheckFuncStart = "  async checkAndAutoReconnect() {\n    if (!this.playerSessionService) return false;";
const nextFuncStart = "  /**\n   * Resyncs board state and player portfolio UI when waking up from background or device sleep.\n   */\n  async handlePlayerResync(roomData, memberData) {";

const startIndex = mcContent.indexOf(oldCheckFuncStart);
const endIndex = mcContent.indexOf(nextFuncStart);

if (startIndex > -1 && endIndex > -1) {
  const oldFuncText = mcContent.substring(startIndex, endIndex);
  
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
  }

`;

  mcContent = mcContent.replace(oldFuncText, newFuncText);
  fs.writeFileSync('js/MarketController.js', mcContent);
  console.log("Patched MarketController.js successfully!");
} else {
  console.log("Could not find start or end index", startIndex, endIndex);
}
