echo "Install Homebrew? Type 1 or 2"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"; break;;
        No ) break;;
    esac
done
echo "Install Java8? Type 1 or 2  (it will take 5 minutes to install)"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) brew tap caskroom/versions; brew cask install java8 exit;;
        No ) break;;
    esac
done
echo "Install Maven? Type 1 or 2"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) brew install maven; break;;
        No ) exit;;
    esac
done
read -p "Please install Docker if you haven't already. Press ENTER to continue"
open https://docs.docker.com/docker-for-mac/install/

# could be needed: echo 'DOCKER_HOST=tcp://localhost:2375' >>~/.bash_profile
# source ~/.bash_profile
