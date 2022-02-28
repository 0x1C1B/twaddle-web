import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  SearchIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid";
import StackTemplate from "../components/templates/StackTemplate";
import RoomCreationModal from "../components/organisms/RoomCreationModal";
import TextField from "../components/atoms/TextField";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import authSlice from "../store/slices/auth";

export default function Rooms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageable, setPageable] = useState(null);
  const [rooms, setRooms] = useState([]);

  const fetchPage = (page = 0) => {
    setLoading(true);
    setError(null);

    axios
      .get("/rooms", {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      })
      .then((res) => {
        setRooms(res.data.content);
        setPageable(res.data.info);
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
    document.title = "Twaddle Web | Chat";
  }, []);

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, token]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto px-2 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4">
            <div
              className={`flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center ${
                user?.role === "ADMINISTRATOR"
                  ? "md:justify-between"
                  : "md:justify-center"
              }`}
            >
              <div className="flex w-full md:w-1/2">
                <TextField
                  type="text"
                  placeholder="Room name"
                  className="rounded-r-none grow"
                />
                <Button className="border-l-0 rounded-l-none">
                  <SearchIcon className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              {user?.role === "ADMINISTRATOR" && (
                <RoomCreationModal onSuccess={() => fetchPage()} />
              )}
            </div>
            <hr className="border-gray-300 dark:border-gray-400" />
            {loading && (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
              </div>
            )}
            {!loading && error && (
              <p className="text-center text-red-500">{error}</p>
            )}
            {!loading && !error && rooms.length <= 0 && (
              <p className="text-center text-gray-800 dark:text-white">
                No chat rooms available.
              </p>
            )}
            {!loading && !error && rooms.length > 0 && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="shadow rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:brightness-110 hover:cursor-pointer p-4 max-h-36 flex space-x-4"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    <div className="h-28 aspect-square">
                      <Avatar value={room.name} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="overflow-hidden">
                        <h2 className="text-lg font-bold truncate">
                          {room.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis">
                          {room.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && rooms.length > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Showing&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pageable.page * pageable.perPage + 1}
                  </span>
                  &nbsp;to&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(
                      pageable.page * pageable.perPage + pageable.perPage,
                      pageable.totalElements
                    )}
                  </span>
                  &nbsp;of&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pageable.totalElements}
                  </span>
                  &nbsp;Rooms
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <Button
                    variant="primary"
                    disabled={pageable.page * pageable.perPage + 1 <= 1}
                    className="border-r-0 rounded-r-none inline-flex"
                    onClick={() => fetchPage(pageable.page - 1)}
                  >
                    <ArrowLeftIcon
                      className="h-6 w-6 mr-2"
                      aria-hidden="true"
                    />
                    Prev
                  </Button>
                  <Button
                    variant="primary"
                    disabled={
                      Math.min(
                        pageable.page * pageable.perPage + pageable.perPage,
                        pageable.totalElements
                      ) >= pageable.totalElements
                    }
                    className="border-l-0 rounded-l-none inline-flex"
                    onClick={() => fetchPage(pageable.page + 1)}
                  >
                    Next
                    <ArrowRightIcon
                      className="h-6 w-6 ml-2"
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
