// @ts-check

/**
 * @typedef IButtonOptions
 * @property {string} action
 * @property {(action: string, dialog: Dialog) => void} callback
 */

export class DialogService {

  /**
   * @param {{ host: Element; content: string; title: string; buttons: IButtonOptions[] }} param0
   * @returns {Promise<unknown>}
   */
  open({ host, content, title, buttons } = { host: document.body, content: '', title: '', buttons: [] }) {
    if (!content) {
      return Promise.reject(new Error('No content specified'));
    }
    return new Promise(r => {
      const dialog = new Dialog(
        content,
        title,
        // probably we don't need to pass too much information
        // to the dialog
        // its main concerns should resolve around UI only
        buttons.map(b => b.action)
      );

      const dialogEl = dialog.render();

      dialog.subscribe({
        handleAction: (action) => {
          buttons.find(b => b.action === action)?.callback.call(undefined, action, dialog);
        }
      });

      host.appendChild(dialogEl);
      dialogEl.showModal();
      dialogEl.animate(
        [
          { opacity: 0, transform: 'scale(0.8) translateY(200px)' },
          { opacity: 1, transform: 'scale(1) translateY(0px)' },
        ],
        { duration: 175 }
      ).finished.then(() => {
        r(dialog);
      });
    });
  }
}

// a dialog involves:
// - host
// - content
// - title
// - CTAs

export class Dialog {
  static get defaultCss() {
    return {
      header: 'font-weight: 700; font-size: 2rem;',
      body: 'padding: 4rem; text-align: center',
      footer: 'display: flex; justify-content: center; gap: 3rem;'
    }
  }

  /**
   * @param {string} content
   * @param {string} title
   * @param {string[]} buttons
   * @param {{ header: string; body: string; footer: string; }} [css]
   */
  constructor(content, title, buttons, css = Dialog.defaultCss) {
    /**@type {Set<{ handleAction: (name: string, dialog: Dialog) => void }>} */
    this.subs = new Set();
    this.content = content;
    this.title = title;
    this.buttons = buttons.slice(0);
    this.css = css;
    /**@type {HTMLDialogElement | null} */
    this.dialogEl = null;
    this.rendered = false;
  }

  /**
   * @param {{ handleAction: (name: string, dialog: Dialog) => void }} subscriber
   */
  subscribe(subscriber) {
    if (this.subs.add(subscriber).size > 0 && this.rendered) {
      this.dialogEl.addEventListener('click', this);
    }
  }

  /**
   * @param {{ handleAction: (name: string, dialog: Dialog) => void }} subscriber
   */
  unsubscribe(subscriber) {
    if (this.subs.delete(subscriber) && this.subs.size === 0 && this.rendered) {
      this.dialogEl.removeEventListener('click', this);
    }
  }

  /**
   * @param {string} action
   */
  notify(action) {
    Array.from(this.subs).forEach(sub => sub.handleAction(action, this));
  }

  /**@param {MouseEvent} e */
  handleEvent(e) {
    /**@type {string} */
    // @ts-expect-error
    const action = e.target.closest('[data-action]').getAttribute('data-action');
    if (action) {
      this.notify(action);
    }
  }

  /**@returns {HTMLDialogElement} */
  render() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    /**@param {keyof HTMLElementTagNameMap} el */
    const h = (el) => document.createElement(el);
    // requirement 6th:
    // All other elements on the main page shouldn’t be clickable when the dialog displays.
    //
    // this indicates there must be a backdrop
    // standard: use <dialog> element, with the backdrop
    // old school: use 2 <div>s, 1 for the backdrop, 1 for the content
    // choice: use <dialog>
    const dialogEl = h('dialog');
    if (this.title) {
      const titleEl = dialogEl.appendChild(h('header'));
      titleEl.textContent = this.title;
      titleEl.style.cssText = this.css.header;
    }
    const bodyEl = dialogEl.appendChild(h('div'));
    bodyEl.textContent = this.content;
    bodyEl.style.cssText = this.css.body;

    const footerEl = dialogEl.appendChild(h('footer'));
    footerEl.style.cssText = this.css.footer;

    this.buttons.forEach(b => {
      const buttonEl = footerEl.appendChild(h('button'));
      buttonEl.textContent = b;
      buttonEl.setAttribute('data-action', b);
    });
    // @ts-expect-error
    return this.dialogEl = dialogEl;
  }

  // 1. run exit animation?
  // 2. remove elements
  close() {
    return new Promise(r => {
      this.dialogEl.animate(
        [
          { opacity: 1, transform: 'scale(1) translateY(0px)' },
          { opacity: 0, transform: 'scale(0.8) translateY(-200px)' }
        ],
        { duration: 200 }
      ).finished.then(() => {
        this.dialogEl.remove();
        r();
      });
    });
  }
}
