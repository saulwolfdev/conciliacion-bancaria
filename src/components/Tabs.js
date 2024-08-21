import React from 'react';

const Tab = ({ id, label, isActive, onClick }) => {
  return (
    <button
      key={id}
      className={`px-4 py-2 focus:outline-none ${
        isActive
          ? 'border-b-2 border-customGreen text-customGreen font-bold'
          : 'text-gray-500'
      } hover:text-customGreen hover:font-bold focus:text-customGreen focus:font-bold`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="p-4">
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;