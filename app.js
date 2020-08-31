const settings = require('./config/Config.json')
const puppeteer = require('puppeteer');
const fs = require('fs');


//Handles the infinite scroll

async function infiniteScroll(page,scrollDelay,groupName,FileStream){
    FileStream.write(`groupid|groupName|profile_url|full_name|info1|info2\n`);
    let previousHeight;
    let retryNumber = 0;
    try{
        let previousTotal = 0;
        while(true) {

            //After three retries the scroll has probably reached it's end ...
            if(retryNumber>=5){
                break;
            }
            console.log(`${previousTotal}`);

            //The component containing the name and profile link has data-name GroupProfileGridItem and cane grabbed using xpath
            let profiles = await page.$x('//div[@data-name="GroupProfileGridItem"]');
            let newItems = previousTotal===0?profiles:profiles.slice(previousTotal);
            console.log(`Profiles: ${profiles.length} , New Items:${newItems.length}`)
            for (let profile of newItems) {
                previousTotal+=1;
                //evaluate the <a> child of the handle -- this is the same as document.querySelector ...
                let title = await profile.$eval('a', el => el.title)
                let src = await profile.$eval('a', el => el.href);
                let infoTextArray = await profile.$$eval('div[class="_60rj"]',elements=>(elements.map(el=>el.innerText)))
               // console.log(infoTextArray);

                //console.log(`${src} ${title}`)
                //Writes data to pipe delimited file
                FileStream.write(`${settings.groupId}|${groupName}|${src.replace(/(\?).*$/,'')}|${title}|${infoTextArray[0]}|${infoTextArray[1]}\n`);
            }
            //In certain cases facebook does actually allow for the scraping of more than 10000 names, this resets the counter because after 100000 a new series of divs are produced

            try {
                previousHeight = await page.evaluate('document.body.scrollHeight');
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
                await page.waitFor(scrollDelay);
            }catch(e){
                //This is here so that the system retries if there is a momentary connection error
                console.log(e);
                console.log("waiting for 5 seconds");
                await page.waitFor(5000);
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
                await page.waitFor(scrollDelay);
                retryNumber+=1;
            }
            if (newItems.length === 0){
                console.log("Done");
                break;
            }
        }

    }catch(e){
        console.log(e);
    }
}

(async () => {
    const browser = await puppeteer.launch({userDataDir: "./site_data",headless:false})
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://www.facebook.com/')

    await page.setViewport({ width: 2000, height: 900 })


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
            //Wait for the page to complete loading , if just check is not done the page.goto below doesn't work
            await page.waitForNavigation({ waitUntil: 'networkidle0' })


            const askingFor2FACode = await page.$('input[id="approvals_code"') || null;
            if(askingFor2FACode){
                console.log("Waiting for 2FA to be entered");
                await page.waitFor(20000);
            }

        }catch(err){
            console.log(err);
        }
    }else{
        console.log("Already logged in")
    }

    try {
        await page.goto(`https://www.facebook.com/groups/${settings.groupId}/members`,{waitUntil: 'domcontentloaded'});
       // await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForSelector('a[href*="group_header"]')
        //Get the group name
        let groupName = await page.evaluate(el=> el.innerText,await page.$('a[href*="group_header"]'));

        //Wait firs the members list to show
        await page.waitForSelector('div[id*="recently_joined"]')

        let FileStream = fs.createWriteStream(`./Results/${settings.groupId}.csv`,{flags:'a'});


        //gets the member names by scrolling infinitely
        await infiniteScroll(page,(Math.random()*10),groupName,FileStream);

    }catch(err){
        console.log(err);
    }


})()

