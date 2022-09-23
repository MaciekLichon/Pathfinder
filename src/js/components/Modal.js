import { select, classNames, templates } from '../settings.js';

class Modal {
  constructor() {
    const thisModal = this;

    thisModal.getElements();
    thisModal.initHiding();
  }

  getElements() {
    const thisModal = this;

    thisModal.dom = {};

    thisModal.dom.modal = document.querySelector(select.containerOf.modal);

    thisModal.closeButton = thisModal.dom.modal.querySelector(select.modal.closeButton);
    thisModal.message = thisModal.dom.modal.querySelector(select.modal.message);
  }

  showModal(text) {
    const thisModal = this;

    const messageHTML = templates.modalMessage({ message: text });
    thisModal.message.innerHTML = messageHTML;
    console.log('showmodal', thisModal.message);

    thisModal.dom.modal.classList.add(classNames.modal.displayed);
  }

  initHiding() {
    const thisModal = this;

    thisModal.closeButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisModal.dom.modal.classList.remove(classNames.modal.displayed);
    });

    window.addEventListener('click', function(event) {
      if (event.target === thisModal.dom.modal) {
        thisModal.dom.modal.classList.remove(classNames.modal.displayed);
      }
    });

  }
}

export default Modal;
