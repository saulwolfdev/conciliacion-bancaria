"use client"
import { Fragment, useState, useEffect, Suspense } from 'react';
import { Dialog, Menu, Transition, Disclosure } from '@headlessui/react';
import { ChevronRightIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CalendarIcon,
  ChartPieIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loading from '@/app/dashboard/loading';
import { signOut } from 'aws-amplify/auth';

const userNavigation = [
  { name: 'Salir', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const app_config = [
  {"nombre":"Aprobaciones / OC","categoria":"Adquisiciones","descripcion":"Sistema de aprobaciones de ordenes de compra","href":"dashboard/ordenes","imagesrc":"/images/aprob.png","status":"Ver Producto","habilitado":false},
  {"nombre":"Ipropertyss","categoria":"Gestión de Activos","descripcion":"Solución para la gestión de inmuebles strip centers y malls.","href":"http://demoarrendador.iproperty.cl/login/?next=/","imagesrc":"/images/IProperty2.png","status":"No habilitada","habilitado":true},
  {"nombre":"Portal de RRHH","descripcion":"Solución de autoconsulta de RRHH para empleados.","categoria":"RRHH","href":"http://verticales.inetcloud.cl:8081/rrhh/login.aspx","imagesrc":"/images/PortalRRHH.png","status":"Ver Producto","habilitado":false},
  {"nombre":"Match Financiero","descripcion":"Solución para la automatización de la conciliación bancaria.","categoria":"Finanzas y Contabilidad","href":"#","imagesrc":"/images/MatchFinanciero.png","status":"Próximamente"},
  {"nombre":"IFacture V2","descripcion":"Solución de Facturación Electrónica.","categoria":"Ventas y Compras","href":"#","imagesrc":"/images/IFactureV2.png","status":"Próximamente"},
  {"nombre":"Dashboad Finanzas","descripcion":"Solución para ver la información de cuentas por cobrar y pagar.","categoria":"Analítica","href":"#","imagesrc":"/images/finanzas.png","status":"Próximamente"},
  {"nombre":"Datawalt","descripcion":"Integración para dashboard financiero contable con IA.","categoria":"Integraciones","href":"#","imagesrc":"/images/Datawalt.png","status":"Ver Producto"},
  {"nombre":"ControlDoc","descripcion":"Integración con solución de firma electrónica.","categoria":"Integraciones","href":"#","imagesrc":"/images/ControlDoc.png","status":"Ver Producto"},
  {"nombre":"Rindegastos","descripcion":"Integración que automatiza la rendición de gastos.","categoria":"Integraciones","href":"#","imagesrc":"/images/Rindegastos.png","status":"Ver Producto"},
  {"nombre":"GetPoint","descripcion":"Integración con plataforma WMS para la gestión de bodegas y logística.","categoria":"Integraciones","href":"#","imagesrc":"/images/Getpoint.png","status":"Ver Producto"},
  {"nombre":"Multivende","descripcion":"Integración para la gestión de Marketplace y tiendas online.","categoria":"Integraciones","href":"#","imagesrc":"/images/Multivende.png","status":"Próximamente"},
  {"nombre":"Duemint","descripcion":"Integración para el proceso de gestión de cobranza.","categoria":"Integraciones","href":"#","imagesrc":"/images/Duemint.png","status":"Próximamente"},
  {"nombre":"SIRC","descripcion":"Integración para descarga del libro de asistencia de Geovictoria o Bnovus.","categoria":"Integraciones","href":"#","imagesrc":"/images/SIRC.png","status":"Ver Producto"}
];

export default function HomeLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useRouter();
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    setAvatar(localStorage.getItem('avatar'));
    const configApp = JSON.parse(localStorage.getItem('apps_config'));
    console.log(configApp)
    setApps(configApp); 
    
  }, []);

  const groupedItems = app_config.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push({
      name: item.nombre,
      href: item.href
    });
    return acc;
  }, {});
  
  const navigation = Object.keys(groupedItems).map(category => ({
    name: category,
    icon: FolderIcon,
    current: false,
    children: groupedItems[category]
  }));
  

  async function handleSignOut() {
    try {
      await signOut();
      localStorage.clear()
      navigate.push('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  
  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="mt-3 flex h-16 shrink-0 items-center">
                    <img
                      className="mb-6 mt-5"
                      src="/images/informat.png"
                      alt="Informat Logo"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              {!item.children ? (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700',
                                  )}
                                >
                                  <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                  {item.name}
                                </a>
                              ) : (
                                <Disclosure as="div">
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button
                                        className={classNames(
                                          item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                          'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700',
                                        )}
                                      >
                                        <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                        {item.name}
                                        <ChevronRightIcon
                                          className={classNames(
                                            open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                            'ml-auto h-5 w-5 shrink-0',
                                          )}
                                          aria-hidden="true"
                                        />
                                      </Disclosure.Button>
                                      <Disclosure.Panel as="ul" className="mt-1 px-2">
                                        {item.children.map((subItem) => (
                                          <li key={subItem.name}>
                                            <Disclosure.Button
                                              as="a"
                                              href={subItem.href}
                                              className={classNames(
                                                subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                                'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                              )}
                                            >
                                              {subItem.name}
                                            </Disclosure.Button>
                                          </li>
                                        ))}
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-green-50 px-6 pb-4">
          <img
            className="mb-6 mt-5"
            src="/images/informat.png"
            alt="Informat Logo"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <nav className="mt-3 flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      {!item.children ? (
                        <a
                          href={item.href}
                          className={classNames(
                            item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700',
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                          {item.name}
                        </a>
                      ) : (
                        <Disclosure as="div">
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                  'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700',
                                )}
                              >
                                <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                {item.name}
                                <ChevronRightIcon
                                  className={classNames(
                                    open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                    'ml-auto h-5 w-5 shrink-0',
                                  )}
                                  aria-hidden="true"
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel as="ul" className="mt-1 px-2">
                                {item.children.map((subItem) => (
                                  <li key={subItem.name}>
                                    <Disclosure.Button
                                      as="a"
                                      href={subItem.href}
                                      className={classNames(
                                        subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                        'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                      )}
                                    >
                                      {subItem.name}
                                    </Disclosure.Button>
                                  </li>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-customGreen">
                    <span className="font-medium leading-none text-white">{avatar}</span>
                  </span>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                      {username}
                    </span>
                    <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                            onClick={handleSignOut}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        <main className="py-10">
          <Suspense fallback={<Loading />}>
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
