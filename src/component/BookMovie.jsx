import React, { useState, useEffect } from 'react'
import { movies, slots, seats } from './data'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieDetails from './MovieDetails'
import { getMovieDetailsApi, sendMovieDetailsApi } from './api'
const shortid = require('shortid')

function BookMyMovie() {

    let seatsData = {}
    seats.forEach((item, i) => {
        seatsData[item] = 0
    })

    //set initial values to the selected values in the previous session, which are stored in the local storage.
    let initialSelectedSlotIndex = localStorage.getItem('selectedSlotIndex')
    if (initialSelectedSlotIndex !== null && initialSelectedSlotIndex !== "") {
        initialSelectedSlotIndex = Number(initialSelectedSlotIndex)
    }

    let initialSelectedMovieIndex = localStorage.getItem('selectedMovieIndex')
    if (initialSelectedMovieIndex !== null && initialSelectedMovieIndex !== "") {
        initialSelectedMovieIndex = Number(initialSelectedMovieIndex)
    }

    let initialSelectedSeats = localStorage.getItem('selectedSeats')
    if (initialSelectedSeats !== null) {
        initialSelectedSeats = JSON.parse(initialSelectedSeats)
    }
    else {
        initialSelectedSeats = seatsData
    }

    //this function is called each time when the user selects any of the value and stores those selected values in the local storage//
    const addToLocalStorage = (localStorageKey, newValue) => {
        localStorage.setItem(localStorageKey, newValue)
    }

    const [selectedSeats, setSelectedSeats] = useState(initialSelectedSeats)
    const [selectedMovieIndex, setSelectedMovieIndex] = useState(initialSelectedMovieIndex);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(initialSelectedSlotIndex);
    const [lastMovieDetails, setLastMovieDetails] = useState({ movie: '', slot: '', seats: {} })

    const onMovieClick = (index, movie) => {
        setSelectedMovieIndex(index);
        addToLocalStorage('selectedMovieIndex', index)
    };
    const onSlotClick = (index, slot) => {
        setSelectedSlotIndex(index);
        addToLocalStorage('selectedSlotIndex', index)
    }

    const onSeatChange = (event, id) => {
        //this function checks that the max allowed seat limit is 20 and sets the selectedSeats as per user input//
        let numOfSeats = Number(event.target.value);
        if (numOfSeats > 20) { numOfSeats = 20 }
        let temp2 = { ...selectedSeats }
        temp2[id] = numOfSeats
        setSelectedSeats(temp2)
        addToLocalStorage('selectedSeats', JSON.stringify(temp2))
    }


    const sendDataToServerFunc = (data) => {
        //this function validates whether the user has selected all fields and then sends data to server//
        let isNumOfSeatsValid = false
        for (const key in data.seats) {
            if (data.seats[key] === 0) {
                isNumOfSeatsValid = false
            } else {
                isNumOfSeatsValid = true
                break
            }
        }

        let alertMessage = '';

        if (!data.movie || data.movie === '') {
            alertMessage = 'Please! Select a Movie';
        } else if (!data.slot || data.slot === '') {
            alertMessage = 'Please! Select a Time Slot';
        } else if (isNumOfSeatsValid === false) {
            alertMessage = 'Please! Select the Seats.';
        }

        if (alertMessage === '') {
            sendMovieDetailsApi({ ...data })
                .then((res) => {
                    if (res && res.movie && res.slot && res.seats) {
                        setLastMovieDetails(res);
                        setSelectedMovieIndex(null);
                        setSelectedSlotIndex(null);
                        setSelectedSeats(seatsData);
                        addToLocalStorage('selectedMovieIndex', '');
                        addToLocalStorage('selectedSlotIndex', '');
                        addToLocalStorage('selectedSeats', JSON.stringify(seatsData));

                        // Display a success toast
                        toast.success('Booking  successfully!', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                    // Display an error toast
                    toast.error('Error occurred while sending booking details.'
                    );
                });
        } else {
            // Display an error toast
            toast.error(alertMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    useEffect(() => {
        //this function is called when the page mounts and bring the last booking details from the server//
        getMovieDetailsApi()
            .then((res) => {
                if (res && res.movie && res.slot && res.seats) {
                    setLastMovieDetails(res)
                }
            })
            .catch(error => console.log('Error  :', error));
    }, [])

    return (
        <>
            <div>
                <ToastContainer />
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center heading">BookMyMovie</div>
                </div>
                <div className="row mt-2">
                    <div className="col-lg-9 col-md-12 mt-5">
                        <div className="w-100">
                            <div>
                                <h2 className="p-3 title text-center">Book The Show Now!!</h2>
                            </div>
                            <div className="movie-row p-3">
                                <h3 className="sub-heading">Select A Movie</h3>
                                <div className="d-flex flex-wrap">
                                    {movies.map((movie, index) => (
                                        <div
                                            className={
                                                selectedMovieIndex === index
                                                    ? "movie-column-selected col-lg-2 col-md-4 col-sm-6 col-12"
                                                    : "movie-column col-lg-2 col-md-4 col-sm-6 col-12"
                                            }
                                            onClick={() => {
                                                onMovieClick(index, movie);
                                            }}
                                            key={shortid.generate()}
                                        >
                                            {movie}
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="slot-row p-3">
                                <h3 className="sub-heading">Select A Time Slot</h3>
                                <div className="d-flex flex-wrap">
                                    {slots.map((slot, index) => (
                                        <div
                                            className={
                                                selectedSlotIndex === index
                                                    ? "slot-column-selected col-lg-2 col-md-4 col-sm-6 col-12"
                                                    : "slot-column col-lg-2 col-md-4 col-sm-6 col-12"
                                            }
                                            onClick={() => {
                                                onSlotClick(index, slot);
                                            }}
                                            key={shortid.generate()}
                                        >
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="seat-row p-3">
                                <h3 className="sub-heading">Select The Seats</h3>
                                <div className="d-flex flex-wrap">
                                    {Object.keys(selectedSeats).map((seat, index) => (
                                        <div
                                            className={
                                                selectedSeats[seat] > 0
                                                    ? "seat-column-selected col-lg-2 col-md-4 col-sm-6 col-12"
                                                    : "seat-column col-lg-2 col-md-4 col-sm-6 col-12"
                                            }
                                            key={shortid.generate()}
                                        >
                                            <div className="p-2">Type {seat}:</div>
                                            <div className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    value={selectedSeats[seat]}
                                                    onChange={(event) => {
                                                        onSeatChange(event, seat);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    className="button-62"
                                    onClick={() => {
                                        sendDataToServerFunc({
                                            movie: movies[selectedMovieIndex],
                                            seats: selectedSeats,
                                            slot: slots[selectedSlotIndex],
                                        });
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12 mt-10 booking-details-column">
                        <MovieDetails lastMovieDetails={lastMovieDetails} />
                    </div>

            </div>
            </div>

        </>
    )
}

export default BookMyMovie
