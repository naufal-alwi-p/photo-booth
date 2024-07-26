import { Link } from "@inertiajs/react";

function NavbarAdminDashboard({ thisPage, login_dropbox }) {
    return (
        <nav className="sticky z-40 top-0 left-0 bg-white shadow-md h-14 px-5 flex items-center gap-x-5">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-x-3">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="text-lg font-bold">
                        Menu
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-3 ms-0.5 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-slate-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><Link className={`${thisPage === "frames" ? "font-bold bg-sky-400 hover:bg-sky-400" : "bg-slate-300 hover:bg-slate-300"}`} href="/admin/dashboard" type="button">Frames</Link></li>
                        <li><Link className={`${thisPage === "prices" ? "font-bold bg-sky-400 hover:bg-sky-400" : "bg-slate-300 hover:bg-slate-300"}`} href="/admin/dashboard/price" type="button">Prices</Link></li>
                    </ul>
                </div>
                {login_dropbox ?
                    <a href={login_dropbox} className="block text-lg bg-blue-600 text-white px-4 py-0.5 rounded-md">Login Dropbox</a>
                    :
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="text-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-0.5 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline me-2 size-5 text-green-400">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                            Terhubung dengan Dropbox
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-slate-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><Link href="/logout-dropbox" method="post" as="button" className="bg-red-500 hover:bg-red-600 text-white">Logout from Dropbox</Link></li>
                        </ul>
                    </div>
                }
                <Link href="/admin-logout" method="post" className="px-4 py-0.5 bg-red-500 text-white rounded-md">Logout from Admin</Link>
            </div>
        </nav>
    );
}

export default NavbarAdminDashboard;
