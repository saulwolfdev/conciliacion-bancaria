"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Amplify } from "aws-amplify";

import { getAmplifyConfig } from "@/utils/amplify_config";
import { getCurrentUser } from "aws-amplify/auth";
import BreadCrumbs from "@/components/BreadCrumbs";
import { products } from "../lib/datainet";


const useAmplifyConfig = () => {
  const router = useRouter();

  useEffect(() => {
    const configAmplify = async () => {
      try {
        const config = await getAmplifyConfig();
        Amplify.configure(config);
        await getCurrentUser();
        
        const scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.defer = true;
        scriptElement.innerHTML = `
          var beamer_config = {
            product_id: 'TBYVjWVI65518',
            button_position: 'bottom-right',
          };
        `;
        document.head.appendChild(scriptElement);

        const beamerScriptElement = document.createElement("script");
        beamerScriptElement.type = "text/javascript";
        beamerScriptElement.src = "https://app.getbeamer.com/js/beamer-embed.js";
        beamerScriptElement.defer = true;
        document.head.appendChild(beamerScriptElement);

      } catch (error) {
        console.error('User not logged in:', error);
        router.push('/');
      }
    };
    configAmplify();
  }, []);
};

const TabNavigation = ({ tabs, selectedTab, handleTabClick }) => (
  <div>
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">Select a tab</label>
      <select
        id="tabs"
        name="tabs"
        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        value={selectedTab}
        onChange={(e) => handleTabClick(e.target.value)}
      >
        {tabs.map((tab) => (
          <option key={tab.name}>{tab.name}</option>
        ))}
      </select>
    </div>
    <div className="hidden sm:block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            className={`${selectedTab === tab.name ? 'bg-customGreen text-white' : 'text-customGreen hover:text-customGreen'} rounded-md px-3 py-2 text-sm font-medium`}
            aria-current={selectedTab === tab.name ? 'page' : undefined}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  </div>
);


const ProductGrid = ({ products }) => (
  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {products.map((product) => (
      <div key={product.id} className="group relative">
        <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100 relative">
          <div className="absolute top-3 left-3 flex items-center justify-center bg-customLightBlue bg-opacity-75 w-48 h-8 px-8 py-4 text-xs font-small text-gray-900 z-10 rounded-tl-md rounded-br-md">
            {product.categoria}
          </div>
          <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center w-full h-full" />
          <div className="flex items-end p-2 opacity-0 group-hover:opacity-100" aria-hidden="true">
            <div className="w-full rounded-md bg-white bg-opacity-75 px-2 py-1 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
              {product.status}
            </div>
          </div>
        </div>
        <div className="p-2 bg-white rounded-b-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-base font-medium text-gray-900">
              <a href={product.href} target="_blank">
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </a>
            </h3>
            <img src="/images/inet.png" alt="Check Icon" className="w-8 h-8 ml-2" />
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">{product.category}</p>
        </div>
      </div>
    ))}
  </div>
);

function Dashboard() {
  useAmplifyConfig();
  const [selectedTab, setSelectedTab] = useState('Todas');

  const tabs = [
    { name: 'Todas', href: '#', current: true },
    { name: 'Ventas y Compras', href: '#', current: false },
    { name: 'Adquisiciones', href: '#', current: false },
    { name: 'Gestión de Activos', href: '#', current: false },
    { name: 'RRHH', href: '#', current: false },
    { name: 'Analítica', href: '#', current: false },
    { name: 'Integraciones', href: '#', current: false },
  ];

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  const filteredProducts = selectedTab === 'Todas' ? products : products.filter(product => product.categoria === selectedTab);

  const pages = [
    { name: 'Inet', href: '/dashboard', current: false },
    { name: 'Dashboard', href: '#', current: true },
  ];

  return (
    <>
      <BreadCrumbs pages={pages} />
      <div className="mx-auto px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-16 lg:max-w-7xl lg:px-8">
        <TabNavigation tabs={tabs} selectedTab={selectedTab} handleTabClick={handleTabClick} />
        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}

export default Dashboard;
