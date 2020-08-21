const settings = require('./config/Config.json')
const puppeteer = require('puppeteer');
const fs = require('fs');


//Handles the infinite scroll
async function infiniteScroll(page,scrollDelay,groupName){
    let index = 0;
    let previousHeight;
    let FileStream = fs.createWriteStream(`./Results/${settings.groupId***REMOVED***.csv`,{flags:'a'***REMOVED***);
    FileStream.write(`groupid|groupName|profile_url|full_name\n`);
    try{
        while(true) {
            //Gets the element handler
            console.log(index);
            let profiles = await page.$$('div[id*="recently_joined"]');
            let newItems = profiles.slice(index);
            for (let profile of newItems) {
                index+=1;
                //evaluate the <a> child of the handle -- this is the same as document.querySelector ...
                let title = await profile.$eval('a', el => el.title)
                let src = await profile.$eval('a', el => el.href);
                //console.log(`${src***REMOVED*** ${title***REMOVED***`)
                //Writes data to pipe delimited file
                FileStream.write(`${settings.groupId***REMOVED***|${groupName***REMOVED***|${src.replace(/(\?).*$/,'')***REMOVED***|${title***REMOVED***\n`);
            ***REMOVED***
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight***REMOVED***`);
            await page.waitFor(scrollDelay);
        ***REMOVED***

    ***REMOVED***catch(e){
        console.log(e);
    ***REMOVED***
***REMOVED***

(async () => {
    const browser = await puppeteer.launch({userDataDir: "./site_data",headless:false***REMOVED***)
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://www.facebook.com/')

    await page.setViewport({ width: 1536, height: 733 ***REMOVED***)

    await navigationPromise
    const loggedin = await page.$('div[role="search"') || null;
    //console.log(loggedin);

    //If the search bar component is not visible then we are not logged into the page.....
    if(loggedin === null) {
        console.log("logging in");
        try {

            await page.waitForSelector('input[name="email"]')
            await page.type('input[name="email"]', settings.facebook_user);

            await page.waitForSelector('#pass');
            await page.type('#pass', settings.facebook_password);

            await page.waitForSelector('button[name="login"]');


            await page.click('button[name="login"]');
            await page.waitForNavigation({ waitUntil: 'networkidle0' ***REMOVED***)
            const askingFor2FACode = await page.$('input[id="approvals_code"') || null;
            if(askingFor2FACode){
                console.log("Waiting for 2FA to be entered");
                await page.waitFor(20000);
            ***REMOVED***

        ***REMOVED***catch(err){
            console.log(err);
        ***REMOVED***
    ***REMOVED***else{
        console.log("Already logged in")
    ***REMOVED***

    try {
        await page.goto(`https://www.facebook.com/groups/${settings.groupId***REMOVED***/members`,{waitUntil: 'domcontentloaded'***REMOVED***);
       // await page.waitForNavigation({ waitUntil: 'networkidle0' ***REMOVED***);
        await page.waitForSelector('a[href*="group_header"]')
        //Get the group name
        let groupName = await page.evaluate(el=> el.innerText,await page.$('a[href*="group_header"]'));

        //Wait fir the members list to show
        await page.waitForSelector('div[id*="recently_joined"]')

        //gets the member names by scrolling infinitely
        await infiniteScroll(page,10,groupName);

    ***REMOVED***catch(err){
        console.log(err);
    ***REMOVED***


***REMOVED***)()

