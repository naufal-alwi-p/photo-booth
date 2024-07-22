import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CountDownTimer from "../../components/CountDownTimer";
import { router } from "@inertiajs/react";
import CustomLoading from "../../components/CustomLoading";


function SelectOption ({ image, csrf, price }) {
    const [ display, setDisplay ] = useState(false);
    const [ midtransResponse, setMidtransResponse ] = useState(null);
    const [ option, setOption ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const noMenu = (e) => e.preventDefault();

    useEffect(() => {
        document.documentElement.addEventListener('contextmenu', noMenu);
        let timer = setTimeout(() => {
            setDisplay("option");
        }, 1400);

        return () => {
            clearTimeout(timer);
            document.documentElement.removeEventListener('contextmenu', noMenu);
        };
    }, []);

    function getQris(e) {
        setLoading(true);
        setOption(price[Number(e.target.value)]);
        const grossAmount = price[Number(e.target.value)].price;

        const data = JSON.stringify({
            grossAmount: grossAmount
        });

        const qrisRequest = fetch(`${window.location.origin}/get-qris`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "X-CSRF-TOKEN": `${csrf}`
            },
            body: data
        });

        qrisRequest.then((response) => {
            return response.json();
        }).then((result) => {
            if (result.response.fraud_status === "accept") {
                console.log(result.response);
                setMidtransResponse(result.response);
                setDisplay("qris");
            } else {
                throw Error("Something's wrong");
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    function checkStatus() {
        setLoading(true);
        const urlStatus = midtransResponse.actions[2].url;

        const data = JSON.stringify({
            url: urlStatus
        });

        const fetchStatus = fetch(`${window.location.origin}/check-status-qris`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "X-CSRF-TOKEN": `${csrf}`
            },
            body: data
        });

        fetchStatus.then((response) => {
            return response.json();
        }).then((result) => {
            const response = JSON.parse(result.response);

            if (response.transaction_status === "capture" || response.transaction_status === "settlement") {
                setDisplay(true);
                setTimeout(() => {
                    router.post("/status-payment", { image: image, option: option, transaction_status: response.transaction_status });
                }, 1000);
            } else if (response.transaction_status === "pending") {
                setMidtransResponse((prevValue) => {
                    console.log(response);
                    if (prevValue.transaction_id === response.transaction_id) {
                        return {...prevValue, ...response};
                    } else {
                        return prevValue;
                    }
                })
            } else {
                setDisplay(true);
                setTimeout(() => {
                    router.post("/status-payment", { transaction_status: response.transaction_status });
                }, 1000);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    function cancelPayment() {
        setLoading(true);
        const urlCancel = midtransResponse.actions[3].url;

        const data = JSON.stringify({
            url: urlCancel
        });

        const fetchCancel = fetch(`${window.location.origin}/cancel-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "X-CSRF-TOKEN": `${csrf}`
            },
            body: data
        });

        fetchCancel.then((response) => {
            return response.json();
        }).then((result) => {
            const response = JSON.parse(result.response);
            console.log(response);
            if (response.transaction_status === "cancel") {
                setDisplay(true);
                setTimeout(() => {
                    router.post("/status-payment", { transaction_status: response.transaction_status });
                }, 1000);
            } else {
                throw Error("Something's wrong");
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    function onExpire() {
        setDisplay(true);
        setTimeout(() => {
            router.post("/status-payment", { transaction_status: response.transaction_status });
        }, 1000);
    }

    return (
        <div className="h-screen bg-[url('/assets/select-bg.png')] flex items-center flex-col overflow-hidden relative">
            <AnimatePresence>
                {(!display || display === "option") &&
                    <motion.h1
                        key={"header"}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                        className="text-white text-8xl font-bold mt-7 text-center absolute w-full"
                    >
                        Choose Option
                    </motion.h1>
                }

                {display === "option" &&
                    <motion.div
                        key={"option"}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 0.3, duration: 1 } }}
                        exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                        className="flex justify-center portrait:flex-col portrait:gap-y-14 h-full items-center absolute w-full"
                    >
                        <button
                            type="button"
                            className="text-6xl font-bold px-5 py-3 rounded-2xl bg-[#F76505] hover:bg-orange-600 text-white landscape:w-1/3 portrait:w-1/2 mx-auto"
                            value="0"
                            onClick={getQris}
                        >
                            Download The Picture {price[0].price_str}
                        </button>

                        <button
                            type="button"
                            className="text-6xl font-bold px-5 py-3 rounded-2xl bg-[#F76505] hover:bg-orange-600 text-white landscape:w-1/3 portrait:w-1/2 mx-auto"
                            value="1"
                            onClick={getQris}
                        >
                            Print The Picture {price[1].price_str}
                        </button>
                    </motion.div>
                }
                {display === "qris" &&
                    <>
                        <motion.h1
                            key={"header2"}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 1.3, duration: 1 } }}
                            exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                            className="text-white text-8xl font-bold mt-7 text-center"
                        >
                            Scan QRIS
                        </motion.h1>
                        <motion.div
                            key={"payment"}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, transition: { repeat: 0, delay: 2.3, duration: 1 } }}
                            exit={{ opacity: 0, scale: 0.1, transition: { repeat: 0, duration: 1 } }}
                            className="flex flex-col justify-center h-full w-full items-center relative"
                        >
                            <img src={midtransResponse.actions[0].url} alt="QRIS Image" className="landscape:w-1/3 portrait:w-1/2" />
                            <p className="bg-white font-bold px-3 py-3 rounded-lg text-3xl mt-7">{option.price_str}</p>
                            <p className="text-white text-5xl mt-7">
                                Time Remaining <CountDownTimer expiryTimestamp={new Date(midtransResponse.expiry_time)} onExpire={onExpire} />
                            </p>
                            <button
                                type="button"
                                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-2xl absolute bottom-5 right-5"
                                onClick={checkStatus}
                            >
                                Check Payment Status
                            </button>
                            <button
                                type="button"
                                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-2xl absolute bottom-5 left-5"
                                onClick={cancelPayment}
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </>
                }
                {loading && <CustomLoading key={"load"} className="size-10 text-white absolute bottom-5" strokeWidth={2} />}
            </AnimatePresence>
        </div>
    );
}

export default SelectOption;
