import axios from "axios";

// create axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})


// set access token in authorization header for each request
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// method to handle expired tokens and refresh automatically if able to
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 403) {
            console.log('Access token has expired. Attempting refresh...');

            try {
                // api call to refresh token
                const refreshResponse = await axios.post('http://localhost:3000/api/auth/refreshToken', {}, { withCredentials: true });

                const { accessToken } = refreshResponse.data;

                // save new accessToken
                sessionStorage.setItem('accessToken', accessToken);

                // retry request with new token
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(error.config);
            } catch (refreshError) {
                console.error('Issue with refreshing access token...', refreshError);

                // propagate error to deal on frontend
                return Promise.reject({status: 403, originalError: refreshError});
            }
        }

        return Promise.reject(error);

    }
);

export default api;

