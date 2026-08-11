# **SafeTap: Personal Safety Made Easy**

SafeTap is a mobile application built with React Native and Expo that helps users stay safe by using scheduled safety check-ins. The app allows users to sign in, choose a check-in duration, manage trusted contacts and keep track of their check-in history. If a user does not check in within their selected duration, the app is designed to alert their trusted contacts.

## **Key Features**

- Access the app using predetermined login credentials.
- A user-friendly interface for starting and managing safety check-ins.
- A range of check-in durations, including minutes, days and weeks.
- Ability to add and manage trusted contacts.
- A history section for viewing previous check-ins.
- Navigation between the Home, Check In, Contacts, History and Settings screens.

## **Getting Started**

### **Prerequisites**

To run this application, you need to have the following installed:

- **Node.js**: The prebuilt version is fine.
- **npm**: A package manager for installing dependencies. Prefer npm since it comes with Node.js.
- **Git**: For cloning the SafeTap repository.
- **Expo Go**: The mobile app for iOS or Android that allows you to run React Native projects on your physical device.

## **Installation & Setup**

This is a complete walkthrough on how to use this program. First, ensure the above requirements are met.

1. **Check that** **`npx`** **and** **`npm`** **are installed. You can use commands like** **`npm -v`** **to check the version.**
2. **Check that** **`git`** **is installed.**
3. **In your terminal, navigate to the directory where you want to have the SafeTap folder.**

### **Clone the Repository**

Staying in the current terminal tab, run the following command to download the project:

```bash
git clone https://github.com/Saanvi523/SafeTap.git
Navigate to the Project Directory

Change into the project folder:

cd SafeTap
Install Dependencies

Install all the necessary packages for the app:

npm install
Run the Application

Start the Expo development server:

npx expo start
After running this command, a QR code will appear in your terminal.
View the App
On your phone: Open the Camera app and scan the QR code on your terminal. Expo Go should open the project.
On a web browser: Alternatively, you may enter w in the terminal to open the web version. However, the app is designed primarily for mobile devices.
On an emulator: Press a for Android or i for iOS to launch the app on an emulator if you have one set up.
Important Notes ⚠️
Login Credentials: For this version of the app, the login is hardcoded. Use the following credentials:
Email: test@safetap.com
Password: 123456
Dark Mode: The app's design is optimised for light mode. Please ensure dark mode is turned off on the device running the app for the best viewing experience.
Prototype: The current version is a school project prototype and does not use an SQL database for authentication. The login credentials are therefore predetermined for testing purposes.
Troubleshooting & FAQ ❓
npm install fails: This could be due to network issues or an outdated Node.js version. Try running the command again or check your Node.js installation.
App not loading on phone: Ensure your computer and your phone are connected to the same Wi-Fi network.
Can't find the QR code: Scroll up in your terminal to see the output from the npx expo start command.
Login not working: Make sure the email and password exactly match the hardcoded credentials shown above.