import { useForm } from "@inertiajs/react";

function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        'email': '',
        'password': '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/admin-login-handler');
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <form className="px-10 py-3 w-1/3 bg-slate-400 rounded-md" onSubmit={handleSubmit}>
                <h1 className="font-bold text-3xl text-center my-3">Admin Login</h1>
                <div className="mb-4">
                    <label className="block font-bold" htmlFor="email">Email:</label>
                    <input className="block w-full form-input rounded-md" type="email" name="email" id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="off" placeholder="example@email.com" disabled={processing} />
                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                </div>
                <div className="mb-4">
                    <label className="block font-bold" htmlFor="password">Password:</label>
                    <input className="block w-full form-input rounded-md" type="password" name="password" value={data.password} onChange={(e) => setData('password', e.target.value)} id="password" disabled={processing} />
                </div>
                {errors.info && <div className="text-red-600">{errors.info}</div>}
                <button type="submit" className="block bg-sky-500 mx-auto px-3 py-2 rounded-xl" disabled={processing}>Submit</button>
            </form>
        </div>
    );
}

export default AdminLogin;
