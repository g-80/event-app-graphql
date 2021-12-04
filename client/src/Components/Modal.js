import "./Modal.css";

const Modal = ({
  children,
  title,
  canConfirm,
  onConfirm,
  onCancel,
  actionBtnText,
}) => {
  return (
    <>
      <div className="modal">
        <div className="modal-title">
          <h1>{title}</h1>
        </div>
        <section className="modal-elements">{children}</section>
        <section className="modal-btns">
          <button className="modal-cancel btn-secondary" onClick={onCancel}>
            {canConfirm ? "Cancel" : "Close"}
          </button>
          {canConfirm && (
            <button className="modal-confirm btn-primary" onClick={onConfirm}>
              {actionBtnText}
            </button>
          )}
        </section>
      </div>
      <div className="backdrop"></div>
    </>
  );
};

export default Modal;
