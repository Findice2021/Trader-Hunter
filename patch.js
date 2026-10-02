const fs = require('fs');
let content = fs.readFileSync('js/controllers/board/DangerZoneHandler.js', 'utf8');

content = content.replace(
  /confirmResetRoomBtn\.addEventListener\('click', async \(\) => \{\s+if \(this\.state\.role !== 'game_master' \|\| this\.state\.isSpectating\) return;/,
  "confirmResetRoomBtn.addEventListener('click', async () => {\n        if (this.state.isSpectating) return;"
);

const regex = /const playerResetGameBtn = document\.getElementById\('playerResetGameBtn'\);[\s\S]*?if \(this\.state\.role !== 'player'\) return;[\s\S]*?\/\/ First confirmation[\s\S]*\}\s*\}\s*\}/;

const replaceWith = `const playerResetGameBtn = document.getElementById('playerResetGameBtn');
    if (playerResetGameBtn) {
      playerResetGameBtn.addEventListener('click', async () => {
        if (this.state.role !== 'player') return;
        this.renderer.openConfirmResetRoomModal();
      });
    }
  }
}`;

if (regex.test(content)) {
  content = content.replace(regex, replaceWith);
  fs.writeFileSync('js/controllers/board/DangerZoneHandler.js', content);
  console.log("Patched successfully!");
} else {
  console.log("Regex did not match");
}
