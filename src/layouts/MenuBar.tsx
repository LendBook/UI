import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import pairs from "../config/pairs.json"; // Make sure the path is correct
import { Icon } from "@iconify/react";

const MENU_LINKS = [
  { id: 1, label: "Lend to Earn", to: "/lend" },
  { id: 2, label: "Borrow", to: "/borrow" },
  { id: 3, label: "Trade", to: "/trade" },
  { id: 4, label: "My Dashboard", to: "/dashboard" },
  { id: 5, label: "Analytics", to: "/analytics" },
  { id: 6, label: "Inaki Test", to: "/inakitest" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuBar() {
  const [selectedPair, setSelectedPair] = useState(pairs[0]); // Default to first pair
  const [selectedMenu, setSelectedMenu] = useState(MENU_LINKS[0].id); // Default to first menu link

  return (
    <div className="bg-white text-black w-64 fixed top-16 left-0 h-full z-10 shadow-md">
      <div className="flex flex-col pt-2">
        {" "}
        {/* Added pt-2 here for top padding */}
        <div className="px-4 py-2">
          <Menu as="div" className="relative inline-block text-left w-full">
            <div>
              <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-between items-center">
                {selectedPair ? (
                  <>
                    <img
                      src={selectedPair.logourlA}
                      alt={selectedPair.tokenA}
                      className="h-5 w-5 mr-2"
                    />
                    {selectedPair.tokenA} /
                    <img
                      src={selectedPair.logourlB}
                      alt={selectedPair.tokenB}
                      className="h-5 w-5 ml-2 mr-2"
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
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {pairs.map((pair) => (
                    <Menu.Item key={pair.chainID}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedPair(pair)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-900 w-full text-left"
                          )}
                        >
                          <img
                            src={pair.logourlA}
                            alt={pair.tokenA}
                            className="inline h-5 w-5 mr-2"
                          />
                          {pair.tokenA} /
                          <img
                            src={pair.logourlB}
                            alt={pair.tokenB}
                            className="inline h-5 w-5 ml-2"
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
            className={`p-4 hover:bg-gray-100  no-underline ${
              selectedMenu === menu.id
                ? "font-bold text-black bg-bgLight"
                : "font-thin text-dark"
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
