/**
 * RoomQrModalRenderer - Dedicated renderer for the GM "Invite with QR Code" modal.
 * Draws the QR (qrcode-generator, loaded from CDN as window.qrcode) and shows the room code / invite link.
 * Adheres to Single Responsibility Principle (SRP).
 */
export class RoomQrModalRenderer {
  constructor() {
    this.modal = document.getElementById('roomQrModal');
    this.qrBox = document.getElementById('roomQrImage');
    this.codeText = document.getElementById('roomQrCodeText');
    this.linkText = document.getElementById('roomQrLinkText');
    this.copyBtn = document.getElementById('roomQrCopyBtn');
    this.closeBtn = document.getElementById('roomQrCloseBtn');
    this._cleanup = null;
  }

  /**
   * @param {string} inviteUrl - URL encoded into the QR
   * @param {string} roomCode - shown under the QR as a manual fallback
   * @param {Function} onCopy - invoked when the GM taps "copy link"
   */
  show(inviteUrl, roomCode, onCopy) {
    const modal = this.modal;
    if (!modal) return;

    this.hide();

    this.renderQr(inviteUrl);
    if (this.codeText) this.codeText.textContent = roomCode;
    if (this.linkText) this.linkText.textContent = inviteUrl;

    modal.style.display = 'flex';

    const handleClose = () => this.hide();
    const handleCopy = () => {
      if (typeof onCopy === 'function') onCopy();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    const handleOverlayClick = (e) => {
      if (e.target === modal) handleClose();
    };

    if (this.closeBtn) this.closeBtn.addEventListener('click', handleClose);
    if (this.copyBtn) this.copyBtn.addEventListener('click', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    modal.addEventListener('click', handleOverlayClick);

    this._cleanup = () => {
      if (this.closeBtn) this.closeBtn.removeEventListener('click', handleClose);
      if (this.copyBtn) this.copyBtn.removeEventListener('click', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      modal.removeEventListener('click', handleOverlayClick);
    };
  }

  hide() {
    if (this._cleanup) {
      this._cleanup();
      this._cleanup = null;
    }
    if (this.modal) this.modal.style.display = 'none';
  }

  renderQr(text) {
    if (!this.qrBox) return;
    this.qrBox.textContent = '';

    // CDN library may be blocked/offline: keep the room code + link usable
    if (typeof window.qrcode !== 'function') {
      const msg = document.createElement('span');
      msg.className = 'room-qr-fallback';
      msg.textContent = 'ไม่สามารถสร้าง QR Code ได้ ใช้รหัสห้องหรือลิงก์ด้านล่างแทน';
      this.qrBox.appendChild(msg);
      return;
    }

    const qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    // Library output contains only generated <svg>/<path> built from the QR matrix (no user-supplied markup)
    this.qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
  }
}
