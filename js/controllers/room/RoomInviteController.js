import { RoomInviteService } from '../../services/RoomInviteService.js';

/**
 * RoomInviteController - Binds the GM "Invite with QR Code" button, builds the invite link,
 * and handles copying it to the clipboard.
 * Adheres to Single Responsibility Principle (SRP).
 */
export class RoomInviteController {
  constructor({ state, renderer }) {
    this.state = state;
    this.renderer = renderer;
  }

  bind() {
    const btn = document.getElementById('roomQrBtn');
    if (!btn) return;
    btn.addEventListener('click', () => this.openInviteModal());
  }

  openInviteModal() {
    const code = this.state.roomCode;
    if (!code || this.state.role !== 'game_master') return;

    const inviteUrl = RoomInviteService.buildInviteUrl(window.location.href, code);
    this.renderer.showRoomQrModal(inviteUrl, code, () => this.copyInviteLink(inviteUrl));
  }

  async copyInviteLink(inviteUrl) {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      this.renderer.showTopToast("LINK COPIED", "คัดลอกลิงก์เชิญเข้าห้องเรียบร้อยแล้ว", "success");
    } catch (e) {
      // Clipboard API needs a secure context / permission; the link stays visible in the modal for manual copy
      this.renderer.showTopToast("COPY FAILED", "คัดลอกอัตโนมัติไม่ได้ กรุณาแตะค้างที่ลิงก์เพื่อคัดลอกเอง", "warning");
    }
  }
}
