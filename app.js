const settings = require('./config/Config.json')
const puppeteer = require('puppeteer');
const fs = require('fs');


//Handles the infinite scroll
async function infiniteScroll(page,scrollDelay){
    let index = 0;
    let previousHeight;
    let FileStream = fs.createWriteStream(`./Results/${settings.outputFile***REMOVED***`,{flags:'a'***REMOVED***);
    try{
        while(true) {
            //Gets the element handler
            let profiles = await page.$$('div[id*="recently_joined"]');
            let newItems = profiles.slice(index);
            for (let profile of newItems) {
                index+=1;
                //evaluate the <a> child of the handle -- this is the same as document.querySelector ...
                let title = await profile.$eval('a', el => el.title)
                let src = await profile.$eval('a', el => el.href);
                console.log(`${src***REMOVED*** ${title***REMOVED***`)
                //Writes data to pipe delimited file
                FileStream.write(`${src***REMOVED***|${title***REMOVED***\n`);
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
            await page.waitForSelector('#email')
            await page.type('#email', settings.facebook_user);

            await page.waitForSelector('#pass');
            await page.type('#pass', settings.facebook_password);

            await page.waitForSelector('button[name="login"]');


            await page.click('button[name="login"]');
            await page.waitForNavigation({ waitUntil: 'networkidle0' ***REMOVED***)

        ***REMOVED***catch(err){
            console.log(err);
        ***REMOVED***
    ***REMOVED***else{
        console.log("Already logged in")
    ***REMOVED***

    try {
        await page.goto(`https://www.facebook.com/groups/${settings.groupId***REMOVED***/members`,{waitUntil: 'domcontentloaded'***REMOVED***);
       // await page.waitForNavigation({ waitUntil: 'networkidle0' ***REMOVED***);
        await page.waitForSelector('div[id*="recently_joined"]')

        //gets the handles
        let profiles =await  page.$$('div[id*="recently_joined"]');

        await infiniteScroll(page,10);

        // for(let profile of profiles){
        //     //evaluate the <a> child of the handle
        //     let title = await profile.$eval('a',el=>el.title)
        //     let src =await profile.$eval('a',el=>el.href);
        //     console.log(`${src***REMOVED*** ${title***REMOVED***`)
        // ***REMOVED***

    ***REMOVED***catch(err){
        console.log(err);
    ***REMOVED***


***REMOVED***)()

