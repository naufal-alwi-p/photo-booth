import { useForm } from "@inertiajs/react";
import NavbarAdminDashboard from "../../components/NavbarAdminDashboard";
import { useState } from "react";

function AdminPriceForm({ login_dropbox, prices }) {
    const { data, setData, post, processing, errors } = useForm({
        'no_payment': !prices[0].visibility,
        'price_1': prices[0].price,
        'price_2': prices[1].price,
        'visibility_2': Boolean(prices[1].visibility)
    });

    const [ alert, setAlert ] = useState(true);

    function handleSubmit(e) {
        e.preventDefault();
        post('/admin-update-price');
    }

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

            <NavbarAdminDashboard thisPage={"prices"} login_dropbox={login_dropbox} />

            <main className="m-5">
                <form className="px-5 py-2" onSubmit={handleSubmit}>
                    <div className="form-control w-fit bg-gray-800 rounded-lg px-5 py-1 mb-3">
                        <label htmlFor="no_payment" className="label gap-x-3 cursor-pointer">
                            <input type="checkbox" name="no_payment" id="no_payment" value={data.no_payment} checked={data.no_payment} className="form-checkbox" onChange={() => setData((prevValue) => ({...prevValue, no_payment: !data.no_payment, visibility_2: false}))} />
                            <span className="label-text text-white">No Payment</span>
                        </label>
                    </div>

                    <div className={`${data.no_payment ? "bg-slate-700/70" : "bg-slate-700"} px-5 py-2 rounded-lg mb-3`}>
                        <p className="text-white text-lg font-bold mb-3">{prices[0].name}</p>
                        <div className="form-control">
                            <label htmlFor="price_1" className="text-white text-lg">Price</label>
                            <input type="number" step={1} disabled={data.no_payment} name="price_1" id="price_1" value={data.price_1} onChange={(e) => setData('price_1', e.target.value)} placeholder="Type here" className="input disabled:bg-gray-400 bg-white input-bordered !outline-white w-full max-w-xs" />
                            {errors.price_1 && <div className="text-red-600">{errors.price_1}</div>}
                        </div>
                    </div>

                    <div className={`${!data.visibility_2 || data.no_payment ? "bg-slate-700/70" : "bg-slate-700"} px-5 py-2 rounded-lg mb-5`}>
                        <label htmlFor="visibility_2" className="label gap-x-2 cursor-pointer w-fit">
                            <input type="checkbox" disabled={data.no_payment} name="visibility_2" id="visibility_2" value={data.visibility_2} checked={data.visibility_2} className="form-checkbox disabled:bg-gray-400 disabled:cursor-not-allowed" onChange={() => setData('visibility_2', !data.visibility_2)} />
                            <span className="label-text !text-lg font-bold text-white">{prices[1].name}</span>
                        </label>
                        <div className="form-control">
                            <label htmlFor="name" className="text-white text-lg">Price</label>
                            <input type="number" step={1} disabled={!data.visibility_2 || data.no_payment} name="price_2" id="price_2" value={data.price_2} onChange={(e) => setData('price_2', e.target.value)} placeholder="Type here" className="input disabled:bg-gray-400 bg-white input-bordered !outline-white w-full max-w-xs" />
                            {errors.price_2 && <div className="text-red-600">{errors.price_2}</div>}
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="bg-sky-600 text-white px-8 py-1 rounded hover:bg-blue-600 mx-auto block">Save</button>
                </form>
            </main>
        </div>
    );
}

export default AdminPriceForm;
