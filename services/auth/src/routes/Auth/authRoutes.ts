import {Router} from 'express';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import crypto  from 'crypto';
import { User } from '../../models/User';
const router = Router();

router
    .route('/register')
    .get((req, res) => {
        res.render('pages/register', {title: 'Register'})
    })
    .post(async(req, res)=> {
        const {firstName, lastName, password, email } = req.body;
        
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt)
        
        const user = await User.findOne({ email })
        console.log({user});
        
        if(user) return res.status(400).json({
            error: true,
            message: 'User already exists',
            data: null,
        })

        const newUser = await User.create({
            email,
            hashedPassword,
            userId: uuid4(),
            username: firstName.trim() + ' ' + lastName.trim()
        })

        return res.status(200).json({
            error: null,
            message: 'Success',
            data: newUser
        });
    });

export {router as AuthRoutes};