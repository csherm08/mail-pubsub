module.exports.sendGrid = function(to, from, subject, html) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey('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')
    const msg = {
        to, // Change to your recipient
        from, // Change to your verified sender
        subject,
        html,
    }
    // console.log("TO ", to);
    // console.log("FROM ", from);
    // console.log("SUBJECT ", subject);
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch(async (e) => {
            console.log(JSON.stringify(e.response.body.errors));
        })
}
