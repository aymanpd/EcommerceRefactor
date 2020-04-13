import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
const CancelToken = axios.CancelToken;


const useFetch = (requestConfig) => {
    const [response, setResponse] = useState({ loading: false, errored: false });
    useEffect(() => {
        setResponse({ ...response, loading: true });

        const cancelRequest = CancelToken.source();
        axiosInstance({ ...requestConfig, cancelToken: cancelRequest.token })
            .then(({ data }) => setResponse({ loading: false, errored: false, data })) // success
            .catch((err) => {
                if (axios.isCancel(err)) { // cancelled
                    console.log("request cancelled", err);
                    return;
                }
                setResponse({ loading: false, errored: err, data: undefined }); // fail
            });
        return () => {
            cancelRequest.cancel();
        }
        // eslint-disable-next-line
    }, [requestConfig])

    return response;
}

export default useFetch;