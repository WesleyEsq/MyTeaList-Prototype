# Tealists, web platform for information management.

Welcome. Tealists is a web app to organize and manage lists and spreadsheet type of data in a very ligth way for personal use in a visual, customizable platform. This is currently just a prototype but has some of the basic functionality the concept requires.

**You can find the prototype at:**  https://tealists.netlify.app/



#### Installation steps

The first requirement to get the projects source code locally would be to clone it, this can be done with the github interfaces or through the git command 

```
git clone https://github.com/WesleyEsq/TeaListsPrototype
```

Next would be the commands to get the project dependencies and to run the program. After you get the project through github, you need to first do this command to install the project with it's dependencies. You need to have npm and node.js in your system before excecuting this in your console.

```
npm install
```

Then you need to set the enviroment variables, they are in the file named .env, it's located in the same directory as the first directory of the project, alongside the package.json. The required enviroment keys are all from Firebase (this is just a working prototype for now, so to facilitate the development of it, the platform is based on firebase only for everything). The keys are:

```
VITE_FIREBASE_API_KEY=""

VITE_FIREBASE_AUTH_DOMAIN=""

VITE_FIREBASE_PROJECT_ID=""

VITE_FIREBASE_STORAGE_BUCKET=""

VITE_FIREBASE_MESSAGING_SENDER_ID=""

VITE_FIREBASE_APP_ID=""

VITE_FIREBASE_MEASUREMENT_ID=""
```

---

##### About firebase and firestore...

Google has it's own ecosystem of tools for developers for all needs in the cloud through their services with firebase and google cloud. This includes a document database, the authentication service and bucket service for the images in the platform. This prototype for now requires to make an acount in Google's firebase service and to set these services inside https://console.firebase.google.com and into a web app.

+ **Authentication:** The app has a really simple sign in provider from google, it only uses the "email/password" option and that's it.

+ **FIrestore:** The app keeps the lists and data the user makes, alongside some customization options for users inside documents in the database. 

+ **Storage:** This is the sketchiest of the three as it's set rigth now, it requieres a blaze model for firebase, it should be free if the website doesn't recieve regular trafic, you need to set a basic storage bucket as that's the way images are stored for now.

When you log into firebase, you need to create a project first, for now this is only a web project so that's the option you need to pick to then set each of these modules one by one. You can get the keys if you go to the project settings inside the project overview in the left panel of firebase and go a bit bellow, you have to grab those inside the option "npm" and then copy and paste them into the .env file in your version of the project. 

--- 

#### Finally, how to run this locally

After you have set the enviroment variabels and ran npm install by itself inside the directory where the package.json is, you can then proceed to run the page locally.

This is done with the following command, it should place it in a localhost:

```
npm run dev
```

To make your own build of the page, you can run this instead:

```
npm run build
```

---

# I must reiterate, this is a prototype

The project is very young yet, it's a project done 100% as a hobby with some effort, the concept is still vaguely placed with just 1 specific and rigid kind of data storage, the idea aspires to much more and hopefully it will be developed into a more complete shape. But as it stands, it can be used well for users.