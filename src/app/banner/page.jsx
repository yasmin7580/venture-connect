"use client"

import { Button } from '@heroui/react';
import React from 'react';
import { motion } from "motion/react"
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Banner = () => {
    return (
        <div>

            <div>

                <div className="flex min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[750px] xl:min-h-[860px] items-center bg-[url('/banner.png')] bg-center bg-no-repeat bg-cover px-3 sm:px-5 md:px-8 lg:px-12">

                    <div className='w-full max-w-4xl'>

                        <div className='space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5'>

                            <motion.div

                                initial={{ y: 40, opacity: 0 }}

                                animate={{ y: 0, opacity: 1 }}

                                transition={{ duration: .6 }}

                                whileInView={{ once: true }}

                                className="hidden sm:block"

                            >

                                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white'>
                                    Build Your People.
                                </h1>

                                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white'>
                                    Build Something
                                    <span className='text-[#00d3f2]'> Great</span>
                                </h1>

                            </motion.div>


                            <motion.p

                                initial={{ y: 40, opacity: 0 }}

                                animate={{ y: 0, opacity: 1 }}

                                transition={{ duration: .6, delay: .1 }}

                                whileInView={{ once: true }}

                                className='hidden sm:block max-w-xl md:max-w-lg lg:max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold leading-5 sm:leading-6 md:leading-7 lg:leading-8 text-gray-300'

                            >

                                VentureConnect connects founders with talented collaborators to build amazing startups together. Post opportunities, discover ideas and build your dream teams.

                            </motion.p>

                        </div>


                        <motion.div

                            initial={{ y: 40, opacity: 0 }}

                            animate={{ y: 0, opacity: 1 }}

                            transition={{ duration: .6, delay: .2 }}

                            whileInView={{ once: true }}

                            className='mt-4 sm:mt-5 md:mt-6 flex flex-row items-center gap-2 sm:gap-3'

                        >

                            <Link
                                href={"/opportunities"}
                                className='flex h-9 sm:h-10 md:h-11 items-center justify-center gap-1 sm:gap-2 rounded-md px-3 sm:px-4 md:px-5 text-white secondary-bg text-xs sm:text-sm md:text-base'
                            >
                                Explore opportunities

                                <ArrowRight
                                    size={14}
                                    className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                                />
                            </Link>


                            <Button
                                className='background h-9 sm:h-10 md:h-11 rounded-md px-3 sm:px-4 md:px-5 flex items-center justify-center text-xs sm:text-sm md:text-base'
                            >
                                How it works
                            </Button>

                        </motion.div>


                    </div>

                </div>

            </div>

        </div>
    );
};

export default Banner;