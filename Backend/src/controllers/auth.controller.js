import userModel from "../models/user.model.js";
import { sendEmail } from "../services/main.service.js";
import jwt from 'jsonwebtoken';

export async function register(req, res){
    const { username, email, password } = req.body;

    const isUserAlreadyExits = await userModel.findOne({
        $or:[
            {
                email,
            },
            {
                username,
            }
        ]
    })

    if(isUserAlreadyExits){
        res.status(400).json({
            message: " User with these credentials already exists.",
            success: false,
            err: "User Already Exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password    
    })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d"})

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please Verify your email by clicking the link below: </p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" > Verify Email </a>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "User Created Successfully.",
        success: true,
        user: {
            id : user._id,
            username: user.username,
            email :  user.email,
        }
    })
}

export async function login(req, res) {
    const { email, password} = req.body;

    const user = await userModel.findOne({ email })


    if(!user) {
        res.status(400).json({
            message: "User with these credentials does not exist.",
            success: true,
            err: "User Not Found."
        })
    }

    const isPasswordMatching = await user.comparePassword(password);

    if(!isPasswordMatching) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect Password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "Please Verify you email.",
            success: false,
            err: "Email not verified."
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET,{ expiresIn: "7d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "Login Successful.",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function verifyEmail(req, res) {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
        email: decoded.email
    })

    if(!user){
        return res.status(404).json({
            message: "Invalid Token",
            success: false,
            err:"User not found."
        })
    }

    user.verified = true;

    await user.save();

    const html = `
        <h1>Email Verified Successfully</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login"> Login </a>
        `

    res.send(html);

}

export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}