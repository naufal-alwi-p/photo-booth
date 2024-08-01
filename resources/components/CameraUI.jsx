import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";

function CameraUI({ getPicture, cameraFunction, pictures, countDown, goNextStep, nextStep  }) {
    const [ showMenu, setShowMenu ] = useState(false);
    const timerMenu = useRef(null);

    const timerOption = [3, 5, 7];

    const [ timerValue, setTimerValue ] = useState(timerOption[1]);

    const handler = (e) => {
        if (showMenu && (!timerMenu.current?.contains(e.target) && timerMenu.current?.previousSibling !== e.target)) {
            setShowMenu(false);
        }
    };

    let voice1 = new Audio(`${window.location.origin}/audio/countdown.wav`);
    let voice2 = new Audio(`${window.location.origin}/audio/1-second.wav`);
    let voice3 = new Audio(`${window.location.origin}/audio/shutter.mp3`);

    useEffect(() => {
        document.addEventListener("click", handler);

        return () => document.removeEventListener("click", handler);
    }, [showMenu]);

    return (
        <>
            {countDown && <div className={`absolute ${window.innerHeight <= window.innerWidth ? "timer-top-center" : "top-12"} timer-left-center opacity-80`}>
                <CountdownCircleTimer
                    isPlaying
                    duration={timerValue}
                    colors={['#0F172A', '#CBD5E1']}
                    colorsTime={[5, 0]}
                    onUpdate={(time) => {
                        if (time > 1) {
                            voice1.play();
                        }
                        
                        if (time === 1) {
                            voice2.play();
                        }
                        
                        if (time === 0) {
                            voice3.play();
                        }
                    }}
                    onComplete={cameraFunction}
                >
                    {({ remainingTime }) => {
                        return (
                            <span className="text-white text-5xl">{remainingTime}</span>
                        );
                    }}
                </CountdownCircleTimer>
            </div>}
            <Link href="/start" className="bg-red-500 hover:bg-red-600 text-white px-5 py-1 rounded-full absolute top-12 left-11 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 me-3 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Go Back
            </Link>
            <button
                type="button"
                className={`${countDown || nextStep ? "hidden" : "block"} absolute top-12 right-11 w-80 text-4xl py-0.5 border-2 border-white rounded-lg text-white ${showMenu === "timer" ? "bg-violet-700" : "bg-violet-600"} hover:bg-violet-700`}
                onClick={() => setShowMenu(showMenu === "timer" ? false : "timer")}
            >
                {`Timer: ${timerValue} seconds`}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-7 ms-2 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <div
                className={`${showMenu === "timer" ? "block" : "hidden"} absolute top-28 right-11 w-fit flex flex-col gap-y-2`}
                ref={timerMenu}
            >
                {timerOption.map(option => {
                    if (option === timerValue) {
                        return (<button key={option} type="button" className="block w-16 text-3xl py-0.5 border-2 border-white rounded-lg bg-white text-black">{`${option}s`}</button>);
                    } else {
                        return (<button key={option} type="button" className="block w-16 text-3xl py-0.5 text-white border-2 border-white rounded-lg hover:bg-white hover:text-black" onClick={() => {setTimerValue(option); setShowMenu(false)}}>{`${option}s`}</button>);
                    }
                })}
            </div>
            <div className={`${countDown ? "hidden" : "block"} text-center text-white text-4xl w-fit absolute left-11 bottom-12`}>
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
                className={`${nextStep ? "block" : "hidden"} absolute bottom-12 right-11 py-1.5 px-10 bg-sky-500 text- text-4xl text-white rounded-3xl hover:bg-sky-600`}
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 ms-3 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </>
    );
}

export default CameraUI;
