# E.S.R. Thêta app or NativeApp 

## Info

This is the Theta app. It doesnt try to replicate all the functionality of the website but only ones that are most commonly used. 

The app is build using react native (similar to mamon) and expo, which actually handles all the building for ios and android. 

Builds and submittions are handled by the CI/CD of Gitlab. This will happen every time that you merge into master and development. It will build the app and try to submit it to both the apple app store and the play store. From here you can set it into TestFlight or release it to the actuall store. (every time you release it to the actual store you have to update the version in the app.json store)

## Learning
Please feel free to look at the code to get an understanding of how it works. You will find [React](https://reactjs.org/) and [React Native](https://reactnative.dev/) to give you help with the structure. 

## Styling
This app uses [React Native Paper](https://callstack.github.io/react-native-paper/index.html) as the main styling package. Refer to there documentation and application for help and ideas. 

## Test and Deploy
The app is build in expo and submitted to the app stores every time something is commited to the main branch. 

## Installation
To install and use this app you need to download android studio or X-Code(for mac) for local testing, installation is pretty self explanatory and can be found if you look those apps up. Second you run `npm install`. You dont have to install the expo cli as we will use `npx` which is a node package runner which allows us to run commands of packages you dont have downloaded.  

## Usage
This app should not be used in WSL! If you do that you won't be able to connect your devices to it and will only be able to connect simulators on this computer. To start the application you run `npx expo start`. This will start the application with expo, there will be a qr code you can scan with your device to connect it to your instance of the app. If you are using windows you can only connect android devices, if you are using mac you can connect IOS devices and/or android devices. Alternatively, there is a url of the format `exp://192.111.1.11:19000` you can fill this in in the expo go app which you can use to develop apps on real and simulated devices.

```
git clone https://gitlab.com/esrtheta/nativeapp.git
cd nativeapp
npm i
npx expo start
```

## Contributing
If you commit to main it will release the CI/CD runner which builds the application and releases it to the app store, therefore we only do merge requests. that way be build the app only a few times with expo rather every time we commit something.

So, if you want to add something you build it locally and create a branch with the title as the main thing you are adding. In this merge request you specify specifically what you are trying to do and how you are trying to do it if it is not self explanatory!

## Collaborate with your team

- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Authors and acknowledgment
1. [Gustavo Maduro Vollmer](https://esrtheta.nl/leden/profiel/3169) owner of the project, active contributer from august 2022 until --


## License
This project is not open source and not licensed, copywrite belongs to the authors mentioned above from their starting date 
