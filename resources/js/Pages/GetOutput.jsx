import parse from 'html-react-parser';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import CountDownTimer from "../../components/CountDownTimer";
import { router } from '@inertiajs/react';

function GetOutput({ qr_code, print }) {
    const [ display, setDisplay ] = useState(false);
    console.log(qr_code);

    const noMenu = (e) => e.preventDefault();

    function onExpire() {
        setDisplay(true);
        setTimeout(() => {
            router.get("/start");
        }, 1000);
    }

    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);

        return () => {
            document.documentElement.removeEventListener('contextmenu', noMenu);
        };
    }, []);

    return (
        <div className="h-screen bg-[url('/assets/select-bg.png')] flex portrait:flex-col items-center justify-evenly overflow-hidden relative">
            <AnimatePresence>
                {!display &&
                    <motion.div
                        key={"qr-code"}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                        className="flex flex-col items-center justify-center gap-y-8 h-full "
                    >
                        <h2 className="text-white font-bold text-5xl">Download Your Photo</h2>
                        <div className="w-fit">
                            {parse(qr_code)}
                        </div>
                    </motion.div>
                }
                {!display && print &&
                    <motion.div
                        key={"info-print"}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                        className="flex items-center justify-center h-full "
                    >
                        <p className="text-white font-bold text-6xl">
                            Print in progress...
                        </p>
                    </motion.div>
                }
                <motion.p
                    key={"timer"}
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                    exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                    className="text-white text-5xl absolute top-5"
                >
                    <CountDownTimer expiryTimestamp={new Date(Date.now() + (2 * 1000 * 60))} onExpire={onExpire} />
                </motion.p>
                <motion.button
                    key={"done"}
                    type="button"
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                    exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                    className="px-5 py-2 bg-green-500 hover:bg-green-600 block text-white font-bold rounded-lg text-2xl absolute bottom-5"
                    onClick={() => router.get('thank-you')}
                >
                    Done
                </motion.button>
            </AnimatePresence>
        </div>
    );
}

export default GetOutput;
