sudo yum update -y
sudo yum install nginx -y
sudo echo "<h1> Hello AWS CDK Workshop Meetup from #DEPLOY_ENV# environment!<h1>" > /usr/share/nginx/html/index.html 
sudo echo "Nginx configured on $(date)" >> /usr/share/nginx/html/index.html 
sudo systemctl enable nginx
sudo systemctl start nginx