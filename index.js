import { DialogService } from './dialog.js';

export class Application {
  static get default() {
    return this._app ??= new Application(new DialogService(/* todo: configuration for all dialogs */));
  }

  /**
   * @param {DialogService} dialogService
   */
  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  /**
   * @param {string} message
   * @param {string} title
   * @param {(action, dialog) => void} [callback]
   */
  alert(message, title, callback) {
    return this.dialogService.open({
      host: document.body,
      content: message,
      title,
      buttons: [
        { action: 'Ok', callback }
      ]
    });
  }

  /**
   * @param {string} message
   * @param {string} title
   * @param {(action: 'Yes' | 'Cancel') => void} callback
   */
  confirm(message, title, callback) {
    return this.dialogService.open({
      host: document.body,
      content: message,
      title: title,
      buttons: [
        { action: 'Yes', callback: (action, dialog) => {
          dialog.close().then(() => {
            callback(action);
          });
        }},
        { action: 'Cancel', callback: (action, dialog) => {
          dialog.close().then(() => {
            callback(action);
          });
        }}
      ]
    });
  }
}
