"use client";

import { authClient } from '@/lib/auth-client';
import { Button, Card, Form } from '@heroui/react';
import axios from 'axios';
import { Eye, EyeClosed, Mail, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function Register() {
    const imgInputRef = useRef()
    const id = useParams()
    console.log(id)
    const router = useRouter()


    // file > obj > url
    const [image, setImage] = useState()
    const [imageUrl, setImageUrl] = useState("")
    const handleImage = (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)
        setImage(formData)
        const url = URL.createObjectURL(formData.get("image")) // convert to url. its need obj
        setImageUrl(url)
    }
    const [visiblePass, setVisiblePass] = useState(false)



    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form) // entries
        formData.delete("image")
        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=46cef828a7aeed48196e6dc399220d34`, image)
        console.log(data.data.url)
        formData.append("image", data.data.url)
        formData.append("role", id.id)
        formData.append('opportunity', 3)


        const newFormData = Object.fromEntries(formData)


        console.log(newFormData)

        const { data: result, error } = await authClient.signUp.email(newFormData)
        if (!error) {
            router.push("/")
        }


        console.log({ result, error })
    }
    const handleGoogleSignIn = async () => {

        await authClient.signIn.social({
            provider: "google"
        })
    }





    return (
        <div className='dark-bg'>

            <div className='p-8'>
                <Card className='bg-white border max-w-2xl mx-auto p-9'>
                    <h1 className='text-3xl font-bold text-center'>Create Account</h1>
                    <p className='text-center text-gray-500 font-semibold text-2xl'>Join Venture Connect Today</p>
                    <form
                        onSubmit={handleSubmit}
                        className='space-y-3'>
                        <div>
                            <label>Profile Image</label>
                            <input onChange={handleImage}

                                ref={imgInputRef}
                                type="file"
                                id='image'
                                name='image'


                                accept='image/*'
                                className='invisible'

                            />
                            <div onClick={() => imgInputRef.current.click()} className={`relative cursor-pointer  ${imageUrl.length === 0 ? "border border-dashed" : ""} border-[#00d3f2] h-20 w-20 overflow-hidden rounded-full flex items-center justify-center `}>
                                {imageUrl ?
                                    <Image
                                        src={imageUrl}
                                        alt='image'

                                        fill

                                        className=' object-cover bg-cover'
                                    />
                                    :
                                    <Plus size={30} className='text' />

                                }

                            </div>

                        </div>
                        <div>
                            <label>Full Name</label>
                            <input type="text"
                                name='name'
                                placeholder='Enter your name'
                                className='w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#00d3f2]'

                            />

                            <p className="text-red-500 text-sm mt-1">
                            </p>

                        </div>



                        <div>
                            <label>Email</label>
                            <input type="email"
                                name='email'

                                placeholder='Enter your Email'
                                className='w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#00d3f2]'

                            />

                        </div>








                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div>

                                <div className="flex items-center border rounded-lg mt-2 px-3 focus-within:ring-2 focus-within:ring-[#00d3f2]">
                                    <Mail size={20} className="text-gray-400" />
                                    <input name="password" type={visiblePass ? "text" : "password"} placeholder="Enter your password" className="w-full px-3 py-3 outline-none" />
                                    <button type="button" onClick={() => setVisiblePass(!visiblePass)}>

                                        {visiblePass ? <Eye /> :
                                            <EyeClosed />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type='submit'
                            className="w-full dark-bg py-5"
                        >Create Account</Button>

                    </form>
                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-gray-400 text-sm">OR</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>
                    <button onClick={handleGoogleSignIn} className="w-full border border-gray-200 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                        <FcGoogle />
                        Continue with Google
                    </button>

                    <h1 className="text-center mt-5 text-sm sm:text-base">

                        Already have an account ?

                        <Link
                            className="text-cyan-500 ml-1"
                            href={"/login"}
                        >
                            Login
                        </Link>

                    </h1>



                </Card>
            </div>


        </div >
    );
};

// export default RegisterPage;