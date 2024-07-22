import { router } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

function SelectorImage({ images }) {
    const [ showImage, setShowImage ] = useState(false);
    const [ selectedImage, setSelectedImage ] = useState([]);

    console.log(images);
    
    useEffect(() => {
        let timer = setTimeout(() => {
            setShowImage("image");
        }, 1400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen bg-[#202020] flex flex-col gap-y-5 items-center">
            <AnimatePresence>
                {showImage !== "close" && <motion.h1
                    key={"title text"}
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                    exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                    className="text-white text-8xl font-bold mt-7"
                >
                    Choose Your Pictures! ({selectedImage.length}/3)
                </motion.h1>}

                {showImage === "image" &&
                    <motion.div
                        key={"image list"}
                        className="grid landscape:grid-cols-3 portrait:grid-cols-2 gap-8 mx-8"
                        initial={{ x: -window.innerWidth }}
                        animate={{ x: 0, transition: { ease: "backInOut", repeat: 0, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                    >
                        {images.map((image, index) => {
                            const isInclude = selectedImage.includes(image);
                            return (
                                <motion.div
                                    key={index}
                                    className="w-full mx-auto bg-white px-3 py-8 rounded-md relative"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        if (isInclude) {
                                            setSelectedImage(selectedImage.filter(data => image !== data));
                                        } else {
                                            if (selectedImage.length < 3) {
                                                setSelectedImage([...selectedImage, image]);
                                            }
                                        }
                                    }}
                                >
                                    <img
                                        draggable={false}
                                        className={`${isInclude ? "opacity-85" : "opacity-100"}`}
                                        src={`/storage/temp/${image}`}
                                        alt={`Image ${index + 1}`}
                                    ></img>

                                    {isInclude &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute size-24 checklist-top-center checklist-left-center text-green-400">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>                                                                            
                                    }
                                </motion.div>
                            );
                        })}
                    </motion.div>
                }

                {selectedImage.length === 3 &&
                    <button
                        key={"next button"}
                        type="button"
                        className="fixed bottom-12 right-11 py-1.5 px-10 bg-sky-500 text- text-2xl rounded-3xl hover:bg-sky-600"
                        onClick={() => {
                            setShowImage("close");
                            setTimeout(() => router.post("/editor", { selectedImage: selectedImage }), 1000);
                        }}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ms-3 inline-block">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                }
            </AnimatePresence>
        </div>
    );
}

export default SelectorImage;
