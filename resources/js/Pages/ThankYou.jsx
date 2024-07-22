import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

function ThankYou() {
    const [ display, setDisplay ] = useState("show");

    const noMenu = (e) => e.preventDefault();
    
    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);
        let timer = setTimeout(() => {
            setDisplay("close");
        }, 3300);

        let go = setTimeout(() => {
            router.get("/start");
        }, 4300);

        return () => {
            clearTimeout(timer);
            clearTimeout(go);
            document.documentElement.removeEventListener('contextmenu', noMenu);
        };
    }, []);

    return (
        <div className="h-screen bg-[url('/assets/select-bg.png')] flex justify-center items-center flex-col gap-y-8 overflow-hidden relative">
            <AnimatePresence>
                {display === "show" &&
                    <motion.div
                        key={"pesan"}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                        className="w-full h-fit"
                    >
                        <p className="text-white font-bold text-center text-7xl">Thank You<br/>For Using<br/>MotoIn</p>
                        <img src="/assets/logo-transparant.png" alt="MotoIn Icon" className="w-1/3 mx-auto" />
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
}

export default ThankYou;
