const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) =>{
    res.render('index', {title: "Welcome!"})
})

app.get('/:page', (req, res) =>{
    res.render(req.params.page)
})

app.post('/contact/send', (req, res) =>{
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'benubach@gmail.com',
			pass: 'password'
		}
	})
	var mailOptions = {
		from: 'Ubachsquared <benubach@gmail.com>',
		to: 'Support: <benubach@gmail.com>',
		subject: 'Contact from site',
		text: `${req.body.name} <${req.body.email}> said: 
		${req.body.message}`,
		html: `<h1>Message Received!</h1>
		<h2>Details:</h2>
		<ul>
			<li>From: ${req.body.name} <${req.body.email}></li>
			<li>Message:
				<pre>${req.body.message}</pre>
			</li>
		</ul>`
	}
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		} else {
			console.log('Message Sent: '+info.response);
		}
		res.redirect('/');

	})
})

app.use(function (err, req, res, next) {
	console.log(`Requested ${req.url}`)
	res.status(500).render('error')
})

app.use(function (req, res, next) {
	console.log(`Requested ${req.url}`)
	res.status(404).render('error')
})

app.listen(3000);
console.log("Server running on port 3000")