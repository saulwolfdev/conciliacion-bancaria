"use client";
import { useState } from 'react';

const Tabs = ({ tabs, defaultTab, onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab || tabs[0].name);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    onTabChange && onTabChange(tabName);
  };

  return (
    <div className="mt-4">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-customGreen focus:ring-customGreen sm:text-sm"
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
      <nav aria-label="Tabs" className="-mb-px flex">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              aria-current={selectedTab === tab.name ? 'page' : undefined}
              className={
                selectedTab === tab.name
                  ? 'border-b-2 border-customGreen text-customGreen font-bold w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium' 
                  : 'border-transparent text-gray-500 w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium hover:text-customGreen hover:font-bold hover:cursor-pointer'
              }
              onClick={() => handleTabClick(tab.name)}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;