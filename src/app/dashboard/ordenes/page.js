"use client";

import React, { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, DocumentArrowDownIcon, XCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { format } from 'date-fns';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { createColumnHelper } from '@tanstack/react-table';

import { dataOc, dataOcD, res } from '@/app/lib/dataoc';
import { getAllProduct, getProduct, aprobarRechazarOC, getTotales, guardarComentario, decodificarArchivoApi } from '@/api/products.api';
import BreadCrumbs from '@/components/BreadCrumbs';
import Input from '@/common/Input';
import SuccessNotification from '@/common/SuccessNotification';
import ErrorNotifications from '@/common/ErrorNotification';
import TanStackTable from '@/components/TanStackTable';
import { datos_prueba } from '@/app/layout';
import { getAmplifyConfig } from '@/utils/amplify_config';


const ProductsPage = ({ searchParams }) => {
const [open, setOpen] = useState(false)
const [opend, setOpenD] = useState(false)
const [opena, setOpenA] = useState(false)
const [dataOcR, setDataOcR] = useState({});
const [dataCards, setdataCards] = useState({cantidad_total: 0, suma_total: '0', cantidad_pend: 0, suma_pend: 0, cantidad_aprob: 0, suma_aprob: 0, cantidad_rech: 0, suma_rech: 0});
const [dataOc, setProduct] = useState([]);
const cancelButtonRef = useRef(null)
const [observation, setObservation] = useState("");
const [actividad, setActividad] = useState("");
const [comentario, setComentario] = useState("");
const [comentarioActividad, setComentarioActividad] = useState("");
const [success, setSuccess] = useState(false);
const [error, setError] = useState(null);
const [estadoFiltro, setEstadoFiltro] = useState(null);
const [showSuccess, setShowSuccess] = useState(true);
const [showErrors, setShowErrors] = useState(true);
const [idOC, setIdOC] = useState({numero:'', anio: '', mes: '', estado:''});
const columnHelper = createColumnHelper();
const [openOcD, setOpenOcD] = useState(false)
const [tamano, setTamano] = useState(7)
const [loading, setLoading] = useState(false);
const navigate = useRouter();

function currencyFormatter({ currency, value}) {
  return new Intl.NumberFormat('es-CL', {currency: currency, style: 'currency'}).format(value);
}

const setValorTamano = () => {
  if (window.innerWidth >= 1280) { // xl
    setTamano(7);
  } else if (window.innerWidth >= 1024) { // lg
    setTamano(7);
  } else if (window.innerWidth >= 768) { // md
    setTamano(3);
  } else { // sm o menor
    setTamano(3);
  }
};

const handleDismiss = () => {setShowSuccess(false);};
const handleDismissError = () => {setShowErrors(false);};
const handleObservationChange = (event) => {setObservation(event.target.value);}
const handleCommentChange = (event) => {
  const value = event.target.value;
  setActividad(value);
  setComentarioActividad(value);
};

const loadProducts = async (estado) => {
  setLoading(true);
  try {
    const res = await getAllProduct(estado);
    setProduct(res.data);
    setEstadoFiltro(estado);
    setLoading(false);
  } catch (error) {
    console.log('error getting oc: ', error);
    setLoading(false);
  }
};

const loadCards = async () => {
  try {
    const res = await getTotales();
    setdataCards(res.data)
  } catch (error) {
    console.log('error getting oc: ', error);
  }
};

const onAccept = (dataOc) => {
  setIdOC({numero: dataOc.AdqOdNum, anio: dataOc.AdqOdAno, mes:dataOc.AdqOdMes, estado:true});
  setOpenA(true)
};

const onReject = (dataOc) => {
  setIdOC({numero: dataOc.AdqOdNum, anio: dataOc.AdqOdAno, mes:dataOc.AdqOdMes, estado:false});
  setOpenD(true)
};

const onView = (dataOC) =>{
  setIdOC({numero: dataOC.AdqOdNum, anio: dataOC.AdqOdAno, mes: dataOC.AdqOdMes});
  loadProduct(dataOC.AdqOdNum, dataOC.AdqOdAno, dataOC.AdqOdMes, dataOC.SucCod)
};

const onDetail = (dataOC) =>{
  setIdOC({numero: dataOC.AdqOdNum, anio: dataOC.AdqOdAno, mes: dataOC.AdqOdMes});
  loadDetail(dataOC.AdqOdNum, dataOC.AdqOdAno, dataOC.AdqOdMes, dataOC.SucCod)
};

useEffect(() => {
  const configAmplify = async () => {
    try{
      const config = await getAmplifyConfig()
      Amplify.configure(config)
      const user = await getCurrentUser();
      loadProducts(null);
      loadCards();
      setValorTamano();
    }catch(error){
      console.error('User not logged in:', error);
      navigate.push('/');
    }
    
  };

  configAmplify(); 
  
}, []);

const loadProduct = async (numero, anio, mes, sucursal) => {
  setLoading(true);
  try {
    if(datos_prueba){
      setDataOcR(res);
      var usuario = res.aprobadores.find(item => item.usuario === 1);

    }else{
      const res = await getProduct({sucursal: sucursal, numero: numero, anio: anio, mes: mes});
      setDataOcR(res.data);
      var usuario = res.data.aprobadores.find(item => item.usuario === 1)
    }
    setComentario(usuario.AdqOAGl3)
    setOpen(true)
    setLoading(false);
  } catch (error) {
    console.log('error getting oc: ', error);
    setLoading(false);
  }
};

const loadDetail = async (numero, anio, mes, sucursal) => {
  try {
    if(datos_prueba){
      setDataOcR(res);
      var usuario = res.aprobadores.find(item => item.usuario === 1);
    } else{
      const res = await getProduct({sucursal: sucursal, numero: numero, anio: anio, mes: mes});
      setDataOcR(res.data);
      var usuario = res.data.aprobadores.find(item => item.usuario === 1);
    }    
    setComentario(usuario.AdqOAGl3)
    setOpenOcD(true)
  } catch (error) {
    console.log('error getting oc: ', error);
  }
};

const handleApiError = (error) => {
  setShowErrors(true);
  setSuccess(false);
  setError('Hubo un error al llamar a la API: ' + error.message);
};

const handleApproval = async (estado, message) => {
  try {
    const response = await aprobarRechazarOC({ id: idOC, comentario: observation });
    if (response.status === 200) {
      setShowSuccess(true);
      setSuccess(message);
      setError(null);
      loadProducts(null);
      loadCards();
    } else {
      handleApiError(new Error('Hubo un problema al llamar a la API.'));
    }
  } catch (error) {
    handleApiError(error);
  }
  setOpenD(false);
};

const LoadingSpinner = () => (
  <div className="loading active fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
    <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-customGreen"></div>
    <img src="/images/image.png" className="absolute rounded-full h-24 w-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></img>
  </div>
);

const RechazarOC = () => handleApproval(false, "OC rechazada correctamente");
const AprobarOC = () => handleApproval(true, "OC aprobada correctamente");


const ComentarActividad = async () => {
  setLoading(true);
  try {
    const response = await guardarComentario({id: idOC, comentario: actividad});
    if (response.status === 200) {
      setShowSuccess(true)
      setSuccess("Comentario Ingresado Correctamente");
      setError(null); 
      setComentario(actividad)

    } else {
      setShowErrors(true)
      setSuccess(false);
      setError('Hubo un problema al llamar a la API.');
    }
    setLoading(false);
  } catch (error) {
    setShowErrors(true)
    setSuccess(false);
    setError('Hubo un error al llamar a la API: ' + error.message);
    setLoading(false);
  }
  setOpenA(false)
  setComentarioActividad('');
  
};

const decodificarArchivo = async (numero, anio, mes, secuencia) => {
  try {
    const response = await decodificarArchivoApi({ numero: numero, anio: anio, mes: mes, secuencia: secuencia });
    if (response.status === 200) {
      window.open(response.data.url_archivo);
    } else {
      handleApiError(new Error('Hubo un problema al llamar a la API.'));
    }
  } catch (error) {
    handleApiError(error);
  }
  setOpenA(false);
};

const stats = [
  { name: 'Total Ordenes de compra', stat: currencyFormatter({currency:"CLP", value: dataCards.suma_total}), change: dataCards.cantidad_total, estado:'' },
  { name: 'Ordenes Pendientes', stat: currencyFormatter({currency:"CLP", value:dataCards.suma_pend}), change: dataCards.cantidad_pend, estado:'0' },
  { name: 'Ordenes Aprobadas', stat: currencyFormatter({currency:"CLP", value:dataCards.suma_aprob}), change: dataCards.cantidad_aprob, estado:'1' },
  { name: 'Ordenes Rechazadas', stat: currencyFormatter({currency:"CLP", value:dataCards.suma_rech}), change: dataCards.cantidad_rech, estado:'6' },
];

const pages = [
  { name: 'Inet', href: '/dashboard', current: false },
  { name: 'Ordenes de Compra', href: '#', current: true },
]

const columns = [
  columnHelper.accessor("AdqOdNum", { cell: (info) => <span>{info.getValue()}</span>, header: "OC (Nro. Interno)" }),
  columnHelper.accessor("AdqOdGlo", { cell: (info) => <span>{info.getValue()}</span>, header: "Glosa" }),
  columnHelper.accessor("AdqOdTot", { cell: (info) => <span>{info.getValue()}</span>, header: "Monto Bruto" }),
  columnHelper.accessor("AdqOdPvNo", { cell: (info) => <span>{info.getValue()}</span>, header: "Proveedor" }),
  columnHelper.accessor("AdqOdFcIn", { cell: (info) => <span>{info.getValue()}</span>, header: "Creada en" }),
  columnHelper.accessor("AdqOdEst", { cell: (info) => <span>{info.getValue()}</span>, header: "Estado" })
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

return (
  <>

    <div>
      {success && (
        <SuccessNotification 
          message={success}
          onDismiss = {handleDismiss}
          showSuccess={showSuccess}
        />
      )}
      {error && (
        <ErrorNotifications 
          message={error} 
          onDismiss={handleDismissError}
          showErrors={showErrors}
        />
      )}
    </div>

    <BreadCrumbs
      pages={pages}
    />

    {loading && <LoadingSpinner />}

    {/* Cards */}
    <dl className="mt-5 lg:col-start-3 lg:row-end-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:grid-cols-4 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:divide-x md:divide-y-0">
      {stats.map((item) => (
        <div key={item.name} className="px-4 py-5 sm:p-6">
          <dt className="text-base font-normal text-gray-600">{item.name} <div
              className={classNames(
                'bg-green-100 text-green-800',
                'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
              )}
            >
              {item.change}
            </div></dt>
          
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl text-indigo-600">
              {item.stat}
            </div>
            
            <button
              className="ml-2 text-sm font-medium text-gray-500"
              onClick={() => loadProducts(item.estado)} 
            >
              Filtrar
            </button>
          </dd>
        </div>
      ))}
    </dl>

    {/* table */}
    <TanStackTable dataOc={dataOc} columns={columns} onAccept={onAccept} onReject={onReject} onView={onView} estadoFiltro={estadoFiltro} onDetail={onDetail} />

    {/* Slide over */}
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-0 shadow-xl">
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Detalle Orden de Compra
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div>
                        <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                          <div className="flex justify-between py-3 text-sm font-medium">
                          <dd className="text-gray-900">
                            OC Número {dataOcR.AdqOdNum} Compra de Activo
                            
                          </dd>
                          <span 
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                dataOcR.AdqOdEst === 0 ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20" :
                                dataOcR.AdqOdEst === 1 ? "bg-green-50 text-green-700 ring-green-600/20" :
                                dataOcR.AdqOdEst === 2 ? "bg-blue-50 text-blue-700 ring-blue-600/20" :
                                dataOcR.AdqOdEst === 3 ? "bg-orange-50 text-orange-700 ring-orange-600/20" :
                                dataOcR.AdqOdEst === 4 ? "bg-teal-50 text-teal-700 ring-teal-600/20" :
                                dataOcR.AdqOdEst === 5 ? "bg-gray-50 text-gray-700 ring-gray-600/20" :
                                dataOcR.AdqOdEst === 6 ? "bg-red-50 text-red-700 ring-red-600/20" : 
                                "bg-purple-50 text-purple-700 ring-purple-600/20"
                              }`}
                              style={{ float: "right" }}
                            >
                              {dataOcR.AdqOdEst === 0 ? "Pendiente" :
                              dataOcR.AdqOdEst === 1 ? "Aprobada" :
                              dataOcR.AdqOdEst === 2 ? "Emitida" :
                              dataOcR.AdqOdEst === 3 ? "Semicumplida" :
                              dataOcR.AdqOdEst === 4 ? "Cumplida" :
                              dataOcR.AdqOdEst === 5 ? "Nula" :
                              dataOcR.AdqOdEst === 6 ? "Rechazada" :
                              "Estado desconocido"}
                            </span>
                          </div>
                        </dl>
                        <h3 className="mt-10 font-medium text-gray-900">Información</h3>
                        <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Solicitante</dt>
                          <dd className="text-gray-900">{dataOcR.solicitante_nombre}</dd>
                        </div>
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Proveedor</dt>
                          <dd className="text-gray-900">{dataOcR.AdqOdPvNo}</dd>
                        </div>
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Fecha de Inicio</dt>
                          <dd className="text-gray-900">{dataOcR.AdqOdFcIn? format(new Date(dataOcR.AdqOdFcIn), 'dd-MM-yyyy'):''}</dd>
                        </div>
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Monto Bruto</dt>
                          <dd className="text-gray-900">{currencyFormatter({currency:"CLP", value: dataOcR.AdqOdTot})}</dd>
                        </div>
                        </dl>

                        <div className="mt-10 lg:col-start-3">
                          <h2 className="text-sm font-semibold leading-6 text-gray-900">Actividad</h2>
                          <ul role="list" className="mt-6 space-y-6">
                            {dataOcR?.aprobadores?.map((activityItem, activityItemIdx) => (
                              <React.Fragment key={`${activityItem.AdqOAPeCo}fragmento${activityItemIdx}`}>
                                <li key={`${activityItem.AdqOAPeCo}general${activityItemIdx}`} className="relative flex gap-x-4">
                                    <div
                                        className={classNames(
                                            activityItemIdx === dataOcR.aprobadores - 1 ? 'h-6' : '-bottom-6',
                                            'absolute left-0 top-0 flex w-6 justify-center'
                                        )}
                                    >
                                        <div className="w-px bg-gray-200" />
                                    </div>
                                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                                    {activityItem.AdqOAAR === 1 ? (
                                        <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    ) : activityItem.AdqOAAR === 2 ? (
                                        <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    ) : (
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-300 ring-1 ring-gray-300" />
                                    )}
                                    </div>
                                    <div className="flex items-center">
                                        <p className="mr-2 ml-2 py-0.5 text-xs leading-5 text-gray-500">
                                            <span className="font-medium text-gray-900">{activityItem.PerNom}</span>{' '}
                                            {activityItem.AdqOAAR === 0 ? "Pendiente de aprobación" :
                                            activityItem.AdqOAAR === 1 ? "Aprobó" :
                                            activityItem.AdqOAAR === 2 ? "Rechazó" :
                                            activityItem.AdqOAAR === 3 ? "Asumido" :
                                            "Estado desconocido"} 
                                        </p>
                                        <p className='mr-1 py-0.5 text-xs leading-5 font-medium text-gray-900'>Nivel {activityItem.AdqOAPri}</p>
                                        {activityItem.usuario === 1 ? (
                                        <StarIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                                        ):""}
                                    </div>
                                    <time
                                      dateTime={format(new Date(activityItem.AdqOAFch), 'dd-MM-yyyy')}
                                      className="flex-none py-0.5 text-xs leading-5 text-gray-500 ml-auto mt-auto"
                                    >
                                      {format(new Date(activityItem.AdqOAFch), 'dd-MM-yyyy')}
                                    </time>
                                </li>
                                
                                {activityItem.usuario === 1 && comentario && comentario.trim() !== "" && (
                                  <li key={`${activityItem.AdqOAPeCo}comentario${activityItemIdx}`} className="relative flex gap-x-4">
                                      <div
                                          className={classNames(
                                              activityItemIdx === dataOcR.aprobadores - 1 ? 'h-6' : '-bottom-6',
                                              'absolute left-0 top-0 flex w-6 justify-center'
                                          )}
                                      >
                                          <div className="w-px bg-gray-200" />
                                      </div>

                                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                                          activityItem.AdqOAAR === 0 ? 'bg-purple-500' :
                                          activityItem.AdqOAAR === 1 ? 'bg-green-500' :
                                          activityItem.AdqOAAR === 2 ? 'bg-red-500' :
                                          activityItem.AdqOAAR === 3 ? 'bg-yellow-500' : ''
                                      } text-xs relative mt-3 h-6 w-6 flex items-center justify-center rounded-full text-white`}>{activityItem.PerNom.charAt(0)}</span>
                                      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                                        <div className="flex justify-between gap-x-4">
                                          <div className="py-0.5 text-xs leading-5 text-gray-500">
                                            <span className="font-medium text-gray-900">{activityItem.PerNom}</span> ha comentado
                                          </div>
                                        </div>
                                        <p className="text-sm leading-6 text-gray-500">{comentario}</p>
                                      </div>
                                  </li>
                                )}
                                {activityItem.usuario !== 1 && activityItem.AdqOAGl3 && activityItem.AdqOAGl3.trim() !== "" && (
                                  <li key={`${activityItem.AdqOAPeCo}comentario${activityItemIdx}`} className="relative flex gap-x-4">
                                      <div
                                          className={classNames(
                                              activityItemIdx === dataOcR.aprobadores - 1 ? 'h-6' : '-bottom-6',
                                              'absolute left-0 top-0 flex w-6 justify-center'
                                          )}
                                      >
                                          <div className="w-px bg-gray-200" />
                                      </div>

                                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                                          activityItem.AdqOAAR === 0 ? 'bg-purple-500' :
                                          activityItem.AdqOAAR === 1 ? 'bg-green-500' :
                                          activityItem.AdqOAAR === 2 ? 'bg-red-500' :
                                          activityItem.AdqOAAR === 3 ? 'bg-yellow-500' : ''
                                      } text-xs relative mt-3 h-6 w-6 flex items-center justify-center rounded-full text-white`}>{activityItem.PerNom.charAt(0)}</span>
                                      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                                        <div className="flex justify-between gap-x-4">
                                          <div className="py-0.5 text-xs leading-5 text-gray-500">
                                            <span className="font-medium text-gray-900">{activityItem.PerNom}</span> ha comentado
                                          </div>
                                        </div>
                                        <p className="text-sm leading-6 text-gray-500">{activityItem.usuario === 1 ? comentario: activityItem.AdqOAGl3}</p>
                                      </div>
                                  </li>
                                )}
                                {activityItem.AdqOAGl2 && activityItem.AdqOAGl2.trim() !== "" && (
                                  <li key={`${activityItem.AdqOAPeCo}rechazo${activityItemIdx}`} className="relative flex gap-x-4">
                                      <div
                                          className={classNames(
                                              activityItemIdx === dataOcR.aprobadores - 1 ? 'h-6' : '-bottom-6',
                                              'absolute left-0 top-0 flex w-6 justify-center'
                                          )}
                                      >
                                          <div className="w-px bg-gray-200" />
                                      </div>

                                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                                          activityItem.AdqOAAR === 0 ? 'bg-purple-500' :
                                          activityItem.AdqOAAR === 1 ? 'bg-green-500' :
                                          activityItem.AdqOAAR === 2 ? 'bg-red-500' :
                                          activityItem.AdqOAAR === 3 ? 'bg-yellow-500' : ''
                                      } text-xs relative mt-3 h-6 w-6 flex items-center justify-center rounded-full text-white`}>{activityItem.PerNom.charAt(0)}</span>
                                      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                                        <div className="flex justify-between gap-x-4">
                                          <div className="py-0.5 text-xs leading-5 text-gray-500">
                                            <span className="font-medium text-gray-900">{activityItem.PerNom}</span> ha comentado
                                          </div>
                                        </div>
                                        <p className="text-sm leading-6 text-gray-500">{activityItem.AdqOAGl2}</p>
                                      </div>
                                  </li>
                                )}
                              </React.Fragment>
                            ))}
                          </ul>
                          <div className="mt-6 flex gap-x-3">
                            <Image className="h-6 w-6 flex-none bg-gray-50" src="/images/inet.png" alt="" width={32} height={32} />
                              <div className="relative flex-auto">
                                <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300">
                                    <label htmlFor="comentario-actividad" className="sr-only">
                                        Agrega tu comentario
                                    </label>
                                    <textarea
                                      rows={2}
                                      name="comentario-actividad"
                                      id="comentario-actividad"
                                      className="block w-full resize-none border-0 bg-transparent py-1.5 pl-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                                      placeholder="Agrega tu comentario..."
                                      value={comentarioActividad}
                                      onChange={handleCommentChange}
                                    />
                                    <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 px-3">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
                                            onClick={() => ComentarActividad()}
                                        >
                                            Comentar
                                        </button>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </div>

                        <div className='mb-10'>
                        <h3 className="mt-10 font-medium text-gray-900">Archivos</h3>
                          {dataOcR?.documentos?.map((doc) => (
                            <div className="mt-5" key={doc.AdqAjNom}>
                              <a href='#' onClick={() => decodificarArchivo(doc.AdqAjNum, doc.AdqAjAno, doc.AdqAjMes, doc.AdqAjSec)} className="mt-20 text-xs font-medium text-indigo-700 underline hover:text-indigo-600" title={doc.AdqAjNom}>
                              {/* <a href={doc.url} className="mt-20 text-xs font-medium text-indigo-700 underline hover:text-indigo-600" title={doc.AdqAjNom} target="_blank"> */}
                                {doc.AdqAjNom.length > 40 ? doc.AdqAjNom.slice(0, 37) + '...' : doc.AdqAjNom}
                                <DocumentArrowDownIcon className="w-4 h-4 inline-block ml-1" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    {/* Slide detalle oc */}
    <Transition.Root show={openOcD} as={Fragment}>
      <Dialog className="relative z-40" onClose={setOpenOcD}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-7xl pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >

                        
                <Dialog.Panel className="pointer-events-auto w-screen">
                  <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Detalle Orden de Compra #{dataOcR.AdqOdNum}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpenOcD(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-x-auto">
                      <div className="overflow-x-auto">
                        <div className="bg-gray-50 -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                          <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                            <div className="sm:pr-4">
                              <dt className="inline text-gray-500">Fecha:</dt>
                              <dd className="inline text-gray-700">
                                <time dateTime={dataOcR.AdqOdFcIn ? format(new Date(dataOcR.AdqOdFcIn), 'dd-MM-yyyy') : ''}>
                                  {dataOcR.AdqOdFcIn ? format(new Date(dataOcR.AdqOdFcIn), 'dd-MM-yyyy') : ''}
                                </time>
                              </dd>
                            </div>
                            <div className="mt-3 sm:pr-4">
                              <dt className="inline text-gray-500">Solicitante:</dt>
                              <dd className="inline text-gray-700">{dataOcR.solicitante_nombre}</dd>
                            </div>
                            <div className="mt-3 sm:pr-4">
                              <dt className="inline text-gray-500">Proveedor:</dt>
                              <dd className="inline text-gray-900">{dataOcR.AdqOdPvNo}</dd>
                            </div>
                            <div className="mt-3 sm:pr-4">
                              <dt className="inline text-gray-500">Forma de Pago:</dt>
                              <dd className="inline text-gray-900">{dataOcR.forma_pago}</dd>
                            </div>
                          </dl>
                          <table className="mt-16 w-full min-w-full whitespace-nowrap text-left text-sm leading-6">
                            <colgroup>
                              <col className="w-3/6" />
                              <col className="w-3/6" />
                              <col className="w-1/6" />
                              <col className="w-1/6" />
                              <col className="w-1/6" />
                              <col className="w-1/6" />
                              <col className="w-1/6" />
                              <col className="w-1/6" />
                            </colgroup>
                            <thead className="border-b border-gray-200 text-gray-900">
                              <tr>
                                <th scope="col" className="px-0 py-3 font-semibold">Código</th>
                                <th scope="col" className="hidden py-3 pl-8 pr-0 font-semibold sm:table-cell">Producto/Servicio</th>
                                <th scope="col" className="hidden py-3 pl-8 pr-0 font-semibold sm:table-cell">Fecha Entrega</th>
                                <th scope="col" className="hidden py-3 pl-8 pr-0 font-semibold sm:table-cell">Stock Actual</th>
                                <th scope="col" className="hidden py-3 pl-8 pr-0 font-semibold sm:table-cell">Stock por recibir</th>
                                <th scope="col" className="py-3 pl-8 pr-0 text-right font-semibold sm:table-cell">Cantidad</th>
                                <th scope="col" className="py-3 pl-8 pr-0 text-right font-semibold">Precio Unitario</th>
                                <th scope="col" className="py-3 pl-8 pr-0 text-right font-semibold">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataOcR?.lineas?.map((linea) => (
                                <tr key={linea.AdqOlLin} className="border-b border-gray-100">
                                  <td className="max-w-0 px-0 py-5 align-top">
                                    <div className="truncate font-medium text-gray-900">{linea.PrdCod}</div>
                                  </td>
                                  <td className="hidden py-5 pl-8 pr-0 align-top tabular-nums text-gray-700 sm:table-cell">
                                    {linea.producto}
                                  </td>
                                  <td className="hidden py-5 pl-8 pr-0 align-top tabular-nums text-gray-700 sm:table-cell">
                                    {linea.AdqOlFcEn ? format(new Date(linea.AdqOlFcEn), 'dd-MM-yyyy') : ''}
                                  </td>
                                  <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                                    {linea.actual}
                                  </td>
                                  <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                                    {linea.recibir}
                                  </td>
                                  <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                                    {linea.AdqOlQCom}
                                  </td>
                                  <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                                    {currencyFormatter({ currency: "CLP", value: linea.AdqOlVal })}
                                  </td>
                                  <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                                    {currencyFormatter({ currency: "CLP", value: linea.AdqOlPrMo })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              {dataOcR.AdqOdTNL===0?'':
                                <tr>
                                  
                                  <th
                                    scope="row"
                                    colSpan={tamano}
                                    className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                  >
                                    Neto Líneas
                                  </th>
                                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                    {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTNL })}
                                  </td>
                                </tr>
                              }
                              {dataOcR.AdqOdTDe===0?'':
                                <tr>
                                  <th
                                    scope="row"
                                    colSpan={tamano}
                                    className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                  >
                                    Total Descuentos
                                  </th>
                                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                    {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTDe })}
                                  </td>
                                </tr>
                              }
                              {dataOcR.AdqOdTAf===0?'':
                                <tr>
                                  <th
                                    scope="row"
                                    colSpan={tamano}
                                    className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                  >
                                    Afecto
                                  </th>
                                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                    {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTAf })}
                                  </td>
                                </tr>
                              }
                              {dataOcR.AdqOdTEx===0?'':
                                <tr>
                                  <th
                                    scope="row"
                                    colSpan={tamano}
                                    className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                  >
                                    Exento
                                  </th>
                                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                    {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTEx })}
                                  </td>
                                </tr>
                              }
                              {dataOcR.AdqOdTIm===0?'':
                                <tr>
                                  <th
                                    scope="row"
                                    colSpan={tamano}
                                    className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                  >
                                    Total Impuestos
                                  </th>
                                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                    {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTIm })}
                                  </td>
                                </tr>
                              }
                              {dataOcR.AdqOdTIv===0?'':
                                <tr>
                                  <th
                                    scope="row"
                                    colSpan={tamano}
                                    className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                  >
                                    Iva
                                  </th>
                                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                    {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTIv })}
                                  </td>
                                </tr>
                              }
                              <tr>
                                <th
                                  scope="row"
                                  colSpan={tamano}
                                  className="pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                >
                                  Total
                                </th>
                                <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                  {currencyFormatter({ currency: "CLP", value: dataOcR.AdqOdTot })}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>


    
    {/* Dialog */}
    <Transition.Root show={opend} as={Fragment}>
      <Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setOpenD}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="mb-5 sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Rechazar Orden de Compra
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                          ¿Estás seguro de que deseas rechazar la orden de compra?. Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
                <Input
                  labelName='Observación'
                  value={observation}
                  handleInputChange={(e) => handleObservationChange(e, 'username')}
                  className="text-sm mt-2 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
                />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    // onClick={() => setOpenD(false)}
                    onClick={() => RechazarOC()}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpenD(false)}
                    ref={cancelButtonRef}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    <Transition.Root show={opena} as={Fragment}>
      <Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setOpenA}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Aprobar Orden de Compra
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas aprobar la orden de compra?. Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => AprobarOC()}
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpenA(false)}
                    ref={cancelButtonRef}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    
    
  </>
);
};

export default ProductsPage;
