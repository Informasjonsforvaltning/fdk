#You need Maven and Java in order to build this project
read -p "Please install Docker while this script runs. Press ENTER to continue"
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
echo "Cloning project from https://github.com/Informasjonsforvaltning/fdk"
git clone https://github.com/Informasjonsforvaltning/fdk
echo 'DOCKER_HOST=tcp://localhost:2375' >>~/.bash_profile
source ~/.bash_profile
mvn clean install
