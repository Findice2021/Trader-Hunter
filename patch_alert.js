const fs = require('fs');

// 1. Update MarketController.js
let mcContent = fs.readFileSync('js/MarketController.js', 'utf8');
const oldTitleMC = '"ห้องถูกรีเซ็ต"';
const oldMsgMC = '"เกมถูกรีเซ็ตและยุติลงโดย GM โปรดรอรหัสผ่านห้องใหม่เพื่อเริ่มรอบใหม่"';
const newTitle = '"ห้องถูกรีเซ็ต"';
const newMsg = '"ระบบได้ทำการล้างข้อมูลและส่งทุกคนกลับสู่หน้าล็อบบี้แล้ว"';

mcContent = mcContent.replace(oldTitleMC + ',\n        ' + oldMsgMC, newTitle + ',\n        ' + newMsg);
fs.writeFileSync('js/MarketController.js', mcContent);

// 2. Update DangerZoneHandler.js
let dzContent = fs.readFileSync('js/controllers/board/DangerZoneHandler.js', 'utf8');
const oldTitleDZ = '"รีเซ็ตเกมสำเร็จ"';
const oldMsgDZ = '"ระบบได้ทำการล้างข้อมูลและส่งทุกคนกลับสู่หน้าล็อบบี้แล้ว"';

dzContent = dzContent.replace(oldTitleDZ + ', ' + oldMsgDZ, newTitle + ', ' + newMsg);
fs.writeFileSync('js/controllers/board/DangerZoneHandler.js', dzContent);

console.log("Replaced text successfully!");
