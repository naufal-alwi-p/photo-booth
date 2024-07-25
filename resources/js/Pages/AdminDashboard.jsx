import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

function AdminDashboard({ frames, csrf, login_dropbox }) {
    const [ selected, setSelected ] = useState(null);

    const { errors } = usePage().props;
    const [ alert, setAlert ] = useState(true);

    console.log(errors);

    return (
        <div>
            {errors.info && alert &&
                <div role="alert" className="alert alert-error fixed top-16 bg-red-300 z-30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.info}</span>
                    <div>
                        <button type="button" onClick={() => setAlert(false)} className="bg-red-500 text-white px-3 py-1 rounded-lg">Close</button>
                    </div>
                </div>
            }
            <nav className="sticky z-40 top-0 left-0 bg-white shadow-md h-14 px-5 flex items-center gap-x-5">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-x-3">
                    <p className="text-lg font-bold">Frames</p>
                    {login_dropbox ?
                        <a href={login_dropbox} className="block text-lg bg-blue-600 text-white px-4 py-0.5 rounded-md">Login Dropbox</a>
                        :
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="text-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-0.5 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline me-2 size-5 text-green-400">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                                Terhubung dengan Dropbox
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-slate-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><Link href="/logout-dropbox" method="post" as="button" className="bg-red-500 hover:bg-red-600 text-white">Log out</Link></li>
                            </ul>
                        </div>
                    }
                </div>
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

                <div className="grid grid-cols-3 gap-y-7 gap-x-3 my-3">
                    {frames.map((frame, index) => {
                        return (
                            <div
                                key={index}
                                id={`frame ${index}`}
                                onClick={() => {
                                    if (selected !== frame) {
                                        setSelected(frame);
                                    } else {
                                        setSelected(null);
                                    }
                                }}
                                className={`${selected === frame ? "bg-slate-200 ring-2 ring-sky-400" : ""} relative rounded-md flex flex-col justify-between`}
                            >
                                <div className="flex justify-center items-center h-full">
                                    <img src={`/storage/frames/${frame.filename}`} alt={frame.name} className={`${frame.frame_height > frame.frame_width ? "w-2/3" : "w-11/12"} peer mx-auto shadow-lg ${selected === frame ? "" : "hover:ring-2 hover:ring-sky-400"}`} />
                                </div>
                                <p className={`${selected === frame ? "font-bold" : "peer-hover:font-bold"} text-center my-3`}>{frame.name}</p>
                                {!frame.visibility &&
                                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-red-500 bg-slate-600/30 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-28">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    </div>
                                }
                                {selected === frame &&
                                    <>
                                        <button
                                            type="button"
                                            className="absolute top-3 right-[6.25rem] bg-green-400 hover:bg-green-500 hover:text-white p-2 rounded-full shadow"
                                            onClick={() => {
                                                router.post('/change-frame-visibility', { id: frame.id, visibility: !frame.visibility }, {headers: { "X-CSRF-TOKEN": csrf }, preserveScroll: true});
                                            }}
                                        >
                                            {frame.visibility ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg> :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>                                              
                                            }
                                        </button>
                                        <button
                                            type="button"
                                            className="absolute top-3 right-14 bg-sky-500 hover:bg-sky-600 hover:text-white p-2 rounded-full shadow"
                                            onClick={() => {
                                                router.get(`/admin/edit-frame/${frame.id}`);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 hover:text-white p-2 rounded-full shadow"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete ?")) {
                                                    router.post('/delete-frame', { id: frame.id }, { preserveScroll: true });
                                                }
                                            }}
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        </button>
                                    </>
                                }
                            </div>
                        );
                    })}
                </div>
            </main>



        </div>
    );
}

export default AdminDashboard;
