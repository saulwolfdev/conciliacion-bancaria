import { useState, useEffect } from 'react';

const ProductGrid = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProductClick = (product) => {
    if (product.deshabilitado) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {products.map((product, index) => (
        <div 
          key={index} 
          className={`group relative flex flex-col ${product.deshabilitado ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={() => handleProductClick(product)}
        >
          <div className="aspect-h-4 aspect-w-5 sm:aspect-h-4 sm:aspect-w-5 overflow-hidden rounded-lg bg-gray-100 relative">
            <img
              src={product.imagesrc}
              alt={product.imageAlt}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className={`p-2 bg-white rounded-b-lg shadow flex flex-col h-full ${product.deshabilitado ? 'bg-gray-200' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-sm font-medium ${product.deshabilitado ? 'text-gray-500' : 'text-gray-900'}`}>
                <a href={product.href} target="_blank" rel="noopener noreferrer" className={product.deshabilitado ? 'pointer-events-none' : ''}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.nombre}
                </a>
              </h3>
              <div className={`w-24 h-6 text-xs flex items-center justify-center rounded ${product.deshabilitado ? 'bg-gray-400' : 'bg-customLightBlue'} bg-opacity-75 text-white`}>
                {product.status}
              </div>
            </div>
            <p className={`text-xs ${product.deshabilitado ? 'text-gray-400' : 'text-gray-500'}`}>{product.descripcion}</p>
          </div>
        </div>
      ))}

      {mounted && isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-100 px-4 py-4 sm:px-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900" id="modal-title">
                  Contáctanos
                </h3>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-600">
                      Esta aplicación se encuentra deshabilitada.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white">
                <img src="/images/login.png" alt="Imagen de Contacto" className="w-full h-auto" />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
