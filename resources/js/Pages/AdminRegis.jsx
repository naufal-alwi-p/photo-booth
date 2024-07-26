import { useForm } from "@inertiajs/react";

function AdminRegis() {
    const { data, setData, post, processing, errors } = useForm({
        'name': '',
        'email': '',
        'password': '',
        'password_confirmation': ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/admin-regis-handler');
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <form className="px-10 py-3 landscape:w-1/3 portrait:w-2/3 bg-slate-400 rounded-md" onSubmit={handleSubmit}>
                <h1 className="font-bold text-3xl text-center my-3">Admin Registration*</h1>
                <div className="mb-4">
                    <label htmlFor="nama" className="block font-bold">Name:</label>
                    <input type="text" name="name" id="nama" className="block w-full form-input rounded-md" value={data.name} onChange={(e) => setData('name', e.target.value)} autoComplete="off" placeholder="Jhon Doe" disabled={processing} />
                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                </div>
                <div className="mb-4">
                    <label className="block font-bold" htmlFor="email">Email:</label>
                    <input className="block w-full form-input rounded-md" type="email" name="email" id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="off" placeholder="example@email.com" disabled={processing} />
                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                </div>
                <div className="mb-4">
                    <label className="block font-bold" htmlFor="password">Password:</label>
                    <input className="block w-full form-input rounded-md" type="password" name="password" value={data.password} onChange={(e) => setData('password', e.target.value)} id="password" disabled={processing} />
                </div>
                <div className="mb-4">
                    <label className="block font-bold" htmlFor="password-2">Password Confirmation:</label>
                    <input className="block w-full form-input rounded-md" type="password" name="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} id="password-2" disabled={processing} />
                </div>
                {errors.info && <div className="text-red-600">{errors.info}</div>}
                <button type="submit" className="block bg-sky-500 mx-auto px-3 py-2 rounded-xl" disabled={processing}>Submit</button>
                <small>*Ini hanya proses satu kali, tolong ingat email & password anda</small>
            </form>
        </div>
    );
}

export default AdminRegis;
