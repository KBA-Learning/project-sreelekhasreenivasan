import express,{json} from 'express';
import mongoose from 'mongoose';
import { adminRouter} from './Routers/adminRouter.js';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

app.use(json());
app.use(cors(
    {
        origin:'http://localhost:5173',
        credentials:true,
    }
))
app.use(cookieParser());


const port = process.env.port;


mongoose.connect('mongodb://localhost:27017/Get_Your_Book');

// app.use('/',userRouter);
app.use('/',adminRouter);



app.listen(port, ()=>{
    console.log('Server listening  to port');
    
})