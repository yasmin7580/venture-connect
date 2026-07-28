import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }) {
    return (

        <div className="min-h-screen dark-bg" >
            <Toaster />

            <div className="flex min-h-screen w-full flex-col lg:flex-row">

                <DashboardSidebar />
                <div className="min-w-0 flex-1">
                    <main className="w-full p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
