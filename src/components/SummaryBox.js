import { CalendarDaysIcon, CreditCardIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link'

function SummaryBox({ id, app, status, client, dueDate, paymentMethod, link }) {
  return (
    <div key={id} className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
      <dl className="flex flex-wrap">
        <div className="flex-auto pl-6 pt-6">
          <Image src="/images/inet.png" alt="Description of the image" width={32} height={32} />
          <dd className="mt-5 text-base font-semibold leading-6 text-gray-900">{app}</dd>
        </div>
        <div className="flex-none self-end px-6 pt-4">
          <dt className="sr-only">Status</dt>
          <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            {status}
          </dd>
        </div>
        <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
          <dt className="flex-none">
            <span className="sr-only">Client</span>
            <UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
          </dt>
          <dd className="text-sm font-medium leading-6 text-gray-900">{client}</dd>
        </div>
        <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
          <dt className="flex-none">
            <span className="sr-only">Due date</span>
            <CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
          </dt>
          <dd className="text-sm leading-6 text-gray-500">
            <time dateTime={dueDate}>{dueDate}</time>
          </dd>
        </div>
        <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
          <dt className="flex-none">
            <span className="sr-only">Status</span>
            <CreditCardIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
          </dt>
          <dd className="text-sm leading-6 text-gray-500">{paymentMethod}</dd>
        </div>
      </dl>
      <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
        {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          Ir al sitio <span aria-hidden="true">&rarr;</span>
        </a> */}
        <Link
            className="pt-2 text-sm text-blue-500 hover:text-blue-600"
            href={link}
        > Ir al sitio <span aria-hidden="true">&rarr;</span></Link>
      </div>
    </div>
  );
}

export default SummaryBox;
