import { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { downloadURI, } from "../../data/EditorConstant";
import LoadImage from "../../components/LoadImage";
import LoadImage2 from "../../components/LoadImage2";
import { AnimatePresence, motion } from "framer-motion";
import { router } from "@inertiajs/react";

function Editor({ images, frames }) {
    const [ zoom, setZoom ] = useState(1);

    const [ selectedFrame, setSelectedFrame ] = useState(frames[0]);

    const [ editor, setEditor ] = useState(false);

    const stageRef = useRef(null);

    useState(() => {
        let timer = setTimeout(() => {
            setEditor("display");
        }, 3400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen bg-[#202020] flex justify-center items-center overflow-hidden">
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
                            className="w-[65%] h-full bg-slate-200 py-6 relative overflow-x-auto overflow-y-auto"
                            initial={{ y: window.innerHeight }}
                            animate={{ y:0, transition: { delay: 1.3, repeat: 0, duration: 1 } }}
                            exit={{ x: -window.innerWidth, transition: { ease: "easeInOut", repeat: 0, duration: 1 } }}
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
                                    {images.map((image, index) => {
                                        if (selectedFrame.orientation === "potrait") {
                                            return (
                                                <LoadImage key={index} url={`/storage/temp/${image}`} x={selectedFrame.left_margin} y={selectedFrame.top_margin + index * selectedFrame.margin_between + index * selectedFrame.image_height} width={selectedFrame.image_width} height={selectedFrame.image_height}  />
                                            );  
                                        } else {
                                            return (
                                                <LoadImage key={index} url={`/storage/temp/${image}`} x={selectedFrame.left_margin + index * selectedFrame.margin_between + index * selectedFrame.image_width} y={selectedFrame.top_margin} width={selectedFrame.image_width} height={selectedFrame.image_height} />
                                            );
                                        }
                                    })}
                                </Layer>
                            </Stage>

                            <div className="fixed bottom-5 left-5 bg-slate-300 py-1.5 px-5 rounded-2xl">
                                <span>Zoom:</span>
                                <input type="range" className="m-0 align-middle me-3 ms-3" min={0.1} max={1} step={0.05} value={zoom} onChange={(e) => setZoom(e.target.value)} />
                                <span>{(zoom * 100).toFixed(0)}%</span>
                            </div>
                        </motion.div>
                        <motion.div
                            key={"editor"}
                            id="menu"
                            className="w-[35%] h-full bg-slate-400 relative"
                            initial={{ y: -window.innerHeight }}
                            animate={{ y:0, transition: { delay: 1.3, repeat: 0, duration: 1 } }}
                            exit={{ x: window.innerWidth, transition: { ease: "easeInOut", repeat: 0, duration: 1 } }}
                        >
                            <h2 className="text-center text-5xl font-bold my-5">Frames</h2>
                            <div className="bg-slate-100 mx-3 h-4/5 grid grid-cols-2 gap-y-4 overflow-x-auto">
                                {frames.map((frame, index) => {
                                    return (
                                        <div key={frame.id} onClick={() => setSelectedFrame(frames[index])}>
                                            <img src={`/storage/frames/${frame.filename}`} alt={frame.name} className={`w-1/3 peer mx-auto shadow-lg ${frame === selectedFrame ? "ring-2 ring-sky-400" : "hover:ring-2 hover:ring-sky-400"}`} />
                                            <p className={`text-center mt-4 ${frame === selectedFrame ? "font-bold" : "peer-hover:font-bold"}`}>{frame.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-5 right-5 py-1.5 px-10 bg-sky-500 text- text-2xl rounded-3xl hover:bg-sky-600"
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
                        </motion.div>
                    </>)
                }
            </AnimatePresence>
        </div>
    );
}

export default Editor;
