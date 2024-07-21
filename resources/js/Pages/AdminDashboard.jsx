import { Link } from "@inertiajs/react";

function AdminDashboard({ frames }) {
    return (
        <div>
            <nav className="sticky top-0 left-0 bg-white shadow-md h-14 px-5 flex items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </nav>

            <main className="mx-5">
                <div className="flex items-center justify-between mt-5 mb-2">
                    <h2 className="text-2xl font-bold">Frame</h2>
                    <Link className="block bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl" href="/admin/add-frame">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5 inline align-middle me-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add
                    </Link>
                </div>

                <hr className="border-b-2 border-slate-700" />

                <div className="grid grid-cols-3 gap-y-7 my-3">
                    {frames.map((frame, index) => {
                        return (
                            <div key={index}>
                                <img src={`/storage/frames/${frame.filename}`} alt={frame.name} className="w-1/3 peer mx-auto shadow-lg hover:ring-2 hover:ring-sky-400" />
                                <p className="peer-hover:font-bold text-center mt-4">{frame.name}</p>
                            </div>
                        );
                    })}
                </div>
            </main>



        </div>
    );
}

export default AdminDashboard;
