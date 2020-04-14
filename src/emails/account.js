const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gustavo.miguens@fluxit.com.ar',
        subject: 'Thanks for joining us',
        text: `Welcome to the app, ${name}. You can start using our app`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gustavo.miguens@fluxit.com.ar',
        subject: 'Thanks for being with us all this time.',
        text: `Hi, ${name}. We are sorry to see that your are cancelling your account. We hope to see you soon around here.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}