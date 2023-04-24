FROM aecgeeks/ifcopenshell
  
WORKDIR /app

RUN sudo apt-get update -qy; sudo apt-get dist-upgrade -qy; sudo apt-get install -qy pip; sudo pip install lark; sudo pip install Flask
CMD ["python3","--version"]