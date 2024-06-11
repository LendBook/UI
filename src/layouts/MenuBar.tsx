// MenuBar.tsx
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import pairs from "../config/constants/pair.json";
import MENU_LINKS from "../config/constants/menu";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext"; 

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuBar() {
  const { darkMode } = useTheme(); 
  const [selectedPair, setSelectedPair] = useState(pairs[0]); 
  const [selectedMenu, setSelectedMenu] = useState(MENU_LINKS[0].id);

  return (
    <div className={`w-64 fixed top-16 left-0 h-full z-10 shadow-md ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-col pt-2">
        <div className="px-4 py-2">
          <Menu as="div" className="relative inline-block text-left w-full">
            <div>
              <Menu.Button className={`group w-full rounded-md px-3.5 py-2 text-sm text-left font-medium ${darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-between items-center`}>
                {selectedPair ? (
                  <>
                    <img
                      src={selectedPair.logourlA}
                      alt={selectedPair.tokenA}
                      style={{ height: '20px', width: '20px', marginRight: '4px' }}
                    />
                    {selectedPair.tokenA} /
                    <img
                      src={selectedPair.logourlB}
                      alt={selectedPair.tokenB}
                      style={{ height: '20px', width: '20px', marginLeft: '4px', marginRight: '4px' }}
                    />
                    {selectedPair.tokenB}
                  </>
                ) : (
                  "Select Pair"
                )}
                <Icon
                  icon="heroicons-solid:chevron-down"
                  className="ml-2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                <div className="py-1 flex flex-wrap">
                  {pairs.map((pair) => (
                    <Menu.Item key={pair.chainID}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedPair(pair)}
                          className={classNames(
                            active ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : "",
                            "inline-flex items-center px-4 py-2 text-sm w-full text-left"
                          )}
                          style={{ display: 'inline-flex', marginRight: '4px' }}
                        >
                          <img
                            src={pair.logourlA}
                            alt={pair.tokenA}
                            style={{ height: '20px', width: '20px', marginRight: '4px' }}
                          />
                          {pair.tokenA} /
                          <img
                            src={pair.logourlB}
                            alt={pair.tokenB}
                            style={{ height: '20px', width: '20px', marginLeft: '4px' }}
                          />
                          {pair.tokenB}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        {MENU_LINKS.map((menu) => (
          <Link
            key={menu.id}
            to={menu.to}
            onClick={() => setSelectedMenu(menu.id)}
            className={`p-4 no-underline ${darkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'} ${selectedMenu === menu.id ? (darkMode ? 'bg-gray-700' : 'bg-bgLight font-bold') : 'font-thin'}`}
          >
            {menu.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
