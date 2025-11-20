import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { clearAlert } from "../store/globalStore/globalStore";

export default function GlobalAlert() {
  const { alert } = useSelector((state) => state.globalStore);
  const dispatch = useDispatch();

  useEffect(() => {
    if (alert) {
      const {
        type = "info",
        title = "Mensaje",
        text = "",
        html = "",
        confirmText = "Aceptar",
        cancelText = "Cancelar",
        showCancel = false,
        action = null,
        cancelAction = null,
      } = alert;

      Swal.fire({
        title,
        html: html || text, // ✅ permite contenido HTML (para recibos u otros formatos)
        icon: type,
        showCancelButton: showCancel,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: "#262254",
        cancelButtonColor: "#d33",
        background: "#fff",
        color: "#4b3b47",

        // 🔹 Asegura que el modal esté encima de cualquier otro (por ejemplo, MUI)
        didOpen: () => {
          const swalContainer = Swal.getPopup().parentElement;
          swalContainer.style.zIndex = "5000";
        },
      }).then((result) => {
        if (result.isConfirmed && action) {
          action();
        } else if (result.isDismissed && cancelAction) {
          cancelAction();
        }
        dispatch(clearAlert());
      });
    }
  }, [alert, dispatch]);

  return null;
}
