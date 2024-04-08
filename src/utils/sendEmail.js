import nodemailer from 'nodemailer';

const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


export const sendEmail = async (email, token)=>{
    const result = await transpoter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "OTP to Reset Password",
        html: `<p>Please use below link to reset your password <br></br><h2 style="margin-left:60px"><b>${token}</b></h2><br></br></p> <div>This OTP is only valid for 10 minutes</div>`
    });
    if(result){
        return true;
    }

}