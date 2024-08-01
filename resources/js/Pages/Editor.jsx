import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { downloadURI, } from "../../data/EditorConstant";
import LoadImage from "../../components/LoadImage";
import LoadImage2 from "../../components/LoadImage2";
import { AnimatePresence, motion } from "framer-motion";
import { Link, router } from "@inertiajs/react";

function Editor({ images, frames }) {
    const [ zoom, setZoom ] = useState(1);

    const [ selectedFrame, setSelectedFrame ] = useState(frames[0]);

    const [ selectedImage, setSelectedImage ] = useState([]);

    const [ menu, setMenu ] = useState("frames");

    const [ editor, setEditor ] = useState(false);

    const stageRef = useRef(null);

    const noMenu = (e) => e.preventDefault();

    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);
        let timer = setTimeout(() => {
            setEditor("display");
        }, 3400);

        return () => {
            clearTimeout(timer);
            document.documentElement.removeEventListener('contextmenu', noMenu);
        };
    }, []);

    let initial, animate, exit;

    if (window.innerHeight > window.innerWidth) {
        initial = {first: { x: window.innerWidth }, second: { x: -window.innerWidth }};
        animate = { first: { x:0, transition: { delay: 1.3, repeat: 0, duration: 1 } }, second: { x:0, transition: { delay: 1.3, repeat: 0, duration: 1 } }};
        exit = { first: { y: -window.innerHeight, transition: { ease: "easeInOut", repeat: 0, duration: 1 } }, second: { y: window.innerHeight, transition: { ease: "easeInOut", repeat: 0, duration: 1 } }};
    } else {
        initial = {first: { y: window.innerHeight }, second: { y: -window.innerHeight }};
        animate = { first: { y:0, transition: { delay: 1.3, repeat: 0, duration: 1 } }, second: { y:0, transition: { delay: 1.3, repeat: 0, duration: 1 } }};
        exit = { first: { x: -window.innerWidth, transition: { ease: "easeInOut", repeat: 0, duration: 1 } }, second: { x: window.innerWidth, transition: { ease: "easeInOut", repeat: 0, duration: 1 } }};
    }

    return (
        <div className="h-screen bg-[#202020] flex portrait:flex-col justify-center items-center overflow-hidden">
            <AnimatePresence>
                {!editor ?
                    <motion.h1
                        key={'header1'}
                        className="text-white text-center text-8xl font-bold absolute"
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { ease: "backInOut",  delay: 0.3, repeat: 0, duration: 1.7 } }}
                        exit={{ y: -window.innerHeight, transition: { repeat: 0, duration: 1 } }}
                    >
                        Select Frame
                    </motion.h1> : (editor === "display" &&
                    <>
                        <motion.div
                            key={"display"}
                            className="landscape:w-[65%] landscape:h-full portrait:w-full portrait:h-[65%] bg-slate-200 py-6 relative overflow-auto scrollbar scrollbar-w-2 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full"
                            initial={initial.first}
                            animate={animate.first}
                            exit={exit.first}
                        >
                            <Stage
                                ref={stageRef}
                                width={selectedFrame.frame_width}
                                height={selectedFrame.frame_height}
                                className={`bg-white w-fit h-fit mx-auto shadow-lg`}
                                style={{ transform: `scale(${zoom})` }}
                            >
                                <Layer>
                                    <Rect
                                        x={0}
                                        y={0}
                                        width={selectedFrame.frame_width}
                                        height={selectedFrame.frame_height}
                                        fill="white"
                                        id="background"
                                    />
                                    <LoadImage2 src={`/storage/frames/${selectedFrame.filename}`} x={0} y={0} />
                                    {Array(selectedFrame.number_of_photos).fill(1).map((value, index) => {
                                        if (index < selectedImage.length) {
                                            return (
                                                <LoadImage key={index} url={`/storage/temp/${selectedImage[index]}`} x={selectedFrame.photo_position[index].x} y={selectedFrame.photo_position[index].y} width={selectedFrame.image_width} height={selectedFrame.image_height}  />
                                            );
                                        } else {
                                            return (
                                                <LoadImage key={index} url={`/storage/example/5-4.png`} x={selectedFrame.photo_position[index].x} y={selectedFrame.photo_position[index].y} width={selectedFrame.image_width} height={selectedFrame.image_height} />
                                            );
                                        }
                                    })}
                                </Layer>
                            </Stage>

                            <div className="fixed landscape:bottom-5 left-5 portrait:top-5 bg-slate-300 py-1.5 px-5 text-4xl rounded-2xl">
                                <span>Zoom:</span>
                                <input type="range" className="m-0 align-middle me-3 ms-3 w-56" min={0.1} max={((selectedFrame.frame_width < 600) && (selectedFrame.frame_height < 600)) ? 1.5 : 1} step={0.05} value={zoom} onChange={(e) => setZoom(e.target.value)} />
                                <span>{Math.trunc(zoom * 100)}%</span>
                            </div>
                        </motion.div>
                        <motion.div
                            key={"editor"}
                            id="menu"
                            className="landscape:w-[35%] landscape:h-full portrait:w-full portrait:h-[35%] portrait:px-10 portrait:pb-10 bg-slate-400 relative"
                            initial={initial.second}
                            animate={animate.second}
                            exit={exit.second}
                        >
                            <div className="flex px-10 my-5">
                                <button type="button" className={`block w-full ${menu === "frames" ? "bg-green-500 hover:bg-green-400" : "bg-slate-700 hover:bg-slate-600"} text-xl py-2 text-white rounded-l-md`} onClick={() => setMenu("frames")}>Frames</button>
                                <button type="button" className={`block w-full ${menu === "pictures" ? "bg-green-500 hover:bg-green-400" : "bg-slate-700 hover:bg-slate-600"} text-xl py-2 text-white rounded-r-md`} onClick={() => setMenu("pictures")}>Pictures ({selectedImage.length}/{selectedFrame.number_of_photos})</button>
                            </div>
                            {menu === "pictures" ?
                                <div className="carousel gap-x-5 pb-1 h-[80%] w-full scrollbar-thin">
                                    {images.map((image, index) => {
                                        const isInclude = selectedImage.includes(image);

                                        return (
                                            <div
                                                key={`image ${index}`}
                                                className="carousel-item px-6 py-3 h-[91%] rounded-lg bg-white relative"
                                                onClick={() => {
                                                    if (isInclude) {
                                                        setSelectedImage(selectedImage.filter(data => image !== data));
                                                    } else {
                                                        if (selectedImage.length < selectedFrame.number_of_photos) {
                                                            setSelectedImage([...selectedImage, image]);
                                                        }
                                                    }
                                                }}
                                            >
                                                <img src={`/storage/temp/${image}`} alt={image} className="h-full" />
                                                {isInclude &&
                                                    <>
                                                        <p className="absolute bg-white top-5 left-8 text-2xl rounded-full px-4 py-1 font-semibold">{selectedImage.findIndex((data) => image === data) + 1}</p>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute size-24 checklist-top-center checklist-left-center text-green-400">
                                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                        </svg>
                                                    </>
                                                }
                                            </div>
                                        );
                                    })}
                                </div> :
                                <div className="bg-slate-100 rounded-md carousel gap-x-5 py-3 w-full h-[80%] scrollbar-thin">
                                    {frames.map((frame, index) => {
                                        return (
                                            <div
                                                key={frame.id}
                                                onClick={() => {
                                                    if (frames[index].number_of_photos < selectedImage.length) {
                                                        setSelectedImage(selectedImage.slice(0, frames[index].number_of_photos));
                                                    }

                                                    setSelectedFrame(frames[index]);
                                                }}
                                                className={`bg-slate-300 carousel-item w-2/6 flex-col p-2 rounded-md relative ${frame === selectedFrame ? "ring-4 ring-sky-400" : ""}`}
                                            >
                                                <div className="flex justify-center items-center h-full">
                                                    <img src={`/storage/frames/${frame.filename}`} alt={frame.name} className={`${frame.frame_height > frame.frame_width ? "h-full" : "w-full"} peer mx-auto shadow-lg`} />
                                                </div>
                                                {selectedFrame === frame &&
                                                    <p className="absolute bottom-4 left-4 bg-green-600 py-1 px-5 rounded-full shadow-lg text-white">
                                                        Selected
                                                    </p>
                                                }
                                                {/* <p className={`text-center ${frame === selectedFrame ? "font-bold" : "peer-hover:font-bold"}`}>{frame.name}</p> */}
                                            </div>
                                        );
                                    })}
                                </div>
                            }
                            <Link href="/camera" className="bg-red-500 hover:bg-red-600 text-white px-5 py-1 rounded-full absolute bottom-5 left-5 text-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 me-3 inline">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                                Go Back
                            </Link>
                            {selectedImage.length === selectedFrame.number_of_photos &&
                                <button
                                    type="button"
                                    className="absolute bottom-5 right-5 py-1.5 px-10 bg-sky-500 text-white text-2xl rounded-3xl hover:bg-sky-600"
                                    onClick={() => {
                                        let data = stageRef.current.toDataURL({ pixelRatio: 1 });
                                        setTimeout(() => router.post("/select-option", { image: data }), 1000);

                                        setEditor("close");
                                        // downloadURI(data, "coba.png");
                                    }}
                                >
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ms-3 inline-block">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            }
                        </motion.div>
                    </>)
                }
            </AnimatePresence>
        </div>
    );
}

export default Editor;
