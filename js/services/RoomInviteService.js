/**
 * RoomInviteService - Builds and parses QR invite links (`?room=CODE`) used by the GM to invite players.
 * Pure logic, no DOM. Adheres to Single Responsibility Principle (SRP).
 */
export class RoomInviteService {
  static PARAM_NAME = 'room';

  // Same constraint as the lobby code input (maxlength 6, alphanumeric)
  static ROOM_CODE_PATTERN = /^[A-Za-z0-9]{1,6}$/;

  /**
   * Builds an invite URL for the current page, dropping any existing query/hash
   * (e.g. LINE's openExternalBrowser) so the QR stays short and scannable.
   * @param {string} baseHref - usually window.location.href
   * @param {string} roomCode
   * @returns {string}
   */
  static buildInviteUrl(baseHref, roomCode) {
    const url = new URL(baseHref);
    url.search = '';
    url.hash = '';
    url.searchParams.set(this.PARAM_NAME, String(roomCode).toUpperCase());
    return url.toString();
  }

  /**
   * Returns the normalized (upper-case) room code from a query string, or null if absent/invalid.
   * @param {string} search - e.g. window.location.search
   * @returns {string|null}
   */
  static parseRoomCode(search) {
    const raw = new URLSearchParams(search).get(this.PARAM_NAME);
    if (raw === null) return null;
    const code = raw.trim();
    return this.ROOM_CODE_PATTERN.test(code) ? code.toUpperCase() : null;
  }

  /**
   * Reads the invite room code from the page URL and removes the param (keeping other params)
   * so a later reload does not trigger another auto-join.
   * @param {Window} win
   * @returns {string|null}
   */
  static consumeRoomCodeFromUrl(win = window) {
    const code = this.parseRoomCode(win.location.search);
    const url = new URL(win.location.href);
    if (url.searchParams.has(this.PARAM_NAME)) {
      url.searchParams.delete(this.PARAM_NAME);
      try {
        win.history.replaceState(win.history.state, '', url.toString());
      } catch (e) {
        // URL cleanup is cosmetic; ignore if the browser blocks replaceState
      }
    }
    return code;
  }
}
