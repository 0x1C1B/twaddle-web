import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import StackTemplate from "../components/templates/StackTemplate";
import Button from "../components/atoms/Button";
import authSlice from "../store/slices/auth";

export default function Room() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState(null);
  const [socketError, setSocketError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socketLoading, setSocketLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [ticket, setTicket] = useState(null);

  const onFetchRoom = (id) => {
    setLoading(true);
    setError(null);

    return axios
      .get(`/rooms/${id}`, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRoom(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.data?.code === "InvalidTokenError") {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else if (
          err.response &&
          err.response.data?.code === "NotFoundError"
        ) {
          navigate("/404");
        } else {
          setError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setLoading(false));
  };

  const onFetchTicket = () => {
    setLoading(true);
    setError(null);

    return axios
      .post("/tickets", null, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTicket(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.data?.code === "InvalidTokenError") {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else {
          setError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = `Twaddle Web | ${room?.name || "Room"}`;
  }, [room]);

  useEffect(() => {
    onFetchRoom(roomId).then(onFetchTicket);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (ticket) {
      setSocketLoading(true);
      setSocketError(null);

      const socket = io(process.env.REACT_APP_TWADDLE_WS_URI, {
        reconnection: false,
        query: {
          ticket: ticket.ticket,
        },
      });

      socket.on("connect", () => setSocketLoading(false));

      socket.on("connect_error", () => {
        setSocketError("An unexpected error occurred, please retry!");
        setSocketLoading(false);
      });
    }
  }, [ticket]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto px-2 sm:px-6 lg:px-8 py-4 h-full">
          <div className="flex flex-col space-y-4 h-full">
            {loading && (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
              </div>
            )}
            {!loading && error && (
              <p className="text-center text-red-500">{error}</p>
            )}
            {!loading && !error && (
              <div className="flex flex-col grow bg-gray-100 dark:bg-gray-500 rounded-md">
                <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 dark:text-white rounded-t-md">
                  <nav className="rounded-md w-full">
                    <ol className="list-reset flex">
                      <li>
                        <Link
                          className="text-amber-500 hover:text-amber-400"
                          to="/rooms"
                        >
                          Rooms
                        </Link>
                      </li>
                      <li>
                        <span className="text-gray-500 mx-2">/</span>
                      </li>
                      <li className="text-gray-500">{room?.name || "Room"}</li>
                    </ol>
                  </nav>
                </div>
                <div className="grow px-3 py-2">
                  {socketLoading && (
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
                    </div>
                  )}
                  {!socketLoading && socketError && (
                    <p className="text-center text-red-500">{socketError}</p>
                  )}
                </div>
                <div className="flex w-full shrink">
                  <textarea
                    autoFocus
                    rows="1"
                    placeholder="Message"
                    disabled={loading || error}
                    className="relative bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border border-gray-300 dark:border-gray-500 block w-full px-3 py-2 rounded-b-md rounded-r-none grow focus:outline-none focus:outline-lime-500 disabled:opacity-50 resize-none"
                  />
                  <Button
                    className="border-l-0 rounded-l-none rounded-t-none"
                    disabled={loading || error}
                  >
                    <PaperAirplaneIcon
                      className="h-6 w-6 rotate-90"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
