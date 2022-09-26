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

    thisModal.dom.infoModal = document.querySelector(select.containerOf.infoModal);
    thisModal.dom.infoCloseButton = thisModal.dom.infoModal.querySelector(select.infoModal.closeButton);
    thisModal.dom.infoMessage = thisModal.dom.infoModal.querySelector(select.infoModal.message);

    thisModal.dom.guideModal = document.querySelector(select.containerOf.guideModal);
    thisModal.dom.guideCloseButton = thisModal.dom.guideModal.querySelector(select.guideModal.closeButton);
  }

  showInfoModal(text) {
    const thisModal = this;

    const messageHTML = templates.modalMessage({ message: text });
    thisModal.dom.infoMessage.innerHTML = messageHTML;
    console.log('showmodal', thisModal.dom.infoMessage);

    thisModal.dom.infoModal.classList.add(classNames.modal.displayed);
  }

  showGuide() {
    const thisModal = this;

    thisModal.dom.guideModal.classList.add(classNames.modal.displayed);
  }

  initHiding() {
    const thisModal = this;

    thisModal.dom.infoCloseButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisModal.dom.infoModal.classList.remove(classNames.modal.displayed);
    });
    thisModal.dom.guideCloseButton.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('asd');
      thisModal.dom.guideModal.classList.remove(classNames.modal.displayed);
    });

    window.addEventListener('click', function(event) {
      if (event.target === thisModal.dom.infoModal) {
        thisModal.dom.infoModal.classList.remove(classNames.modal.displayed);
      }
      else if (event.target === thisModal.dom.guideModal) {
        thisModal.dom.guideModal.classList.remove(classNames.modal.displayed);
      }
    });

  }
}

export default Modal;
