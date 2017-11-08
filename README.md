# IT Project Monitoring System

The project aims to monitor progress of a research and development project in a University environment.

## Getting Started

To get you a copy of the project up and running on your local machine clone or download the repository on github [Clone ITPMS](https://github.com/tolmike23/IT-Project-Monitoring-System.git) for development and testing purposes.

See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Things you need to install the software and how to install them

```
NodeJS - (https://nodejs.org/en/)
Npm Package Manager - (https://www.npmjs.com/)
AdonisJS Framework - (https://adonisjs.com/docs/3.2/)
```

### Installing

A step by step series of examples that tell you have to get a development env running

--Installing Node JS version 4.0 or greater--
```
--Verify Node JS installation--
command: node -v
result >= v4.0.0
```
--Installing NPM--
```
command: npm install
```

--Verify Npm installation--
```
command: npm -v
result >= 3.0.0
```
--Installing AdonisJS--
```
command: npm -i -g adonis-cli
```
--Verify AdonisJs installation--
```
command: adonis -V
result >= 3.0.0
```


## Running the ITPMS package

Serve the package in NodeJS using NPM

```
command: cd ITPMS/
result: Johns-Air:ITPMS fruitjam$

command: npm run serve:dev
result:
> adonis-app@3.2.1 serve:dev /Users/fruitjam/ITPMS
> nodemon --watch app --watch bootstrap --watch config --watch .env -x node server.js

[nodemon] 1.12.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: /Users/fruitjam/ITPMS/app/**/* /Users/fruitjam/ITPMS/bootstrap/**/* /Users/fruitjam/ITPMS/config/**/* .env
[nodemon] starting `node server.js`
info adonis:framework +0ms serving app on localhost:3333
```
### Configure the .env file in the ITPMS package to your database connection preference
.env file
```
HOST=localhost
PORT=3333
APP_KEY=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ
NODE_ENV=development
CACHE_VIEWS=false
SESSION_DRIVER=cookie

--Edit the database connection string to your preference (MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=
```
### Run Migration with another terminal
cd to the ITPMS package
```
command: cd ITPMS/
result: Johns-Air:ITPMS fruitjam$
```
run migration to deploy it populate necessary tables to your DB_DATABASE
```
command: node ace migration:run
result: ℹ Nothing to migrate.
```
## Deployment

Download [ngrok](https://ngrok.com/download) use http/https tunnel

Run ngrok
```
$ ./ngrok help
```

To expose the package
```
ngrok http 3333

result:
ngrok by @inconshreveable

Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://92832de0.ngrok.io -> localhost:80
Forwarding                    https://92832de0.ngrok.io -> localhost:80

Connnections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

## Built With

* [NodeJS](https://nodejs.org/en/) - The web server
* [Npm](https://www.npmjs.com/) - Dependency Management
* [AdonisJS](https://adonisjs.com/docs/3.2/) - The web framework used for development

## Bug and Issues

Have a bug or an issues with the package [Open a new issue](https://github.com/tolmike23/IT-Project-Monitoring-System/issu)

## Authors

* **Dale Barraca** - *Senior Developer* - [dalebarr](https://github.com/dalebarr)
* **John Barraca** - *Junior Developer* - [tolmike23](https://github.com/tolmike23)

See also the list of [contributors](https://github.com/tolmike23/IT-Project-Monitoring-System/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [MIT](https://github.com/tolmike23/IT-Project-Monitoring-System/blob/master/LICENSE) for details

## Acknowledgments

* **John Barraca** - *Junior Developer* - [tolmike23](https://github.com/tolmike23) Re-engineer [thetutlage](https://github.com/thetutlage) source code.
