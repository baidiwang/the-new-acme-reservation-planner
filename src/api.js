const axios = require('axios');
// check the second part beginning video to why we not use method-override and destroy


//why don't we need await here? 
const fetchUsers = () => {
    return axios.get('/api/users');
}

const fethchRestaurants = () => {
    return axios.get('/api/restaurants');
}

const fetchReservations = (id) => {
    return axios.get(`/api/users/${id}/reservations`);
}


const deleteReservations = (id) => {
    return axios.delete(`/api/reservations/${id}`);
}


//check the video for this part
const createReservations = async({ userId, restaurantId }) => {
    const response = await axios.post(`/api/users/{userId}/reservations`, {
        restaurantId
    });
    return response.data;
};


const createUser = async( user) => {
    const response = await axios.post('/api/users', user);
    return response.data;
};


module.express = {
    fetchUsers,
    fethchRestaurants,
    fetchReservations,
    deleteReservations,
    createReservations,
    createUser
}