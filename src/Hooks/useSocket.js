import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import { getHeimdallToken } from "../service/userServices/getHeimdallToken";
import moment from "moment";

const useSocket = (paths, params) => {
    const [token, setToken] = useState(null);
    const [heimdallTokenExp, setHeimdallTokenExp] = useState(null);
    const socketRef = useRef([]);

    const headers = {
        "client-id": process.env.REACT_APP_DS_CLIENT_ID,
        "client-secret": process.env.REACT_APP_DS_CLIENT_SECRET,
    };

    useEffect(() => {
        const pathArray = Array.isArray(paths) ? paths : [paths];

        if (!heimdallTokenExp) {
            // //console.log('first time getting token: ', heimdallTokenExp);
            getToken();
        }

        if (token && !isExpired(heimdallTokenExp)) {
            ////console.log('token exists and not expired: ', heimdallTokenExp);
            //connect to socket
            // workerRef.current  = new Worker('../../../worker/socketWorker.js');
            pathArray.forEach((path, index) => {
                socketRef.current[index] = io(`${process.env.REACT_APP_HEIMDALL_BASE_URL}${path.namespace}`, {
                    path: path.path,
                    query: { token: token, meetingid: params.meetingId, focus: params.focus },
                    transports: ['websocket'],
                });

                if (process.env.NODE_ENV === 'development') {
                    socketRef.current[index].on('connect', () => {
                        //console.log("connected to server-",index ,': ', socketRef.current[index].connected);
                    })
                    socketRef.current[index].on("disconnect", () => {
                        //console.log("socket disconnected-",index ,': ', !socketRef.current[index].connected);
                    });
                    socketRef.current[index].on("connect_error", (error) => {
                        //console.log("connection error-",index ,': ', error.message);
                    })
                    socketRef.current[index].on("Response", (error) => {
                        //console.log("response-",index ,': ', error);
                    })
                }

            })
        } else {
            // console.log('token expired: ', heimdallTokenExp);
            getToken();
        }

        return () => {
            socketRef.current.forEach(socket => {
                socket.disconnect();
            })
        }

    }, [paths, heimdallTokenExp])

    async function getToken() {
        if (!heimdallTokenExp) {
            // console.log("getting token when no token exists");         
            const newToken = await getHeimdallToken(headers);
            setHeimdallTokenExp(newToken?.data.expiry);
            setToken(newToken?.data.token);
        } else if (isExpired(heimdallTokenExp)) {
            // console.log("getting token when token is expired");
            const newToken = await getHeimdallToken(headers);
            setHeimdallTokenExp(newToken?.data.expiry);
            setToken(newToken?.data.token);
        }
    }

    function isExpired(expTime) {
        const expTimeDate = moment(expTime).utcOffset(0, true);
        const now = moment().utc().utcOffset(0, true);
        return !expTimeDate.isSameOrAfter(now);
    }

    return socketRef.current;
}

export default useSocket;