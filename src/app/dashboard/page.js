"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Amplify } from "aws-amplify";

import { getAmplifyConfig } from "@/utils/amplify_config";
import { getCurrentUser } from "aws-amplify/auth";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProductGrid from '@/components/ProductGrid';

const TabNavigation = ({ tabs, selectedTab, handleTabClick }) => (
  <div>
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">Select a tab</label>
      <select
        id="tabs"
        name="tabs"
        className="block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={selectedTab}
        onChange={(e) => handleTabClick(e.target.value)}
      >
        {tabs.map((tab) => (
          <option key={tab.name} className="text-gray-900 bg-white hover:bg-indigo-100">
            {tab.name}
          </option>
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

function Dashboard() {
  const [apps, setApps] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Todas');
  const router = useRouter();

  useEffect(() => {
    const loadBeamerScripts = () => {
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
    };

    const fetchApps = async () => {
      try {
        const config = await getAmplifyConfig();
        Amplify.configure(config);
        const configApp = JSON.parse(localStorage.getItem('apps_config')) || [];
        setApps(configApp);  
        await getCurrentUser();
        loadBeamerScripts();
      } catch (error) {
        console.error('User not logged in:', error);
        router.push('/');
      }
    };

    fetchApps();
  }, [router]);  

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

  const filteredProducts = selectedTab === 'Todas' ? apps : apps.filter(product => product.categoria === selectedTab);

  const pages = [
    { name: 'Dashboard', href: '#', current: true },
  ];

  return (
    <>
      <BreadCrumbs pages={pages} />
      <div className="mx-auto px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-16 md:max-w-7xl lg:max-w-5xl lg:px-8">
        <TabNavigation tabs={tabs} selectedTab={selectedTab} handleTabClick={handleTabClick} />
        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}

export default Dashboard;
