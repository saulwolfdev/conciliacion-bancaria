"use client";
import SummaryBox from "@/components/SummaryBox";
import { cardsInet, products } from "../lib/datainet";
import { useEffect } from 'react';
import BreadCrumbs from "@/components/BreadCrumbs";

function Dashboard() {

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

  return (
    <>
      <BreadCrumbs
        pages={pages}
      />
      {/* <div className="mt-5 lg:col-start-3 lg:row-end-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cardsInet.map((item) => (
          <SummaryBox
            key = {item.id}
            app={item.title}
            status="Paid"
            client={item.subtitle}
            dueDate="2023-01-31"
            paymentMethod="Paid with MasterCard"
            link={item.path}
          />
        ))}
      </div> */}
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" />
                <div className="flex items-end p-2 opacity-0 group-hover:opacity-100" aria-hidden="true">
                  <div className="w-full rounded-md bg-white bg-opacity-75 px-2 py-1 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                    {product.status}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={product.href} target="_blank">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
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
