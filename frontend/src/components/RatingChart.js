import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useWebSocket } from '../contexts/WebSocketContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RatingChart = ({ storeId }) => {
    const [ratingData, setRatingData] = useState({
        labels: [],
        datasets: []
    });
    const { lastMessage } = useWebSocket();

    useEffect(() => {
        // Fetch initial rating data
        fetchRatingHistory();
    }, [storeId]);

    useEffect(() => {
        if (lastMessage?.type === 'RATING_UPDATE' && lastMessage.data.store_id === storeId) {
            updateChartData(lastMessage.data);
        }
    }, [lastMessage]);

    const fetchRatingHistory = async () => {
        try {
            const response = await fetch(`/api/ratings/store/${storeId}`);
            const data = await response.json();
            
            const sortedRatings = data.sort((a, b) => 
                new Date(a.created_at) - new Date(b.created_at)
            );

            const labels = sortedRatings.map(rating => 
                new Date(rating.created_at).toLocaleDateString()
            );

            const ratings = sortedRatings.map(rating => rating.rating);
            const movingAverage = calculateMovingAverage(ratings, 5);

            setRatingData({
                labels,
                datasets: [
                    {
                        label: 'Individual Ratings',
                        data: ratings,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        pointRadius: 4
                    },
                    {
                        label: '5-Day Moving Average',
                        data: movingAverage,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderDash: [5, 5],
                        pointRadius: 0
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching rating history:', error);
        }
    };

    const calculateMovingAverage = (data, window) => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < window - 1) {
                result.push(null);
                continue;
            }
            const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
            result.push(sum / window);
        }
        return result;
    };

    const updateChartData = (newRating) => {
        setRatingData(prevData => {
            const newLabels = [...prevData.labels, new Date(newRating.created_at).toLocaleDateString()];
            const newRatings = [...prevData.datasets[0].data, newRating.rating];
            const newMovingAverage = calculateMovingAverage(newRatings, 5);

            return {
                labels: newLabels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: newRatings
                    },
                    {
                        ...prevData.datasets[1],
                        data: newMovingAverage
                    }
                ]
            };
        });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Store Rating Trends'
            }
        },
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="rating-chart">
            <Line options={options} data={ratingData} />
        </div>
    );
};

export default RatingChart;