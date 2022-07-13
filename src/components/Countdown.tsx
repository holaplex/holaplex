import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

function calculateTimeLeft(endTime: string) {
  const now = DateTime.local();
  const end = DateTime.fromISO(endTime);

  return Duration.fromObject(end.diff(now).toObject());
}

function Countdown(props: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(props.endTime));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(props.endTime));
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  if (timeLeft.valueOf() < 0) return <span></span>;

  const format = timeLeft.toFormat("hh'h' mm'm' ss's'");

  return <span className="text-right text-base font-semibold text-white">{format}</span>;
}

export default function AuctionCountdown(props: { endTime: string }) {
  const timeDiffMs = DateTime.fromISO(props.endTime).toMillis() - Date.now();
  const lessThanADay = timeDiffMs < 86400000; // one day in ms

  if (lessThanADay) {
    // only return the "expensive" Countdown component if required
    return <Countdown endTime={props.endTime} />;
  } else {
    const timeLeft = calculateTimeLeft(props.endTime).toFormat('dd:hh:mm:ss');

    const daysLeft2 = Number(timeLeft.slice(0, 2));

    return (
      <span className="text-right text-base font-semibold text-white">
        {daysLeft2} day{daysLeft2 > 1 && 's'}
      </span>
    );
  }
}
