import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StackTemplate from "../components/templates/StackTemplate";
import ChatBox from "../components/organisms/ChatBox";
import authSlice from "../store/slices/auth";

export default function Room() {
  const { roomId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const [apiError, setApiError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [room, setRoom] = useState(null);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (room) {
      document.title = `Twaddle Web | ${room.name}`;
    } else {
      document.title = "Twaddle Web | Room";
    }
  }, [room]);

  useEffect(() => {
    /**
     * Fetchs the room resource.
     *
     * @param {string} reqRoomId Unique identifier of room to fetch
     * @param {string} reqToken Access token to use for request
     * @returns {Promise<AxiosResponse>} Returns the response
     */
    const fetchRoom = (reqRoomId, reqToken) => {
      return axios.get(`/rooms/${reqRoomId}`, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${reqToken}` },
      });
    };

    /**
     * Fetchs a ticket for establishing the web socket session.
     *
     * @param {string} reqToken Access token to use for request
     * @returns {Promise<AxiosResponse>} Returns the response
     */
    const fetchTicket = (reqToken) => {
      return axios.post("/tickets", null, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${reqToken}` },
      });
    };

    if (roomId && token) {
      setLoading(true);
      setApiError(null);
      setError(null);

      fetchRoom(roomId, token)
        .then((res) => setRoom(res.data))
        .then(() => fetchTicket(token))
        .then((res) => setTicket(res.data.ticket))
        .catch((err) => setApiError(err))
        .finally(() => setLoading(false));
    }
  }, [roomId, token]);

  useEffect(() => {
    if (apiError) {
      if (
        apiError.response &&
        apiError.response.data?.code === "InvalidTokenError"
      ) {
        dispatch(authSlice.actions.logout());
        navigate("/login");
      } else if (
        apiError.response &&
        apiError.response.data?.code === "NotFoundError"
      ) {
        navigate("/404");
      } else {
        setError("An unexpected error occurred, please retry!");
      }
    }
  }, [apiError, dispatch, navigate]);

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
            {!loading && !error && !apiError && (
              <ChatBox room={room} ticket={ticket} />
            )}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
