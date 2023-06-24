import React from 'react'
const shortid = require('shortid')

function MovieDetails(props) {
  //this component shows the last booking details on the right side panel of the page.
  return (
    <div className='mt-5 mx-4 mb-5'>
      {props.lastMovieDetails.movie === ''
        ?
        <h2>'No Previous Movies found!!'</h2>
        :
        <div>
          <h1>Last Movie Details:</h1>
          <div className='mt-5 mx-5 booking-column'>
            <div>Movie:  {props.lastMovieDetails.movie}</div>
            <div>Slot:   {props.lastMovieDetails.slot}</div>
            <div>Seats:</div>
            {Object.keys(props.lastMovieDetails.seats).map((key) => {
              return (
                <div key={shortid.generate()}>{key} : {props.lastMovieDetails.seats[key]}</div>
              )
            })}

          </div>
        </div>}
    </div>


  )
}

export default MovieDetails
