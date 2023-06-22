export const getMovieDetailsApi =()=>{
    return fetch('https://nodejs-bookmymovie.onrender.com/api/bookmymovie',{
        method: 'GET',
        headers: {'Content-type': 'application/json; charset=UTF-8',}
    })
    .then((response)=>{
        if(response.status===200){
            return response.json()
        }
        else{
            return null
        }  
    })
}

export const sendMovieDetailsApi  = (data={})=>{
    return fetch('https://nodejs-bookmymovie.onrender.com/api/bookmymovie/booking', {
        method: 'POST',
        body: JSON.stringify({...data}),
        headers: {'Content-type': 'application/json; charset=UTF-8',}
    })
    .then((response)=> {
        if(response.status === 200){
            return response.json()
        }
        else{
            return null
        }  
    })
}