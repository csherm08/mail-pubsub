const {SecretManagerServiceClient} = require('@google-cloud/secret-manager').v1;
const secretmanagerClient = new SecretManagerServiceClient();
const name = `projects/frese-bakery-api/secrets/MAIL_KEY/versions/latest`;

secret = null;
module.exports.callGetSecret = async () => {
    const [version] = await secretmanagerClient.accessSecretVersion({
        name: name,
    });

    return version.payload.data.toString();
}
module.exports.sendGrid = function(to, from, subject, html, apiKey) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(apiKey);
    const msg = {
        to, // Change to your recipient
        from, // Change to your verified sender
        subject,
        html,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch(async (e) => {
            console.log(JSON.stringify(e.response.body.errors));
        })
}
