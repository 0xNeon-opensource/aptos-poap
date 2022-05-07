/* This example requires Tailwind CSS v2.0+ */
import { InboxIcon, SparklesIcon } from '@heroicons/react/outline'

export default function Success() {
    return (
        <div className="relative bg-white pt-32 pb-32 overflow-hidden">
            <div className="relative">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                    <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                        <div>
                            <div>
                                <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                                    <SparklesIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                    Enjoy your POAP!
                                </h2>
                                <p className="mt-4 text-lg text-gray-500">
                                    You now have proof of attending this hackathon, stored immutably on the Aptos blockchain.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 lg:mt-0">
                        <div className="pl-4 sm:pl-6 lg:px-0 lg:m-0 lg:relative lg:h-full">
                            <img
                                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                src="https://arweave.net/C8EqQ5Qft_okdR2_eZbnrVO25YxFPP4ZhVzWjwzxpHc"
                                alt="Inbox user interface"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
