import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StackTemplate from "../components/templates/StackTemplate";
import ChatBox from "../components/organisms/ChatBox";
import { fetchRoom } from "../api/rooms";
import { createTicket } from "../api/tickets";

export default function Room() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [room, setRoom] = useState(null);
  const [ticket, setTicket] = useState(null);

  const onOpenRoom = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const roomRes = await fetchRoom(id);
      const ticketRes = await createTicket();

      setRoom(roomRes.data);
      setTicket(ticketRes.data.ticket);
    } catch (err) {
      if (err.response && err.response.data?.code === "InvalidTokenError") {
        navigate("/login");
      } else if (err.response && err.response.data?.code === "NotFoundError") {
        navigate("/404");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (room) {
      document.title = `Twaddle Web | ${room.name}`;
    } else {
      document.title = "Twaddle Web | Room";
    }
  }, [room]);

  useEffect(() => {
    if (roomId) {
      onOpenRoom(roomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto h-full">
          <div className="flex flex-col space-y-4 h-full">
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
              </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && <ChatBox room={room} ticket={ticket} />}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
