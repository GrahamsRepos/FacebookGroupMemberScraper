#Facebook Group Member Scraper

## Overview

* This is a webscraper for scraping the names of the members of a facebook group.
* This scraper supports inifinte scroll in order to scrape all members of a facebook group. 
* This scraper is nodejs based and uses the puppeteer library to provide a browser interface https://www.npmjs.com/package/puppeteer.

### Requirements:
* Nodejs,  tested on version 12.11.0
* A Facebook account
* Membership to the Facebook group that you want to scrape

### Installation and Usage
* To install dependencies run **npm instal**l or **yarn install** in the root folder
* In the Config folder add a file called Config.json with the following contents:
`{"facebook_user": "YourFacebookEmail",
   "facebook_password": "YourFacebookPassword",
   "groupId": "thegroupid",
   "outputFile": "Result.csv"
 }`
* Add the Facebook login details for the account you want to use for the scraping in **./config/Config.json**
* Add the group id of the group you want to scrape in the Config.json file
* The output filename can also be set in the Config.json file
* By default the output file is created in the ./Results folder
* To run the application run **node app.js**

Note:
The first time you run the application it may ask for you to do two factor authentication. If this happens just enter the code and say save browser and re-run the app.

