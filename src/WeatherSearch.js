import React, { useState } from "react";
import axios from "axios";

import "./WeatherSearch.css";

export default function WeatherSearch() {
    const [city, setCity] = useState("");
    const [currentWeather, setCurrentWeather] = useState({
        city: "Kyiv",
        country: "UA",
        timestamp: 1010010 * 1000,
        description: "clear sky",
        temperature: 15,
        cloudiness: 87,
        humidity: 35,
        wind: 1.21,
        iconUrl: `http://openweathermap.org/img/wn/01d@2x.png`
    });
    const [forecast, setForecast] = useState([]);
    
    function getForecast(coordinates) {
        const apiKey = "d0acf7f4fbfe6d9b905827e17faae31d";
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(showForecast);
    }

    function showForecast(response) {
        const forecast = [];
        response.data.daily.map((day, index) => {
            if (index < 6) {
                forecast.push({
                    timestamp: day.dt * 1000,
                    iconUrl: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
                    temperatureMin: day.temp.min,
                    temperatureMax: day.temp.max
                });
            }
        });
        setForecast(forecast);
    }
    
    function showWeather(response) {
        console.log(response);
        setCurrentWeather({
            city: response.data.name,
            country: response.data.sys.country,
            timestamp: response.data.dt * 1000,
            description: response.data.weather[0].description,
            temperature: response.data.main.temp,
            cloudiness: response.data.clouds.all,
            humidity: response.data.main.humidity,
            wind: response.data.wind.speed,
            iconUrl: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        });
        getForecast(response.data.coord);
    }

    function alertNotFound() {
        setCurrentWeather({});
        setForecast([]);
    }

    function updateCity(event) {
        setCity(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (city.trim()) {
            const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
            const apiKey = "d0acf7f4fbfe6d9b905827e17faae31d";
            const units = "metric";
      
            axios
              .get(`${apiUrl}q=${city}&units=${units}&appid=${apiKey}`)
              .then(showWeather)
              .catch(alertNotFound);
        }
    }

    function formatDate(timestamp) {
        let date = new Date(timestamp);
    
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
    
        let mins = date.getMinutes();
        if (mins < 10) {
            mins = `0${mins}`;
        }
    
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let day = date.getDay();
        return `${days[day]} ${hours}:${mins}`
    }

    const currentWeatherElement = (
        <div className="weather-data">
            <div className="weather-data-header">
                <h1>{currentWeather.city}, {currentWeather.country}</h1>
                <div>Last updated: {formatDate(currentWeather.timestamp)}</div>
                <h2>{currentWeather.description}</h2>
            </div>
            <div className="row">
                <div className="col-6 d-flex">
                    <img src={currentWeather.iconUrl} alt="{weather.description} icon" />
                    <div className="d-inline temp-now">{Math.round(currentWeather.temperature)}<sup>°C</sup></div>
                </div>
                <div className="col-6 d-flex align-items-center">
                    <ul>
                        <li>Cloudiness: <span>{currentWeather.cloudiness}%</span></li>
                        <li>Humidity: <span>{currentWeather.humidity}%</span></li>
                        <li>Wind: <span>{currentWeather.wind} km/h</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const forecastElement = (
        <div className="forecast">
            <div className="row">
                {forecast.map((day) => {
                    return (
                        <div className="col-2">
                            <div className="forecast-day">{formatDate(day.timestamp).slice(0, 3)}</div>
                            <img src={day.iconUrl} alt="{day.description} icon" />
                            <div className="forecast-temp">
                                <span className="temp-max">{Math.round(day.temperatureMax)}°</span>
                                {" "}
                                <span className="temp-min">{Math.round(day.temperatureMin)}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const cardElement = (
        <div className="card">
            <div className="card-body">
                <div className="shortcut-bar">
                    <a href="/">Kyiv</a>
                    <a href="/">Bucha</a>
                    <a href="/">Hostomel</a>
                    <a href="/">Kharkiv</a>
                    <a href="/">Mariupol</a>
                </div>
                <div className="search-bar">
                    <form onSubmit={handleSubmit}>
                        <input type="search" className="form-control" placeholder="type a city ..." onChange={updateCity} />
                        <button className="btn btn-search" type="submit">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                    <button className="btn btn-current">Current</button>
                </div>
                {currentWeatherElement}
                {forecastElement}
            </div>
        </div>
    );

    const loadingElement = (
        <p className="m-0 text-center">The App is loading... Please wait a moment...</p>
    );

    return (
        <div className="WeatherSearch">
            {cardElement}
            <div className="credentials">
                <a href="https://github.com/liza-rgb/weather-app-react">Open-sourced</a> by Liza Stoliarchuk
            </div>
        </div>
    );
}