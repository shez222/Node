must inclue these api while runnig these locations
modified:   MOD csrfdeprecated/controllers/auth.js
modified:   csef-csrf/controllers/auth.js
modified:   mod validation/controllers/auth.js

const transporter = nodemailer.createTransport(sendridTransporter({
    auth:{
        // api_key: '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'
    }
}))

//another pakage
//  const sgMail = require('@sendgrid/mail')
//  sgMail.setApiKey('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')
//  sgMail.send({
//     to: email,
//     from: 'bilal.shehroz420@gmail.com',
//     subject: 'Signup Suceeded',
//     html: '<h1>Sucessfull Signedup....</h1>'
// })