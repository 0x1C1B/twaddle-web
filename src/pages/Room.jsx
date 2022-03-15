import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StackTemplate from "../components/templates/StackTemplate";
import MessageBox from "../components/molecules/MessageBox";
import { useTwaddleChat } from "../contexts/twaddle-chat";
import { fetchRoom } from "../api/rooms";
import { createTicket } from "../api/tickets";

export default function Room() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const {
    connecting,
    connected,
    joined,
    joining,
    error,
    messages,
    connect,
    join,
    send,
  } = useTwaddleChat();

  const [apiError, setApiError] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);

  const [room, setRoom] = useState(null);
  const [ticket, setTicket] = useState(null);

  const onOpenRoom = async (id) => {
    setApiLoading(true);
    setApiError(null);

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
        setApiError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setApiLoading(false);
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

  useEffect(() => {
    if (ticket) {
      connect(process.env.REACT_APP_TWADDLE_WS_URI, ticket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);

  useEffect(() => {
    if (connected && room) {
      join(room.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, room]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto h-full">
          <div className="flex flex-col space-y-4 h-full">
            {apiLoading && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
              </div>
            )}
            {apiError && <p className="text-center text-red-500">{apiError}</p>}
            {!apiLoading && !apiError && (
              <MessageBox
                room={room}
                connecting={connecting || joining}
                connected={connected && joined}
                error={error}
                messages={messages}
                onNewMessage={(message) => send(message)}
              />
            )}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
