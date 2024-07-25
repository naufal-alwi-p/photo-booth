import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { router } from "@inertiajs/react";
import CameraUI from "../../components/CameraUI";

function CameraPage() {
    const [ showText, setShowText ] = useState(true);
    const [ pictures, setPictures ] = useState([]);
    const [ shutter, setShutter ] = useState(false);
    const [ countDown, setCountDown ] = useState(false);
    const [ nextStep, setNextStep ] = useState(false);
    const camera = useRef(null);

    const noMenu = (e) => e.preventDefault();

    let ratio;
    let width;
    let height;

    if (window.innerHeight > window.innerWidth) {
        ratio = 0.8;
        width = window.innerWidth;
        height = width * 0.8;
    } else {
        ratio = 1.25;
        height = window.innerHeight;
        width = height / 0.8;
    }

    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);
        let timer = setTimeout(() => {
            setShowText("camera");
        }, 3300);

        return () => {
            clearTimeout(timer);
            document.documentElement.removeEventListener('contextmenu', noMenu);
        };
    }, []);

    const cameraFunction = () => {
        const imageSrc = camera.current?.getScreenshot();
        // console.log(imageSrc);
        // const binString = atob(imageSrc.split(',')[1]);
        // const arr8int = Uint8Array.from(binString, (m) => m.codePointAt(0));

        // const blob = new Blob(arr8int, { type: "image/png" });
        // const file = new File(arr8int, "gambar.png", { type: "image/png" });
        // console.log(blob);
        // console.log(file);

        // const form = new FormData();
        // form.append("img", imageSrc);

        // console.log(pictures);
        setShutter(true);

        setTimeout(() => {
            setShutter(false);
        }, 100);
        setPictures([...pictures, imageSrc]);
        setCountDown(false);

        console.log(pictures.length);
        if (pictures.length === 5) {
            setNextStep(true);
        }
    }

    function getPicture() {
        if (pictures.length < 6) {
            setCountDown(true)
        }
    }

    function goNextStep() {
        setShowText(false);
        setTimeout(() => router.post("/editor", { img: pictures }), 1000);
    }

    return (
        <div className="h-screen bg-[url('/assets/start-app-bg.png')] flex justify-center items-center overflow-hidden">
            <AnimatePresence>
                {showText === true ?
                    <motion.h1
                        key={'header1'}
                        className="text-white text-center text-8xl font-bold"
                        initial={{ y: window.innerHeight }}
                        animate={{ y: 0, transition: { ease: "backInOut",  delay: 0.3, repeat: 0, duration: 1.7 } }}
                        exit={{ scale: 0.2, opacity: 0, transition: { repeat: 0, duration: 0.7 } }}
                    >
                        Take Your Picture !
                    </motion.h1> : (showText === "camera" &&
                    <motion.div
                        key={"camera"}
                        className="justify-center items-center portrait:flex-col portrait:gap-y-4 w-fit h-full relative"
                        initial={{ opacity: 0, scale: 0.2, display: "none" }}
                        animate={{ opacity:1, scale: 1, display: "flex", transition: { delay: 1, repeat: 0, duration: 1 } }}
                        exit={{ x: -window.innerWidth, transition: { ease: "backInOut", repeat: 0, duration: 1 } }}
                    >
                        <Webcam
                            videoConstraints={{
                                aspectRatio: ratio,
                                // width: width,
                                // height: height
                            }}
                            screenshotQuality={1}
                            screenshotFormat={'image/png'}
                            mirrored={true}
                            audio={false}
                            className="w-full h-full relative"
                            ref={camera}
                            onLoad={() => console.log(camera.current.width)}
                        >
                            {() => {
                                let elem;

                                if (window.innerHeight <= window.innerWidth) {
                                    elem = (
                                        <>
                                            <div className={`w-full h-full absolute top-0 left-0 transition-colors ${shutter ? "bg-white/30" : "bg-transparent"} rounded-xl`}></div>
                                            <CameraUI setPictures={setPictures} getPicture={getPicture} cameraFunction={cameraFunction} pictures={pictures} countDown={countDown} setCountDown={setCountDown} goNextStep={goNextStep} nextStep={nextStep} />
                                        </>
                                    );
                                } else {
                                    elem = <div className={`w-full h-full absolute top-0 left-0 transition-colors ${shutter ? "bg-white/30" : "bg-transparent"} rounded-xl`}></div>;
                                }
                                return elem;
                            }}
                        </Webcam>
                        {window.innerHeight > window.innerWidth &&
                            <div className="relative w-full h-4/6">
                                <CameraUI setPictures={setPictures} getPicture={getPicture} cameraFunction={cameraFunction} pictures={pictures} countDown={countDown} setCountDown={setCountDown} goNextStep={goNextStep} nextStep={nextStep} />
                            </div>
                        }
                    </motion.div>)
                }
            </AnimatePresence>
        </div>
    );
}

export default CameraPage;
