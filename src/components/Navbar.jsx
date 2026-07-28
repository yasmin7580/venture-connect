"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Rocket, CircleGauge, LayoutDashboard, ShieldPlus, LogOut, CircleGaugeIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";

const Navbar = () => {

    const router = useRouter()
    const [dropdown, setDropdown] = useState(false) // 
    const [resDropdown, setResDropdown] = useState(false)
    const pathname = usePathname()
    const { data: session } = authClient.useSession();
    const { role } = useRole()

    const user = session?.user;

    if (pathname.includes('dashboard')) {
        return null
    }

    const navLinks = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "Browse Startups",
            path: "/startups",
        },
        {
            name: "Opportunities",
            path: "/opportunities",
        },
    ];



    const handleSignOut = async (e) => {
        const { token } = await authClient.getAccessToken()
        console.log(token)

        // e.stopPropagation()
        // e.preventDefault()
        // e.stop

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, LogOut!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                await authClient.signOut()
                setDropdown(false)
                router.push("/login")



            }
        });

    }


    return (
        <nav className="bg-white dark-bg shadow-sm sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-2.5 py-4 flex items-center justify-between">


                {/* Logo */}
                <div className=" flex items-center justify-center gap-2">
                    <div className="relative">
                        <button onClick={() => setResDropdown(!resDropdown)} className="md:hidden">
                            <Menu color="#00d3f2" />
                        </button>


                        {resDropdown &&
                            <div className="absolute border bg-[#00142c] flex flex-col  gap-2 top-10">

                                {
                                    navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.path}
                                            className={`text-cyan-400 w-max block hover:text-[#ff7900] transition ${pathname === link.path ? "active" : ""}`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))
                                }

                            </div>}
                    </div>

                    <Link href="/" className="flex items-center gap-2">

                        <div className="bg-cyan-400 p-2 rounded-lg">
                            <Rocket size={22} className="text-white" />
                        </div>

                        <h1 className="text-2xl font-bold primary-text">
                            Venture<span className="text-cyan-400">Connect</span>
                        </h1>

                    </Link>
                </div>



                {/* Menu */}

                <div className="hidden md:flex items-center gap-8">

                    {
                        navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-cyan-400 hover:text-[#ff7900] transition ${pathname === link.path ? "active" : ""}`}
                            >
                                {link.name}
                            </Link>
                        ))
                    }

                </div>




                {/* Auth Button */}

                <div className="flex items-center gap-3">


                    {
                        user ? (

                            <>
                                <div className="relative">


                                    <div >

                                        <Avatar onClick={() => setDropdown(!dropdown)} className="border-2 w-10 h-10">
                                            <Avatar.Image referrerPolicy="no-referrer" alt="user image" src={user?.image} className="object-cover" />
                                            <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                                        </Avatar>
                                    </div>
                                    {
                                        dropdown &&

                                        <div className=" border rounded-md  bg-white absolute right-0 top-12 p-5">
                                            {/* <Link href={`/dashboard/${user?.role?.toLowerCase()}`}> */}
                                            <div className="flex items-center justify-center gap-2 p-8 border-2 border-cyan-400 rounded-md mb-3">

                                                <div className=" p-1 rounded-full">

                                                    <Avatar className="border-2 border-cyan-400 w-10 h-10">
                                                        <Avatar.Image referrerPolicy="no-referrer" alt="user image" src={user?.image} className="object-cover" />
                                                        <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                                                    </Avatar>
                                                </div>
                                                <div>
                                                    <h1 className="text-lg font-bold">{user.name}</h1>
                                                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                                                    <span className="bg-gray-100 rounded-full px-2">{user?.role}</span>
                                                </div>
                                            </div>
                                            <div>

                                                {/* <div> */}
                                                <div className="flex">
                                                    <Link href={`/dashboard/${role}/overview`} onClick={() => setDropdown(false)} className="btn w-full mb-2 bg-[#4f72a0] border border-[#00112c]"><LayoutDashboard size={16} /> Dashboard</Link>
                                                </div>

                                                {
                                                    role === "collaborator" &&
                                                    <Link href={"/dashboard/collaborator/profile"} onClick={() => setDropdown(false)} className="btn w-full bg-[#f59d51] mb-2 border border-[#ff7900]"><ShieldPlus size={16} /> Profile</Link>
                                                }                                                {/* </div> */}
                                                <button onClick={handleSignOut} className="btn w-full bg-cyan-200 mb-2 border border-[#00d3f2]"><LogOut size={16} /> LogOut</button>
                                            </div>

                                            {/* </Link> */}
                                        </div>
                                    }

                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="bg-cyan-400 text-white px-5 py-2 rounded-lg hover:bg-cyan-900 transition"
                                >
                                    Logout
                                </button>


                            </>


                        ) : (

                            <>

                                <Link
                                    href="/login"
                                    className="border border-cyan-400 text-cyan-400 px-5 py-2 rounded-lg hover:bg-cyan-400 hover:text-white transition"
                                >
                                    Login
                                </Link>


                                <Link
                                    href="/role"
                                    className="bg-cyan-400 text-white px-5 py-2 rounded-lg"
                                >
                                    Join Now
                                </Link>

                            </>
                        )
                    }


                </div>





            </div>


            {/* 
            {
                user && (

                    <div className="md:hidden px-6 pb-5 space-y-4">


                        {
                            navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="block text-gray-600"
                                >
                                    {link.name}
                                </Link>
                            ))
                        }



                        {
                            user ? (

                                <div className="flex items-center gap-3">

                                    <Avatar className="border-2">
                                        <Avatar.Image referrerPolicy="no-referrer" alt="user image" src={user?.image} />
                                        <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                                    </Avatar>


                                    <button
                                        onClick={handleSignOut}
                                        className="bg-[#00142c] text-white px-4 py-2 rounded-lg"
                                    >
                                        Logout
                                    </button>


                                </div>


                            ) : (

                                <div className="flex gap-3">

                                    <Link
                                        href="/login"
                                        className="flex-1 text-center border border-cyan-400 text-cyan-400 py-2 rounded-lg"
                                    >
                                        Login
                                    </Link>


                                    <Link
                                        href="/role"
                                        className="flex-1 text-center bg-cyan-400 text-white py-2 rounded-lg"
                                    >
                                        Join Now
                                    </Link>


                                </div>

                            )
                        }


                    </div>

                )
            } */}


        </nav>
    );
};


export default Navbar;