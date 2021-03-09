import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

//fetch get token and atuh user
//POST
const authUser = asyncHandler(async(req,res) => {
    const {email, password}  = req.body
    
    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            tokent: null
        })
    } else {
        res.status(401)
        throw new Error ('Invalid password and email')
      
    }

})


export {authUser}