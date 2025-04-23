import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../utilities/apirest";

export default function Mostrador({cart,setCart}) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { elemento } = state;
    const handleAddToCart = (e) => {
        e.preventDefault(); 
        setCart(prev => [...prev, elemento]);
    };
    return (
        <div class="bg-white">
            <div class="pt-6">
                <nav aria-label="Breadcrumb">
                    <ol role="list" class="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <li>
                            <div class="flex items-center">
                                <a href="#" class="mr-2 text-sm font-medium text-gray-900">Men</a>
                                <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                </svg>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <a href="#" class="mr-2 text-sm font-medium text-gray-900">Clothing</a>
                                <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                </svg>
                            </div>
                        </li>

                        <li class="text-sm">
                            <a href="#" aria-current="page" class="font-medium text-gray-500 hover:text-gray-600">{elemento.Titulo}</a>
                        </li>
                    </ol>
                </nav>

                <div class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                    <img src={API_URL + "storage/photos/" + elemento.Imagen} alt="Two each of gray, white, and black shirts laying flat." class="hidden size-full rounded-lg object-cover lg:block" />
                    <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                        <img src={API_URL + "storage/photos/" + elemento.Imagen} alt="Model wearing plain black basic tee." class="aspect-3/2 w-full rounded-lg object-cover" />
                        <img src={API_URL + "storage/photos/" + elemento.Imagen} alt="Model wearing plain gray basic tee." class="aspect-3/2 w-full rounded-lg object-cover" />
                    </div>
                    <img src={API_URL + "storage/photos/" + elemento.Imagen} alt="Model wearing plain white basic tee." class="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto" />
                </div>

                <div class="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                    <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{elemento.Titulo}</h1>
                    </div>

                    <div class="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 class="sr-only">Product information</h2>
                        <p class="text-3xl tracking-tight text-gray-900">${elemento.Precio}</p>

                        <div class="mt-6">
                            <h3 class="sr-only">Reviews</h3>
                            <div class="flex items-center">
                                <div class="flex items-center">
                                    <svg class="size-5 shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
                                    </svg>
                                    <svg class="size-5 shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
                                    </svg>
                                    <svg class="size-5 shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
                                    </svg>
                                    <svg class="size-5 shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
                                    </svg>
                                    <svg class="size-5 shrink-0 text-gray-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <p class="sr-only">4 out of 5 stars</p>
                                <a href="#" class="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">117 reviews</a>
                            </div>
                        </div>

                        <form class="mt-10" onSubmit={handleAddToCart}>
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Momento del Día</h3>

                                <fieldset aria-label="Choose a color" class="mt-4">
                                    <div class="flex items-center gap-x-6">
                                        <label aria-label="Morning" class="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-hidden">
                                            <input type="radio" name="color-choice" value="Morning" class="sr-only" />
                                            <i class="fas fa-sun text-yellow-500 text-2xl"></i>
                                        </label>

                                        <label aria-label="Afternoon" class="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-hidden">
                                            <input type="radio" name="color-choice" value="Afternoon" class="sr-only" />
                                            <i class="fas fa-moon text-blue-500 text-2xl"></i>
                                        </label>
                                    </div>
                                </fieldset>
                            </div>


                            <div class="mt-10">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-sm font-medium text-gray-900">Personas</h3>
                                </div>

                                <fieldset aria-label="Choose a size" class="mt-4">
                                    <div class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                        <label class="group relative flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-medium text-gray-900 uppercase shadow-xs hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
                                            <input type="radio" name="size-choice" value="XS" class="sr-only" />
                                            <span>1</span>
                                            <span class="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                        </label>
                                        <label class="group relative flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-medium text-gray-900 uppercase shadow-xs hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
                                            <input type="radio" name="size-choice" value="S" class="sr-only" />
                                            <span>2</span>
                                            <span class="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                        </label>
                                        <label class="group relative flex cursor-not-allowed items-center justify-center rounded-md border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-200 uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
                                            <input type="radio" name="size-choice" value="XXS" class="sr-only" />
                                            <span>3</span>
                                            <span aria-hidden="true" class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                                <svg class="absolute inset-0 size-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                                                    <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                                                </svg>
                                            </span>
                                        </label>
                                        <label class="group relative flex cursor-not-allowed items-center justify-center rounded-md border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-200 uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
                                            <input type="radio" name="size-choice" value="XXS" class="sr-only" />
                                            <span>4</span>
                                            <span aria-hidden="true" class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                                <svg class="absolute inset-0 size-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                                                    <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                                                </svg>
                                            </span>
                                        </label>

                                    </div>
                                </fieldset>
                            </div>

                            <button type="submit" class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden" >Añadir al Carrito</button>
                        </form>
                    </div>

                    <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">

                        <div>
                            <h3 class="sr-only">Description</h3>

                            <div class="space-y-6">
                                <p class="text-base text-gray-900">{elemento.Descripcion}</p>
                            </div>
                        </div>

                        <div class="mt-10">
                            <h3 class="text-sm font-medium text-gray-900">Highlights</h3>

                            <div class="mt-4">
                                <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                                    <li class="text-gray-400 flex items-center">
                                        <i class="fas fa-sun text-yellow-500 mr-2"></i>
                                        <span class="text-gray-600">Te lo Pasarás de Lujo</span>
                                    </li>
                                    <li class="text-gray-400 flex items-center">
                                        <i class="fas fa-money-check-alt text-green-500 mr-2"></i>
                                        <span class="text-gray-600">100% Reembolsable</span>
                                    </li>
                                    <li class="text-gray-400 flex items-center">
                                        <i class="fas fa-shield-alt text-blue-500 mr-2"></i>
                                        <span class="text-gray-600">Portal de compra 100% seguro</span>
                                    </li>
                                    <li class="text-gray-400 flex items-center">
                                        <i class="fas fa-times-circle text-red-500 mr-2"></i>
                                        <span class="text-gray-600">Cancela cuando Quieras</span>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div class="mt-10">
                            <h2 class="text-sm font-medium text-gray-900">Detalles</h2>

                            <div class="mt-4 space-y-6">
                                <p class="text-sm text-gray-600">
                                    Disfruta de tu día en la playa con nuestros artículos de alquiler, pensados para ofrecerte la máxima comodidad y funcionalidad. Todos nuestros productos están cuidadosamente seleccionados para adaptarse a tus necesidades, ya sea que busques relajarte bajo el sol, practicar actividades acuáticas o disfrutar de un paseo junto al mar. Reserva el tuyo con antelación y asegúrate de tener lo mejor para tu experiencia costera.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}