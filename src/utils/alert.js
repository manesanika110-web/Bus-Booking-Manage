import Swal from "sweetalert2";


export const successAlert = (message) => {
  Swal.fire({
    title: "BusVista",
    text: message,
    icon: "success",
    confirmButtonColor: "#1A3B8B",
    confirmButtonText: "OK",
  });
};

export const errorAlert = (message) => {
  Swal.fire({
    title: "BusVista",
    text: message,
    icon: "error",
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
  });
};

export const warningAlert = (message) => {
  Swal.fire({
    title: "BusVista",
    text: message,
    icon: "warning",
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "OK",
  });
};
