import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

function Home() {
    const [ fullScreen, setFullScreen ] = useState(document.fullscreenElement);

    const fullScreenHandler = () => {
        if (document.fullscreenElement === null) {
            setFullScreen(null);
        }
    };

    const noMenu = (e) => e.preventDefault();

    useEffect(() => {
        document.documentElement.addEventListener('fullscreenchange', fullScreenHandler);
        document.documentElement.addEventListener('contextmenu', noMenu);
    }, []);

    router.on('before', () => {
        document.documentElement.removeEventListener('fullscreenchange', fullScreenHandler);
        document.documentElement.removeEventListener('contextmenu', noMenu);
    });

    return (
        <div className="h-screen flex justify-center items-center bg-[url('/assets/start-app-bg.png')]">
            <div>
                <img src="/assets/logo-transparant.png" alt="Main Icon" className="w-3/4 block mx-auto" />
                <h1 className="text-9xl font-bold text-center text-white mt-3 mb-10">MotoIn</h1>
                <button
                    type="button"
                    className={`${fullScreen ? "hidden" : "block"} bg-sky-600 px-5 py-2 rounded-lg text-white mx-auto`}
                    onClick={() => {
                        document.documentElement.requestFullscreen()
                            .then(() => setFullScreen(document.fullscreenElement));
                    }}
                >
                    Fullscreen Mode
                </button>
                <Link
                    className={`${fullScreen ? "block" : "hidden"} bg-sky-600 px-5 py-2 rounded-lg w-fit text-white mx-auto my-3`}
                    href="/start"
                >
                    Start App
                </Link>
            </div>
        </div>
    );
}

export default Home;
