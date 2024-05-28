"use client";
import SummaryBox from "@/components/SummaryBox";
import { cardsInet, products } from "../lib/datainet";
import { useEffect } from 'react';
import BreadCrumbs from "@/components/BreadCrumbs";

function Dashboard() {

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    // Create a new script element
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.defer = true; // or use scriptElement.setAttribute("defer", "true");

    // Add user information to the script content
    scriptElement.innerHTML = `
      var beamer_config = {
        product_id: 'TBYVjWVI65518',
        button_position: 'bottom-right',
      };
    `;

    // Append the script element to the document
    document.head.appendChild(scriptElement);

    // Create another script element for the Beamer embed script
    const beamerScriptElement = document.createElement("script");
    beamerScriptElement.type = "text/javascript";
    beamerScriptElement.src = "https://app.getbeamer.com/js/beamer-embed.js";
    beamerScriptElement.defer = true; 

    
    document.head.appendChild(beamerScriptElement);
  }, []);

  const pages = [
    { name: 'Inet', href: '/dashboard', current: false },
    { name: 'Dashboard', href: '#', current: true },
  ]

  const tabs = [
    { name: 'Todas', href: '#', current: false },
    { name: 'Soluciones', href: '#', current: true },
    { name: 'Productos', href: '#', current: false },
    { name: 'Aplicaciones', href: '#', current: false },
    { name: 'Integraciones', href: '#', current: false },
  ]

  return (
    <>
      <BreadCrumbs
        pages={pages}
      />
     <div className="mx-auto px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-16 lg:max-w-7xl lg:px-8">
        <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current ? 'bg-customGreen text-gray-700' : 'text-customGreen hover:text-customGreen',
                    'rounded-md px-3 py-2 text-sm font-medium'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
          <div key={product.id} className="group relative" >
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100 relative">
              <div className="absolute top-3 left-3  flex items-center justify-center bg-customLightBlue bg-opacity-75 w-24 h-8 px-8 py-4 text-sm font-medium text-gray-900 z-10 rounded-tl-md rounded-br-md">
                Soluciones
              </div>
              <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center w-full h-full" />
              <div className="flex items-end p-2 opacity-0 group-hover:opacity-100" aria-hidden="true">
                <div className="w-full rounded-md bg-white bg-opacity-75 px-2 py-1 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                  {product.status}
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-b-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={product.href} target="_blank">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <img src="/images/inet.png" alt="Check Icon" className="w-8 h-8 ml-2" />
              </div>
              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
