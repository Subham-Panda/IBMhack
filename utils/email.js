const nodemailer = require('nodemailer');
const ejs = require('ejs');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.from = `Coding Bots<${process.env.EMAIL_FROM}>`;
        this.url = url;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            //to use gmail, activate in gmail "less secure app" option
            // for gmail just specify service: 'Gmail', no need of host and port
        });
    }

    async send(template, subject) {
        // 1) Render the HTML based on a pug template
        const html = await ejs.renderFile(
            `${__dirname}/../views/email/${template}.ejs`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        );

        // 2)Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
            //   html:
        };

        // 3) Create transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the CodingBots Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password Reset token (valid for only 10 minutes'
        );
    }
};
