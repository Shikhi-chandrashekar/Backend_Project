import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";

const registerUser=asyncHandler(async(req,res)=>{
     //get user details from frontend(by postman)
     //validation -- not empty
     //check if user already exists(by email and username)
     //check for images and avatar
     //upload to cloudinary (check for avatar)
     //create user object-> create entry in db
     //remove password and refresh token field from response
     //check for user creation
     //return response



     const {fullname,email,username,password}=req.body
     console.log("email:",email);



    
     if([fullname,email,username,password].some((field)=>
      field?.trim()==="") // to check all input fields
    ){
        throw new ApiError(400,"All fields are required");
     }

     

// Check if the username already exists
const existingUsername =  User.findOne({ username });

if (existingUsername) {
  throw new ApiError(409, "Username already exists");
}

// Check if the email already exists
const existingEmail =  User.findOne({ email });

if (existingEmail) {
  throw new ApiError(409, "Email already exists");
}

//multer path(not cloudinary)
const avatarLocalPath= req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path;


//check for avatar
if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
}


//upload on cloudinary
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)    

//check for avatar in cloudinaru
if(!avatar){
    throw new ApiError(400,"Avatar file is required")
}


const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage: coverImage?.url || "", //as coverImage is not compulsary 
    email,
    password,
    username: username.toLowerCase()
})

//check if user is created
const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
)//removing password and refreshtoken


if(!createdUser){
    throw new ApiError(500, "Something went wrong while regstering the user")
}



//sending status response based on ApiResponse.js
return res.status(201),json(
    new ApiResponse(200,createdUser,"User registered sussessfully")
)

})




export {registerUser,}