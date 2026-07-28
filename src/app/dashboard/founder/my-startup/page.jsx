"use client"
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plug, Plus, PlusIcon, SquarePen, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyStartup = () => {
    const axiosSecure = useAxiosSecure()
    const { data: session } = authClient.useSession();
    const founderName = session?.user?.name
    const userEmail = session?.user?.email



    const { data, isLoading, refetch } = useQuery({
        queryKey: ["my-startup"],
        queryFn: async () => {
            const result = await axios.get(`https://venture-connect-server-kappa.vercel.app/startups?userEmail=${userEmail}`)
            return result.data?.[0] || false
        },
        enabled: userEmail ? true : false
    })
    console.log(data)
    // refetch is a function help you to fetch the api again without reloading




    // const imgInputRef = useRef()

    // value, value
    const industries = [
        "Technology",
        "Artificial Intelligence",
        "Software Development",
        "HealthTech",
        "Educational",
        "E-commerce",

        "Cyber Security",
        "Gaming",
        "Media & Entertainment",
        "Marketing & Advertising",
        "Travel & Tourism",
        "Real Estate",
        "Logistics & Transportation",
        "Fashion & Lifestyle",
        "Robotics",
        "Other"
    ];
    const fundingStages = [
        "Idea Stage",
        "Pre-Seed",
        "Seed",
        "Series A",
        "Series B",
        "Series C",
        "Bootstrapped"
    ];
    const [image, setImage] = useState() //
    const [imageObj, setImageObj] = useState()
    const handleImage = (e) => {
        console.log('image function working')
        // console.log(e.target.files[0])
        const file = e.target.files[0]  // binary
        if (!file) return

        const formdata = new FormData()
        formdata.append('image', file)
        const url = URL.createObjectURL(formdata.get("image")) // create a url form an obj 

        // console.log(url)
        setImage(url)
        setImageObj(formdata)

    }
    // console.log(image)

    // fetch, axios

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(result => {
            if (result.isConfirmed) {
                toast.promise(
                    async () => {
                        const { data: result } = await axios.delete(`https://venture-connect-server-kappa.vercel.app/startups?userEmail=${userEmail}`)
                        if (result.deletedCount !== 1) {
                            console.log(result)
                            throw new Error("Delete failed")
                        }
                    },
                    {
                        loading: "Deleting",
                        success: async () => {
                            setImage()
                            await refetch()
                            return "Deleted"
                        },
                        error: "Failed to Delete"
                    }
                )
            }
        })
        console.log("delete")

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!image) {
            toast.error("Please Select logo")
        }
        const formData = new FormData(e.target) // formData
        formData.delete("image") // delete image from formData
        const theData = await axios.post("https://api.imgbb.com/1/upload?key=46cef828a7aeed48196e6dc399220d34", imageObj)
        console.log(theData.data.data.url)
        formData.append("image", theData.data.data.url)
        formData.append("userEmail", userEmail)
        formData.append("status", "pending")
        formData.append("founderName", founderName)


        const data = Object.fromEntries(formData.entries())
        console.log(data)




        toast.promise(
            axiosSecure.post("https://venture-connect-server-kappa.vercel.app/startups", data)
            , {
                loading: "Creating Startup Profile",
                success: () => {
                    refetch()
                    e.target.reset()
                    return "Created profile successfully"
                },
                error: "Failed to create profile"
            }
        )

    }

    const imageElement = useRef()
    // ref.current
    // modal related code
    const modalElement = useRef()

    const handleEdit = async (e) => {
        e.preventDefault()



        // const formData = new FormData(e.target) // formData
        // formData.delete("image") // delete image from formData
        // const theData = await axios.post("https://api.imgbb.com/1/upload?key=46cef828a7aeed48196e6dc399220d34", imageObj)
        // console.log(theData.data.data.url)
        // formData.append("image", theData.data.data.url)
        // formData.append("userEmail", userEmail)
        // formData.append("status", "pending")


        // const data = Object.fromEntries(formData.entries())
        // console.log(data)

        const form = e.target
        const values = ["name", "email", "industry", "fundingStage", "description"]
        let formData = {}
        values.forEach((item) => {
            formData[item] = form[item].value
        })
        if (image) {
            const theData = await axios.post("https://api.imgbb.com/1/upload?key=46cef828a7aeed48196e6dc399220d34", imageObj)
            formData.image = theData.data.data.url

        }
        else {

            formData.image = data.image
        }
        modalElement.current.close()
        toast.promise(
            axios.patch(`https://venture-connect-server-kappa.vercel.app/startup/${data._id}`, formData),
            {
                loading: "Updating Data",
                success: () => {
                    refetch()
                    return "Updated data successfully"
                },
                error: "Update failed"
            }
        )

        console.log(formData)







    }


    // const modalImage = 
    return (
        <div>
            <Toaster />
            <div className='p-9 '>

                {isLoading && <div className='flex justify-center p-8'><span className="loading loading-spinner text-success"></span></div>}
                <div className={`border max-w-2xl w-full p-7 rounded-md ${data || isLoading ? "hidden" : ""}`}>
                    <h1 className='text-white'>StartUp Profile</h1>
                    <form onSubmit={handleSubmit} className='text-black'>
                        <div className=''>
                            <fieldset className='fieldset'>
                                <label className='label text-white'>Logo Image</label>
                                <input onChange={handleImage} ref={imageElement} type="file" name='image' className='opacity-0 absolute' />
                            </fieldset>
                            <div onClick={() => imageElement.current.click()} className={`relative cursor-pointer  ${image ? "border-none" : "border"} border-dashed border-[#00d3f2] h-20 w-20 overflow-hidden rounded-full flex items-center justify-center `}>
                                {image ?
                                    <Image
                                        src={image} // url  
                                        alt='img'
                                        fill
                                        className='object-cover'
                                    /> :
                                    <PlusIcon color='white'></PlusIcon>
                                }

                            </div>
                        </div>



                        <fieldset className="fieldset *:w-full">
                            <label className="label text-white">Name</label>
                            <input required name='name' type="text" className="input text-black" placeholder="Name" />

                            <label className="label text-white">Email</label>
                            <input required type="email" className="input text-black" placeholder="email" name='email' />
                            <div className='grid grid-cols-2 gap-3'>
                                <div >
                                    <label className="label text-white">Industry</label>
                                    <select required className='select items-start justify-center w-full ' name='industry' defaultValue={""}>
                                        <option value={""} disabled>Select your industry</option>
                                        {
                                            industries.map((industry, index) =>
                                                <option key={index}>{industry}</option>
                                            )
                                        }

                                    </select>
                                </div>

                                <div>

                                    <label className="label text-white">Funding Stage</label>
                                    <select required className='select items-start justify-center w-full' name='fundingStage' defaultValue={""}>
                                        <option value={""} disabled>Select your founding stage</option>


                                        {
                                            fundingStages.map((funding, index) =>
                                                <option value={funding} key={index}>{funding}</option>
                                            )
                                        }
                                    </select>
                                </div>

                            </div>


                            <label className="label text-white">Description</label>
                            <textarea className="textarea text-black placeholder:text-gray-500" placeholder="Description" name='description' ></textarea>

                            <button type='submit' className="btn btn-neutral mt-4">Create Startup</button>
                        </fieldset>
                    </form>
                </div>
                {
                    !isLoading && data &&
                    <div className='max-w-xl border'>
                        <div className='flex p-3 justify-between'>

                            <div>
                                <h1 className='text-white text-2xl'>Startup Profile</h1>
                                <p className=' text-gray-500'>Create and manage startup profile</p>

                            </div>

                        </div>
                        <div className="p-6">
                            <div className="rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#00142c] via-[#082b47] to-[#00142c] shadow-2xl">

                                {/* Top Accent */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-[#00d3f2] via-cyan-300 to-[#ff7904]" />

                                <div className="p-6">

                                    <div className="flex flex-col lg:flex-row gap-6">

                                        {/* Startup Logo */}
                                        <div className="flex justify-center lg:justify-start">
                                            <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-[3px] border-[#00d3f2] shadow-xl shrink-0">
                                                <Image
                                                    src={data.image}
                                                    alt="image"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">

                                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">

                                                <div>
                                                    <h1 className="text-3xl font-bold text-white">
                                                        {data.name}
                                                    </h1>

                                                    <p className="text-gray-400 mt-3 leading-relaxed max-w-2xl">
                                                        {data.description}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize
                            ${data.status === "approved"
                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                            : data.status === "pending"
                                                                ? "bg-[#ff7904]/20 text-[#ffb067] border border-[#ff7904]/40"
                                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                        }`}
                                                >
                                                    {data.status}
                                                </span>

                                            </div>

                                            {/* Tags */}

                                            <div className="flex flex-wrap gap-3 mt-6">

                                                <div className="px-4 py-2 rounded-xl bg-[#00d3f2]/15 border border-[#00d3f2]/30 text-[#00d3f2] font-medium text-sm">
                                                    {data.industry}
                                                </div>

                                                <div className="px-4 py-2 rounded-xl bg-[#ff7904]/15 border border-[#ff7904]/30 text-[#ff7904] font-medium text-sm">
                                                    {data.fundingStage}
                                                </div>

                                            </div>

                                            {/* Buttons */}

                                            <div className="flex flex-col sm:flex-row gap-4 mt-8">

                                                <button
                                                    onClick={() => modalElement.current.showModal()}
                                                    className="btn border-0 rounded-xl bg-[#00d3f2] hover:bg-cyan-400 text-[#00142c] font-bold shadow-lg transition-all duration-300 hover:scale-[1.03]"
                                                >
                                                    <SquarePen size={18} />
                                                    Edit Startup
                                                </button>

                                                <button
                                                    onClick={handleDelete}
                                                    className="btn border-0 rounded-xl bg-[#ff7904] hover:bg-orange-500 text-white font-bold shadow-lg transition-all duration-300 hover:scale-[1.03]"
                                                >
                                                    <Trash2 size={18} />
                                                    Delete Startup
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* <div className='p-4'>
                            <div>

                                {
                                    <div className='flex rounded-md'>

                                        <Image
                                            src={data.image}
                                            alt='image'
                                            width={100}
                                            height={100}
                                            className='object-cover '

                                        />
                                        <div className='p-3 border '>
                                            <h1 className='text-white text-xl'>{data.name}</h1>
                                            <div className='flex gap-3 '>
                                                <p className='text-cyan-900 bg-cyan-50 rounded-md p-1'>{data.industry}</p>

                                                <h1 className='text-orange-700 bg-orange-50 rounded-md p-1'>{data.fundingStage}</h1>
                                                <h1 className='text-blue-900 bg-blue-200 rounded-md p-1'>{data.status}</h1>

                                            </div>
                                            <div>
                                                <p className='text-gray-500'>{data.description}</p>

                                            </div>


                                        </div>

                                    </div>


                                }
                                <div className='flex gap-2 mt-5'>
                                    <button onClick={() => modalElement.current.showModal()} className='btn p-3 border  bg-cyan-200 '>Edit <SquarePen size={16} /></button>
                                    <button onClick={handleDelete} className='btn p-3 border bg-red-400 border-red-600 shadow-none '>Delete <Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div> */}


                    </div>
                }




            </div >
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>open modal</button> */}
            <dialog ref={modalElement} className="modal">
                <div className="modal-box p-0">
                    <div className="modal-action bg-[#00142c] m-0">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white">✕</button>
                        </form>
                    </div>

                    <form onSubmit={handleEdit} className='text-black bg-[#00142c] p-5'>
                        <div className=''>
                            <fieldset className='fieldset'>
                                <label className='label text-white'>Logo Image</label>
                                <input onChange={handleImage} ref={imageElement} type="file" name='image' className='invisible w-0 h-0' />
                            </fieldset>
                            <div onClick={() => imageElement.current.click()} className={`relative cursor-pointer  ${image || data?.image ? "border-none" : "border"} border-dashed border-[#00d3f2] h-20 w-20 overflow-hidden rounded-full flex items-center justify-center `}>
                                {console.log(image, data?.image)}
                                {image || data?.image ?
                                    <Image
                                        src={image ? image : data?.image} // url  
                                        alt='img'
                                        fill
                                        className='object-cover'
                                    /> :
                                    <PlusIcon color='white'></PlusIcon>
                                }

                            </div>
                        </div>



                        <fieldset className="fieldset *:w-full">
                            <label className="label text-white">Name</label>
                            <input required name='name' type="text" className="input text-black" placeholder="Name" defaultValue={data?.name} />

                            <label className="label text-white">Email</label>
                            <input required type="email" className="input text-black" placeholder="email" name='email' defaultValue={data?.email} />
                            <div className='grid grid-cols-2 gap-3'>
                                <div >
                                    <label className="label text-white">Industry</label>
                                    <select required className='select items-start justify-center w-full ' name='industry' defaultValue={data?.industry}>
                                        <option value={""} disabled>Select your industry</option>
                                        {
                                            industries.map((industry, index) =>
                                                <option key={index}>{industry}</option>
                                            )
                                        }

                                    </select>
                                </div>

                                <div>

                                    <label className="label text-white">Funding Stage</label>
                                    <select required className='select items-start justify-center w-full' name='fundingStage' defaultValue={data?.fundingStage}>
                                        <option value={""} disabled>Select your founding stage</option>


                                        {
                                            fundingStages.map((funding, index) =>
                                                <option value={funding} key={index}>{funding}</option>
                                            )
                                        }
                                    </select>
                                </div>

                            </div>


                            <label className="label text-white">Description</label>
                            <textarea className="textarea text-black placeholder:text-gray-500" placeholder="Description" name='description' defaultValue={data?.description}></textarea>


                            <button type='submit' className="btn btn-neutral mt-4 w-full">Save Changes</button>
                        </fieldset>
                    </form>

                </div>

            </dialog>
        </div >
    );
};

export default MyStartup;


