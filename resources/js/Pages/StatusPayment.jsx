import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

function StatusPayment({ transaction_status, image = null, option = null }) {
    const [ display, setDisplay ] = useState("show");

    const noMenu = (e) => e.preventDefault();
    
    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);
        let timer = setTimeout(() => {
            setDisplay("close");
        }, 3300);

        let go = setTimeout(() => {
            if (transaction_status === "capture" || transaction_status === "settlement") {
                router.post("/get-output", { image: image, option: option });
            } else {
                router.get("/start");
            }
        }, 4300);

        return () => {
            clearTimeout(timer);
            clearTimeout(go);
            document.documentElement.removeEventListener('contextmenu', noMenu);
        };
    }, []);

    return (
        <div className="h-screen bg-[url('/assets/select-bg.png')] flex justify-center items-center gap-y-8 flex-col overflow-hidden relative">
            <AnimatePresence>
                {display === "show" &&
                    <motion.div
                        key={"pesan"}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                        className="w-full h-fit"
                    >
                        {transaction_status === "capture" || transaction_status === "settlement" ?
                            <>
                                <img src="/assets/success-icon.png" alt="Success Icon" className="w-1/3 mx-auto" />
                                <p className="text-white font-bold text-center text-5xl mt-5">Payment Successful<br/>Please Wait...</p>
                            </> :
                            <>
                                <img src="/assets/failed-icon.png" alt="Failed Icon" className="w-1/3 mx-auto" />
                                <p className="text-white font-bold text-center text-5xl mt-5">Payment Failed</p>
                            </>
                        }
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
}

export default StatusPayment;
