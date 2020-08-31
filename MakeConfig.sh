 #!/bin/bash

read -p "Please enter your facebook email: " email 
read -s -p "Please enter your password: " password
read -p "
Please enter the group id you want to scrape: " groupid


echo '{"facebook_user": "'$email'","facebook_password": "'$password'","groupId": "'$groupid'"}' > './config/Config.json'
