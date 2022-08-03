import React, { Component } from 'react';

const Weather = () => {
    const [celsius, setCelsius] = React.useState()
    const [rainfall, setRainfall] = React.useState()

    return (
        <div>
            <h2>Weather</h2>
            <div className={"stats"}>
                <p>Temperature: {celsius}c</p>
                <p>Rainfall: {rainfall}mm</p>
            </div>
        </div>
    )
}

export default Weather;