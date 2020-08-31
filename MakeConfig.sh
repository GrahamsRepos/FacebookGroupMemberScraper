 #!/bin/bash

echo "Please enter your facebook email"
read email
echo "Please enter your facebook password"
read password
echo "Please enter the group id you want to scrape"
read groupid

echo '{"facebook_user": "'$email'","facebook_password": "'$password'","groupId": "'$groupid'"}' > './config/Config.json'
