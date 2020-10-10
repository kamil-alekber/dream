import {Router} from 'express';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';
import { loginValidation, registerValidation } from '../../helpers/validators';

const router = Router();

router
    .route('/register')
    .get((req, res) => {
        res.render('pages/register', {title: 'Register'})
    })
    .post(async(req, res)=> {
        const {firstName, lastName, password, email } = req.body;
        const username = `${firstName.trim()} ${lastName.trim()}`

        const { error } = registerValidation({...req.body, username});
        if (error) {
          return res.status(400).json({
            error: true,
            message: error.details[0].message,
            data: null,
          });
        }
        
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

router.route('/login')
    .get((req, res)=> {
        return res.render('pages/user', {title: 'user'})
    })
    .post(async (req, res)=> {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({
              error: true,
              message: error.details[0].message,
              data: null,
            });
        }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Email is not registered",
        data: null,
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.hashedPassword
    );

    if (!validPassword) {
      return res.status(400).json({
        error: true,
        message: "Password is not valid",
        data: null,
      });
    }

    return {
            error: false,
            message: 'Success',
            data: user
        }
})

export {router as AuthRoutes};