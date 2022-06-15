const api = require('./api');

const state = {
}; //state object needs methods to put in

const restaurantsList = document.querySelector('#restaurants-list'); //documnet and window
const usersList = document.querySelector('#users-list');
const reservationsList = document.querySelector('#reservations-list'); 
const form = document.querySelector('form');

form.addEventListener('submit', async(ev)=>{
    ev.preventDefault();
    const input = document.querySelector('input');
    const name = input.value;
    const user = await api.createUser({name});
    state.users.push(user);
    window.location.hash = user.id; 
    input.value = ''; 
});



window.addEventListener('haschange', async()=> {
    renderUsers();
    await fetchReservations();
    renderRestaurants();
    renderReservations();
});


restaurantsList.addEventListener('click', async(ev)=>{
    if(ev.target.tagName ==='LI'){ // Why LI instead of li 
        const restaurantId = ev.target.getAttribute('data-id');
        const userId = window.location.hash.slice(1);
        if(!userId){
            return;
        }
        const reservation = await api.createReservations({ userId, restaurantId});
        state.reservations.push(reservation);
        renderRestaurants();
        renderReservations();
    }
})


reservationsList.addEventListener('click', async(ev)=> {
    if(ev.target.tagName === 'LI'){
      const reservationId = ev.target.getAttribute('data-id')*1;
      await api.deleteReservation(reservationId);
      state.reservations = state.reservations.filter(reservation => reservation.id !== reservationId);
      renderRestaurants();
      renderReservations();
    }
  });
  


const fetchUsers = async() => {
    const response = await api.fetchUsers();
    state.users = response.data;
};


const fethchRestaurants = async()=> {
    const response = await api.fetchRestaurants(); 
    state.restaurants = response.data;
};


const fetchReservations = async()=> {
    const id = window.location.hash.slice(1);
    if(id){
      const response = await api.fetchReservations(id); 
      state.reservations = response.data;
    }
    else { 
      state.reservations = [];
    }
  }


const renderUsers = () =>{
    const id = window.location.hash.slice(1)*1;
    const html = state.users.map( user=> {
        return `
        <li class='${ user.id === id ? 'selected' : '' }'>
        <a href='#${user.id}'>
        ${ user.name }
        </a>
        </li>`;
    }).join('');
    usersList.innerHTML = html;
};


const renderRestaurants = () => {
    const html = state.restaurants.map( restaurant=> {
        const count = state.reservations.filter(reservation => reservation.restaurantId === restaurant.id).length;
        return `
        <li data-id='${ restaurant.id }' class='${ count > 0 ? 'selected' : '' }'>
        ${ restaurant.name } (${ count })
        </li>`;
    }).join('');
    restaurantsList.innerHTML = html;
};



const renderReservations = () => {
    const html = state.reservations.map( reservation => {
        const restaurant = state.restaurants.find( restaurant => restaurant.id === reservation.restaurantId); // why we use restaurantId instead of restaurant.id? 
        return `
        <li data-id='${ reservation.id }'>
        ${ restaurant.name }
        (${new Date(reservation.createAt).toLocaleString() }) 
        </li>`; //createAt means?
    }).join('');
    reservationsList.innerHTML = html;
};


const start = async() => {
    await fetchUsers(); //why we need await here 
    await fethchRestaurants();
    await fetchReservations();
    renderUsers();
    renderRestaurants();
    renderReservations();
};

start();