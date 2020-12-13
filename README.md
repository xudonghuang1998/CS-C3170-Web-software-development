# CS-C3170 Web-software-development
The repository includes my assignments source code for course CS-C3170-Web-software-development offered by Aalto University. 

You can find the course contents on https://wsd.cs.aalto.fi/web-software-development/.

This course provides an overview of web application development with a focus on server-side web applications. There are many hands-on assignments helping you learn how web applications are constructed using a few web frameworks, and the key focus is on learning generic principles related to web development. It has been designed as a starting point for those who wish to become more familiar with developing web applications. 

## Course tools
The web applications rely on Deno, which is a runtime for running web applications written in JavaScript (and TypeScript). IDE such as VSCode or Intellij Idea is recommended. Naturally, as we work with web applications, browser Google Chrome is expected.

## Main contents:
The course expects some existing familiarity with command line tools (working with terminal), programming in general, and working with relational databases.
### Basic:
+ Working Practices and Tooling
+ Introduction to the Internet
+ JavaScript Primer
+ Building Your First Web Applications
+ HyperText Markup Language (HTML)
+ Cascading Style Sheets (CSS)
+ Serving Static Files
+ Views and Templates
+ Working with Databases
+ Application Programming Interfaces (APIs)
+ Introduction to Web Frameworks
+ Middleware
+ Cookies and Sessions
+ Structuring Web Applications
+ Validation
+ Authentication and Authorization
+ Working with Files
+ Testing Web Applications

### Optional:
+ Style Libraries
+ Client-side JavaScript
+ Security Concerns
+ Performance Tuning
+ Deployment and Containerization
+ Architectural Decisions
+ Other Frameworks and Languages

## Run the codes:
To run the codes, type in the following command line in terminal where the directory that contains the application.

``` $ deno run --allow-all app.js ```

## Database with built-in tables:
```
const client = new Client({
    hostname: "hattie.db.elephantsql.com",
    database: "xlguwxko",
    user: "xlguwxko",
    password: "vOIJb7Qy3ubq_a1ovqH_uk7O3k1DBb2T",
    port: 5432
});
```
