import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

//fetch get token and atuh user
//POST
// /api/users/login
const authUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body
    
    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error (`Invalid password or email`)
    }  
})

// Register User Profile
// POST /api/users
const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password}  = req.body
    
    const userExists = await User.findOne({email})

     if(userExists) {
         res.status(400)
         throw new Error('User already exists')
     }

     const user  = await User.create({
         name, 
         email, 
         password
     })

     if(user) {
         res.status(201).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)  
         })
     } else {
         res.status(400) 
         throw new Error('Invalid email or password')
     }
})

//GET user profile /api/users/profile
const getUserProfile = asyncHandler(async(req,res) => { 
    const user = await User.findById(req.user._id)
  
    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})

//some updates of user's  profile
//PUT api/users/profile
const updateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)
    if(user) {
       user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password){
            user.password = req.body.password

        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(404)
        throw new Error('user not found')
    }
})


//get all user
//get /api/users
const getUsers = asyncHandler(async(req,res) => { 
    const users = await User.find({})
    res.json(users)
})


//delete user
//DELETE /api/users
//ADMIN
const deleteUser = asyncHandler(async(req,res) => { 
    const user = await User.findById(req.params.id)

    if(user) {
        user.remove()
        res.json({message: 'user has been removed'})
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})


//get user by id
//get /api/users/:id
//ADMIN
//select means doesnt fetch the password cause we dont need it
const getUserById = asyncHandler(async(req,res) => { 
    const user = await User.findById(req.params.id).select('-password')
    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('user doesnt exists')
    }
})


//some updates of user
//PUT api/users/profile/:id
//ADMIN
const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id)
    if(user) {
       user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin
        
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})

export {
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile, 
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}