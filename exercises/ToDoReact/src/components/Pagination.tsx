// import React from "react";
// import { useClientStore } from "../store/clientStore";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   total: number;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   total,
// }) => {
//   const { setCurrentPage, itemsPerPage } = useClientStore();

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, total);

//   return (
//     <div className="flex items-center justify-between p-4 bg-amber-900 border-t border-amber-700">
//       <div className="text-amber-200 text-sm">
//         Mostrando {startItem}-{endItem} de {total} tareas
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={() => setCurrentPage(currentPage - 1)}
//           disabled={currentPage <= 1}
//           className="px-3 py-1 bg-amber-800 text-amber-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700"
//         >
//           Anterior
//         </button>

//         <span className="px-3 py-1 bg-amber-600 text-white rounded">
//           {currentPage} de {totalPages}
//         </span>

//         <button
//           onClick={() => setCurrentPage(currentPage + 1)}
//           disabled={currentPage >= totalPages}
//           className="px-3 py-1 bg-amber-800 text-amber-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700"
//         >
//           Siguiente
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;




//PENE

//PREGUNTAR AL PROFE SI HACE FALTA MAS PAGINACION DE LA QUE YA TENGO CON EL BOTON DE VER MAS TASKS
