import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useEffect, useRef, useState } from "react";

function CameraUI({ preparation, getPicture, cameraFunction, pictures, countDown, shutter, ratioOption, ratioValue, setRatioValue, goNextStep, nextStep  }) {
    const [ showMenu, setShowMenu ] = useState(false);
    const ratioMenu = useRef(null);
    const timerMenu = useRef(null);

    const timerOption = [1, 3, 5, 7];

    const [ timerValue, setTimerValue ] = useState(timerOption[2]);

    const handler = (e) => {
        if (showMenu && (!ratioMenu.current?.contains(e.target) && ratioMenu.current?.previousSibling !== e.target && !timerMenu.current?.contains(e.target) && timerMenu.current?.previousSibling !== e.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handler);

        return () => document.removeEventListener("click", handler);
    }, [showMenu]);

    return (
        <>
            <div className={`w-full h-full absolute top-0 left-0 transition-colors ${shutter ? "bg-white/30" : "bg-transparent"} rounded-xl`}></div>
            {countDown && <div className="absolute timer-top-center timer-left-center opacity-20">
                <CountdownCircleTimer
                    isPlaying
                    duration={timerValue}
                    colors={['#0F172A', '#CBD5E1']}
                    colorsTime={[5, 0]}
                    onComplete={cameraFunction}
                >
                    {({ remainingTime }) => <span className="text-white text-5xl">{remainingTime}</span>}
                </CountdownCircleTimer>
            </div>}
            <button
                type="button"
                className={`${preparation ? "block" : "hidden"} absolute top-12 left-11 w-24 py-0.5 border-2 rounded-lg border-white ${showMenu === "ratio" ? "bg-white text-black" : "bg-transparent text-white"} hover:bg-white hover:text-black`}
                onClick={() => setShowMenu(showMenu === "ratio" ? false : "ratio")}
            >
                {`Ratio: ${ratioValue[0]}`}
            </button>
            <div
                className={`${showMenu === "ratio" ? "block" : "hidden"} absolute top-24 left-11 w-fit flex flex-col gap-y-2`}
                ref={ratioMenu}
            >
                {ratioOption.map(option => {
                    if (option[0] === ratioValue[0]) {
                        return (<button key={option[0]} type="button" className="block w-11 py-0.5 border-2 border-white rounded-lg bg-white text-black">{option[0]}</button>);
                    } else {
                        return (<button key={option[0]} type="button" className="block w-11 py-0.5 text-white border-2 border-white rounded-lg hover:bg-white hover:text-black" onClick={() => {setRatioValue(option); setShowMenu(false)}}>{option[0]}</button>);
                    }
                })}
            </div>
            <button
                type="button"
                className={`${countDown || nextStep ? "hidden" : "block"} absolute top-12 right-11 w-20 py-0.5 border-2 rounded-lg border-white ${showMenu === "timer" ? "bg-white text-black" : "bg-transparent text-white"} hover:bg-white hover:text-black`}
                onClick={() => setShowMenu(showMenu === "timer" ? false : "timer")}
            >
                {`Timer: ${timerValue}s`}
            </button>
            <div
                className={`${showMenu === "timer" ? "block" : "hidden"} absolute top-24 right-11 w-fit flex flex-col gap-y-2`}
                ref={timerMenu}
            >
                {timerOption.map(option => {
                    if (option === timerValue) {
                        return (<button key={option} type="button" className="block w-11 py-0.5 border-2 border-white rounded-lg bg-white text-black">{`${option}s`}</button>);
                    } else {
                        return (<button key={option} type="button" className="block w-11 py-0.5 text-white border-2 border-white rounded-lg hover:bg-white hover:text-black" onClick={() => {setTimerValue(option); setShowMenu(false)}}>{`${option}s`}</button>);
                    }
                })}
            </div>
            <div className={`${countDown ? "hidden" : "block"} text-center text-white text-3xl w-fit absolute left-11 bottom-12`}>
                {pictures.length}/6
            </div>
            <button type="button" disabled={nextStep || countDown} className="absolute bottom-5 camera-btn-left-center rounded-full p-10 bg-slate-500 hover:bg-slate-400 disabled:hover:bg-slate-500 disabled:opacity-40 disabled:text-slate-200" onClick={getPicture}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
            </button>

            <button
                type="button"
                onClick={goNextStep}
                className={`${nextStep ? "block" : "hidden"} absolute bottom-12 right-11 py-1.5 px-10 bg-sky-500 text- text-2xl rounded-3xl hover:bg-sky-600`}
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ms-3 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </>
    );
}

export default CameraUI;
