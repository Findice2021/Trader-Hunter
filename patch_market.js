const fs = require('fs');
let c = fs.readFileSync('js/MarketController.js', 'utf8');

const start = '  async checkAndAutoReconnect() {';
const end = '  /**\n   * Resyncs board state';
const sIdx = c.indexOf(start);
const eIdx = c.indexOf(end);

if (sIdx > -1 && eIdx > -1) {
  const newF = `  async checkAndAutoReconnect() {
    if (!this.playerSessionService) return false;
    const lastRoomCode = this.playerSessionService.getLastActiveRoomCode();
    if (!lastRoomCode) return false;

    const session = this.playerSessionService.getRoomSession(lastRoomCode);
    if (!session || !session.sessionToken) return false;

    if (this.lobbyController && typeof this.lobbyController.updateRoomCodeSlots === 'function') {
      this.lobbyController.updateRoomCodeSlots(lastRoomCode);
    }
    return false;
  }

`;
  c = c.substring(0, sIdx) + newF + c.substring(eIdx);
  fs.writeFileSync('js/MarketController.js', c);
  console.log('Replaced');
} else {
  console.log('Failed');
}
