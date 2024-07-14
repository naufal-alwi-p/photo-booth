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
    const [ preparation, setPreparation ] = useState(true);
    const camera = useRef(null);

    const ratioOption = [
        ["3:2", 1.5],
        ["4:3", 1.33],
        ["5:4", 1.25],
        ["16:9", 1.77]
    ];

    const [ ratioValue, setRatioValue ] = useState(ratioOption[3]);

    useEffect(() => {
        let timer = setTimeout(() => {
            setShowText(false);
        }, 3300);

        return () => clearTimeout(timer);
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
            if (preparation === true) {
                setPreparation(false);
            }
            setCountDown(true)
        }
    }

    function goNextStep() {
        router.post("/store-image", { img: pictures });
        setPictures([]);
        setNextStep(false);
        setPreparation(true);
    }

    return (
        <div className="h-screen bg-[url('/assets/start-app-bg.png')] flex justify-center items-center overflow-hidden">
            <AnimatePresence>
                {showText ?
                    <motion.h1
                        key={'header1'}
                        className="text-white text-center text-8xl font-bold"
                        initial={{ y: window.innerHeight }}
                        animate={{ y: 0, transition: { ease: "backInOut",  delay: 0.3, repeat: 0, duration: 1.7 } }}
                        exit={{ scale: 0.2, opacity: 0, transition: { repeat: 0, duration: 0.7 } }}
                    >
                        Take Your Picture !
                    </motion.h1> :
                    <motion.div
                        className="justify-center items-center w-fit h-full relative"
                        initial={{ opacity: 0, scale: 0.2, display: "none" }}
                        animate={{ opacity:1, scale: 1, display: "flex", transition: { delay: 1, repeat: 0, duration: 1 } }}
                    >
                        <Webcam
                            videoConstraints={{
                                aspectRatio: ratioValue[1],
                            }}
                            screenshotQuality={1}
                            screenshotFormat={'image/png'}
                            mirrored={true}
                            audio={false}
                            className="w-full h-full relative"
                            ref={camera}
                        >
                            {() => <CameraUI preparation={preparation} setPictures={setPictures} getPicture={getPicture} cameraFunction={cameraFunction} pictures={pictures} countDown={countDown} setCountDown={setCountDown} shutter={shutter} ratioOption={ratioOption} ratioValue={ratioValue} setRatioValue={setRatioValue} goNextStep={goNextStep} nextStep={nextStep} />}
                        </Webcam>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
}

export default CameraPage;
