import { useTimer } from "react-timer-hook";

function CountDownTimer({ expiryTimestamp, onExpire, className = "" }) {
    const {
        hours,
        seconds,
        minutes,
    } = useTimer({ expiryTimestamp, onExpire });

    return (
        <span className={className}>{hours == "0" ? '' : `${hours}:`}{minutes}:{seconds}</span>
    );
}

export default CountDownTimer;
