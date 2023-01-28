import { useState, useRef, useEffect } from "react";
import { getAllAttendees, getAllBadges } from "@lib/api";

export default function Dashboard() {
  const [attendees, setAttendees] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    getAllAttendees().then((res) => {
      setAttendees(res.data);
    });
  }, []);
  console.log(attendees);

  useEffect(() => {
    getAllBadges().then((res) => {
      setBadges(res.data);
      // set 100 badges
      setBadges(Array(100).fill(res.data[0]));
    });
  }, []);
  let length = badges.length;
  console.log(length);
  console.log(badges);

  return (
    <div className="items-center overflow-x-scroll py-2">
      <h1 className="mb-8 text-3xl font-bold text-white">Dashboard</h1>
      <div className="ml-32 flex h-32 min-w-fit items-center rounded-lg border-2 text-left shadow-md">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex h-32 w-32 items-center justify-center"
          >
            <img
              src={badge.avatar}
              className="h-16 w-16 rounded-md object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex min-w-fit flex-1 flex-col  text-center">
        <div className="grid grid-cols-1 gap-4">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex flex-row items-center rounded-lg border-2 text-left shadow-md"
            >
              <h3 className="ml-4 w-28 text-xl font-bold text-white">
                {attendee.name}
              </h3>
              <p className="text-lg text-white">{attendee.email}</p>
              <div className="flex flex-row">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex h-32 w-32 items-center justify-center"
                  >
                    <input
                      type="checkbox"
                      className="h-16 w-16 rounded-md object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
