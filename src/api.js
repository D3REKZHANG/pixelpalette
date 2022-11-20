import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const api_url = process.env.API_URL;

export const scalePixels = () => {
  axios.post(`${api_url}/scalePixels`);
}

export const colourMatch = () => {

}


