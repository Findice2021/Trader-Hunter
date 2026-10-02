const fs = require('fs');

let mcContent = fs.readFileSync('js/MarketController.js', 'utf8');

const regex = /async checkAndAutoReconnect\(\) \{[\s\S]*?return false;\n      \}\n    \}\n    return false;\n  \}/;

const newFuncText = `async checkAndAutoReconnect() {
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

if (regex.test(mcContent)) {
  mcContent = mcContent.replace(regex, newFuncText);
  fs.writeFileSync('js/MarketController.js', mcContent);
  console.log("Patched MarketController.js via Regex successfully!");
} else {
  console.log("Regex did not match. Trying fallback.");
  // Manual string fallback
  const startMarker = "async checkAndAutoReconnect() {";
  const endMarker = "  async handlePlayerResync(roomData, memberData) {";
  const startIdx = mcContent.indexOf(startMarker);
  const endIdx = mcContent.indexOf("  /**\n" + endMarker);
  if (startIdx > -1 && endIdx > -1) {
     const toReplace = mcContent.substring(startIdx, endIdx);
     mcContent = mcContent.replace(toReplace, newFuncText + "\n\n");
     fs.writeFileSync('js/MarketController.js', mcContent);
     console.log("Patched MarketController.js via Fallback successfully!");
  } else {
     console.log("Fallback failed as well.");
  }
}
