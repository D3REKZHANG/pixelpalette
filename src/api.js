import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

export const scalePixels = () => {
  axios.post(`${process.env.API_URL}/scalePixels`);
}

export const colourMatch = () => {

}


