import { Link, router } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

function Start() {
    const [ isVisible, setIsVisible ] = useState(true);

    const noMenu = (e) => e.preventDefault();

    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);
    }, []);

    return (
        <div className="h-screen bg-[url('/assets/bg-start.png')] portrait:bg-cover flex justify-center items-center overflow-hidden">

            <div
                className="block w-fit"
                onClick={() => {
                    setIsVisible(!isVisible);
                    document.documentElement.removeEventListener('contextmenu', noMenu);
                    setTimeout(() => router.get("/camera"), 1000);
                }}
            >
                <AnimatePresence>
                    {isVisible &&
                        <motion.img
                            key={"hobi"}
                            initial={{ opacity: 0 }}
                            animate={{ scale: [1, 0.98, 1], opacity: 1, transition: { ease: "easeInOut", duration: 2, opacity: { duration: 1.5, repeat: 0}, repeat: Infinity } }}
                            exit={{ scale: 1.5 , opacity: 0, transition: { repeat: 0, duration: 1 } }}
                            src="/assets/icon-start.png"
                            alt="Icon Start"
                            className="w-5/6 mx-auto"
                        />
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Start;
