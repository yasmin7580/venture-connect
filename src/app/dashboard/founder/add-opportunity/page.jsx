"use client"

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";


const PostTeamRequirements = () => {

    const { data: session } = authClient.useSession()
    const userEmail = session?.user?.email


    const workTypes = [
        "Remote",
        "On-site",
        "Hybrid",
        "Flexible",
        "Part-time Remote",
        "Full-time Remote",
        "Internship"
    ];


    const commitmentLevels = [
        "Full-time",
        "Part-time",
        "Freelance",
        "Contract",
        "Internship",
        "Volunteer",
        "Co-founder"
    ];




    const { data: startup, isLoading } = useQuery({
        queryKey: ['isStartup'],
        queryFn: async () => {
            const result = await axios.get(`https://venture-connect-server-kappa.vercel.app/isStartup?userEmail=${userEmail}`)
            return result.data
        },
        enabled: !!userEmail
    })




    const { data: user, isLoading: isLoading2, refetch } = useQuery({

        queryKey: ["user"],

        queryFn: async () => {

            const result = await axios.get(`https://venture-connect-server-kappa.vercel.app/user?email=${userEmail}`)

            return result.data
        },

        enabled: userEmail ? true : false

    })




    if (isLoading || isLoading2) {

        return (

            <div className="flex items-center justify-center min-h-screen">

                <span className="loading loading-spinner text-success"></span>

            </div>

        )

    }





    const isStartup = typeof startup === "string" ? false : true





    const handlePostOpportunity = (e) => {

        e.preventDefault()


        if (user?.opportunity > 2) {

            return

        }


        const formData = new FormData(e.target)


        formData.append("startupName", startup.name)

        formData.append("userEmail", userEmail)


        const data = Object.fromEntries(formData.entries())


        toast.promise(

            async () => {

                const result = await axios.post(`https://venture-connect-server-kappa.vercel.app/opportunity?email=${userEmail}`, data)

                return result.data

            },

            {

                loading: "Posting Opportunity",

                success: async () => {

                    await refetch()

                    return "Posted Successfully"

                },

                error: "Failed to post opportunity"

            }

        )
        e.target.reset()

    }





    return (


        <div className="w-full">


            <Toaster />



            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">


                <h1 className='text-white text-xl'>
                    Post Team Requirement
                </h1>



                {

                    user?.email && user.plan === "free" &&


                    <h1 className="text-[#ff7900]">

                        {(3 - user?.opportunity)}/3 Opportunities

                    </h1>

                }


            </div>





            {

                isStartup ?



                    <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">





                        {/* Form */}


                        <div className="w-full bg-[#001836] p-4 sm:p-5 shadow-2xl">


                            <div className="card-body p-0 sm:p-4">


                                <form

                                    onSubmit={handlePostOpportunity}

                                    className={`[&_input]:bg-white/10 [&_select]:bg-[#001228] ${!isStartup ? "hidden" : ""}`}

                                >



                                    <fieldset className="fieldset">



                                        <label className="label text-white">
                                            Role Title
                                        </label>



                                        <input

                                            type="text"

                                            name="title"

                                            className="input border text-white w-full"

                                            placeholder="Role Title"

                                        />






                                        <div className="flex flex-col sm:flex-row gap-3 ">



                                            <div className="w-full">


                                                <label className="label text-white mb-1">
                                                    Work type
                                                </label>



                                                <select

                                                    className="select border   text-white w-full justify-center"

                                                    name="workType"

                                                    defaultValue={""}

                                                >

                                                    <option  value={""} disabled>
                                                        Work Type
                                                    </option>


                                                    {

                                                        workTypes.map((workType, index) =>

                                                            <option key={index}>
                                                                {workType}
                                                            </option>

                                                        )

                                                    }


                                                </select>


                                            </div>







                                            <div className="w-full">


                                                <label className="label text-white mb-1">
                                                    Commitment Level
                                                </label>



                                                <select

                                                    className="select border  text-white w-full justify-center"

                                                    name="commitmentLevel"

                                                    defaultValue={""}

                                                >

                                                    <option   value={""} disabled>
                                                        Commitment Level
                                                    </option>



                                                    {

                                                        commitmentLevels.map((commitment, index) =>

                                                            <option  key={index}>
                                                                {commitment}
                                                            </option>

                                                        )

                                                    }



                                                </select>



                                            </div>



                                        </div>








                                        <label className="label text-white">
                                            Require Skills
                                        </label>



                                        <input

                                            type="text"

                                            className="input border text-white w-full"

                                            placeholder="Require Skills"

                                            name="requireSkills"

                                        />






                                        <label className="text-white">
                                            Application Deadline
                                        </label>




                                        <input

                                            type="date"

                                            className="input border text-white w-full"

                                            name="applicationDeadline"

                                        />






                                        <button

                                            disabled={user?.opportunity === 0 && user.plan === "free"}

                                            className="btn background border-none mt-4 w-full sm:w-auto"

                                        >

                                            Post Opportunity

                                        </button>





                                    </fieldset>




                                </form>




                            </div>




                        </div>









                        {/* Premium */}


                        {

                            user?.opportunity === 0 && user?.plan === 'free' &&



                            <section className="relative overflow-hidden border border-[#ff7900]/40 bg-[#001836] p-4 sm:p-6 shadow-2xl shadow-orange-950/20">


                                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#ff7900]/20"></div>




                                <div className="relative space-y-5 p-2 sm:p-4">



                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">


                                        <span className="rounded-full border border-[#ff7900]/50 px-3 py-1 text-xs font-semibold uppercase text-[#ff7900]">

                                            Premium

                                        </span>



                                        <span className="text-sm text-white/70">

                                            Best for growing teams

                                        </span>


                                    </div>





                                    <div>


                                        <h2 className="text-xl sm:text-2xl font-bold text-white">

                                            Upgrade to Premium

                                        </h2>


                                        <p className="mt-2 text-sm leading-6 text-gray-300">

                                            Get more room to post roles, promote urgent openings, and reach collaborators faster.

                                        </p>


                                    </div>






                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">



                                        <div className="border border-white/10 bg-white/5 p-4">

                                            <h3 className="text-2xl font-bold text-white">
                                                10+
                                            </h3>

                                        </div>



                                        <div className="border border-white/10 bg-white/5 p-4">

                                            <h3 className="text-2xl font-bold text-white">
                                                2x
                                            </h3>

                                        </div>



                                        <div className="border border-white/10 bg-white/5 p-4">

                                            <h3 className="text-2xl font-bold text-white">
                                                Top
                                            </h3>

                                        </div>



                                    </div>






                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">



                                        <form action="/api/checkout_sessions" method="POST">


                                            <button

                                                className="bg-cyan-400 btn border-none w-full sm:w-auto"

                                                type="submit"

                                                role="link"

                                            >

                                                Upgrade to premium $9/per month

                                            </button>



                                        </form>



                                        <p className="text-sm text-gray-400">

                                            Premium checkout coming soon

                                        </p>



                                    </div>





                                </div>



                            </section>


                        }





                    </div>



                    :



                    <div className="flex items-center justify-center min-h-[60vh]">


                        <div className="border border-white/10 p-6 sm:p-10 text-center w-full max-w-lg">


                            <h1 className="text-center text-2xl sm:text-4xl text-white">

                                Make a startup profile first

                            </h1>

                            <Link

                                href={"/dashboard/founder/my-startup"}

                                className="btn border-none mt-4 bg-[#ff7900]"

                            >

                                Create Startup

                            </Link>



                        </div>



                    </div>



            }



        </div>


    );

};

export default PostTeamRequirements;