import { Link } from "@inertiajs/react";

function TakePicture() {
    return (
        <div className="h-screen bg-[url('/assets/start-app-bg.png')]">
            <h1 className="text-7xl font-bold text-white">Take Picture</h1>

            <Link href="/" className="px-5 py-3 bg-blue-400 text-white hover:bg-blue-500 rounded-lg">Go Home</Link>
        </div>
    );
}

export default TakePicture;
