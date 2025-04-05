
import RecentReservations from "./RecentReservations";

export default function CustomerReservationSection({ reservations }) {
    const reversedReservations = [...(reservations || [])].reverse();
  
    // console.log({ reservations, reversedReservations });
  
    return (
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        {reversedReservations.map((reservation, index) => (
          <RecentReservations reservation={reservation} key={index} />
        ))}
      </div>
    );
  }
  