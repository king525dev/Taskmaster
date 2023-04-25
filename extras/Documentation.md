![Logo](Taskmaster-Brand-Kit/Taskmaster-banner[2].png)

# Documentation Of Taskmaster

Are you tired of constantly forgetting important tasks and deadlines? Do you find yourself drowning in a sea of sticky notes and endless to-do lists? Look no further than Taskmaster, project management software design for to ease the pressure of planning everything from life's big projects to day-to-day tasks.

Taskmaster offers a sleek and user-friendly interface, making it easy for even the most technologically challenged individuals to navigate. Its to-do list feature will help you stay on top of all your tasks, while the simplistic project page allows you to edit and update your projects like a digital notepad. Plus, with the ability to download and upload projects as plain text files, you can easily share your work with others.

But what sets Taskmaster apart from other project management software is its unbeatable customer support. With 24/7 assistance available, you can rest easy knowing that any issues or breakdowns will be quickly resolved.

Taskmaster is more than just a software. It's a solution. It's a way to make your life easier and more productive. It's a way to turn your ideas into reality.

So why settle for disorganization and chaos when Taskmaster can help streamline your life? Don't wait any longer. Try Taskmaster today and see the difference for yourself. You won't regret it. Sign up now and experience the magic of efficient project management.

--TLDR: It can be mainly be used to take notes or plan projects in a convenient manner.

**Latest Version:** v1.2.0

## Installation

#### Go to website
- The program can simply be accessed from the browser through this link [here](https://task-master-e14a8.firebaseapp.com/)
- You can also download a link as an executable file [here](https://task-master-e14a8.firebaseapp.com/) although it's vunerable to getting blocked by antiviruses and the application runs slower than the rest of the other forms in comparison (depends on your internet speed).

#### As a Progressive Web Application (PWA)
- The program can be installed as a PWA on Microsoft Edge Or Google Chrome, or any browser that runs on Chromium.
- First visit the website [here](https://task-master-e14a8.firebaseapp.com/)
- Go to the URL input tab and look for the option that says "Install as appliation" (This step may vary depending on the browser).
- Install the application and enjoy. Thought the application still runs slow in comparison to other forms of download (again, depends on your internet speed).

#### As a Direct Application
- This installation installs the application as a normal executable file. Atleast `69 MB` of space required.
- Download the application from [here](https://terabox.com/s/1czN1rqULEhuSgP9IcJEnOg)
- Extract the application the .zip file
- Double tap the application to run.

#### Quick Installation
- This installation is for users who simply want to quickly download the application regardless of the settings. Atleast `94 MB` of space required.
- Download the quick installer from [here](https://terabox.com/s/1f3SvAvhXXiBbhYzX0rSnMg)
- Extract the quick installer from the .zip file
- Double tap on the installer and the application will install and run.

#### Normal Installation
- This installation is for users who want to control parts of the installation like location. This method is reccomended over Quick Installation and as a Direct Application. Atleast `350 MB` of space required.
- Download the installer from [here](https://terabox.com/s/1K1wxDyx40_KTkKW0YpLoug)
- Extract the installer from the .zip file
- Install the application (.apk file) on a mobile device or emulator
- Run the application to test it and enjoy

#### As a Mobile Application
- This installation is for users who want to access the application on a mobile device (Android only)
- Download the installer from [here](https://terabox.com/s/1K1wxDyx40_KTkKW0YpLoug)
- Extract the installer from the .zip file
- Double tap on the installer and follow the installation wizard
- Run the application to test it and enjoy

## Features
You may read the features for each respective page and use the [screenshots](#screenshots) below as references. The details for the demo account used in the screenshots are stated below:

 **Email:** oliver@fakemail.com

 **Password:** qwerty

#### Sign-up and Sign-in 
The sign-up and sign and sign in pages work like a normal sign up and sign in with [Firebase Email and Password rules](https://firebase.google.com/docs/auth/web/password-auth)

#### Dashboard
The Dashboard is the main panel where you can access your quick to-dos, account settings [ logout and delete account ], the theme setter [ The palette icon ] and your most recently edited projects. 

For the Quick to-dos section, to add a to-do item, type in your to-do in the input at the top of the section and hit the enter key beside it. This will generate a to-do. To toggle its state to either completed or not completed, left click on the desired to-do item. And finnaly, to delete a to-do item, either finished or not, simply double click the to-do item. This will permanently delete the to do item with no warning. 

As for the main panel, it consist of the date and time, a greeting, the log-out button, the delete account button and the theme changer. Apart from the buttons and theme changer you can't click on anything else. The buttons are pretty self explanatory, though note that the log-out function is without any warning.

Lastly, the last section contains five(5) of your most recently edited projects. The same actions on the [Board](#board) apply here. That is, right click to delete a project and left click on a project to access it individually on the [Project page](#project).

###### Shortcuts

 **Alt + R:** Reload Page.

#### Board
The Board contains all your projects at a glance. It is simply a viewing platform that can perform basic operations. 

These operations include; right click on a project to delete it, left click on a project to access it individually on the project page and click the "Add Project" button to add a project. The buttons above on the right are links to the [Dashboard](#dashboard) and [Edit Page](#edit) respectively. While the input bar on the top right is to search for any of your projects that you desire. Note, after adding a new project, it is advised you wait for the notification assuring that the note has been added before clicking it or performing any operations with it. Doing other wise might cause data loss or glitching of the application.

###### Shortcuts
 **Alt + R:** Reload Page.

 **Alt + H:** Directs users to the Dashboard. 

 **Alt + A:** Adds a new project.

#### Project
The Project page is accessed either by the [Board](#board) or [Dashboard](#dashboard). It is used to view individual projects. 

It contains the title and the body, which you can edit normally and a few buttons at the bottom of the page. The save button and delete button are for obvious operations while the back button leads you to the board and the download icon will download the current project for you. Note that all downloaded projects will include a title at the begining of the file and at the end the status it was on before it was dowloaded with the date.

The download icon also serves as a platform to upload various projects. Though unlike in the [Edit Page](#edit) it will modify the current project, not add a new one. Though plain text files are highly reccomended for uploading, these files are also supported by Taskmaster (displayed by their [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)): [ text/plain, text/css, text/html, text/javascript, multipart/byteranges, multipart/form-data, application/rtf, application/xml, text/ecmascript, application/java, text/calendar, text/markdown, text/rtf, text/strings, text/vtt, text/xml, text/csv, multipart/report, application/json, application/batch-SMTP ]

###### Shortcuts

 **Alt + H:** Directs users to the Dashboard.

 **Alt + R:** Reload Page. 

 **Alt + S:** Saves the current project. 

 **Alt + D:** Deletes the current project.

 **Alt + C:** Downloads current project. 

#### Edit
The Edit page is where you can preview all your projects at a glance. It has both the advantages of seeing all your projects like on the [Board](#board) and also the advantage of previewing their contents like on the [Project](#project) page. This page is heavily inspired by the one [Dcode on YT](https://www.youtube.com/watch?v=01YKQmia2Jw&t=1347s) made.

The two buttons at the top are to go back to the [Board](#board) and  Add a note respectively. Left click on any project to preview it. On the left side, you can now edit the page as you would on the [Project](#project) page. Then as for the bottom buttons on the preview sections, they perform the same operations on the [Project](#project) page as they would here (except for the fact that the back button hass been moved to the top of the page as stated earlier). Though, note that on uploading a project instead of modifying it like would be done on the [Project](#project) page, it will instead add it as a new project. This is to prevent data loss as sometimes users are more likely to click the wrong project to upload to on the Edit Page than they are on the [Board](#board) or [Dashboard](#dashboard).

###### Shortcuts

 **Alt + H:** Directs users to the Dashboard.

 **Alt + R:** Reload Page.

 **Alt + S:** Saves the current project. 

 **Alt + D:** Deletes the current project.

 **Alt + C:** Downloads current project. 

 **Alt + A:** Adds a new project.


**Note:** There is a hamburger icon at the top of every page. you can use this to navigate throught out all the pages with ease.

## Screenshots

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B1%5D)

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B2%5D)

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B3%5D)

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B4%5D)

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B5%5D)

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B6%5D)

![App Screenshot](Taskmaster-Brand-Kit/screenshot%5B7%5D)

## Used By

This project is used by the following companies:

- ORE.A. United
- Xedrex

## Roadmap
|             **Task**                                     |     **Completed/Not-Completed**                                                     |
|:------------------------------------------------:|:--------------------------------------------------------:|
| Upload as Website                                | ![#1c722a](https://placehold.co/15x15/1c722a/1c722a.png) |
| Release v1.0.0                                   | ![#1c722a](https://placehold.co/15x15/1c722a/1c722a.png) |
| Release as Windows Application                   | ![#1c722a](https://placehold.co/15x15/1c722a/1c722a.png) |
| Prune Application                                | ![#1c722a](https://placehold.co/15x15/1c722a/1c722a.png) |
| Re-release till fully Pruned                     | ![#1c722a](https://placehold.co/15x15/1c722a/1c722a.png) |
| Release Final Version                            | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Submit Application to Whitesands for Competition | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Debug Taskmaster Mobile version                  | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Host Application Download online                 | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Release on Mac OS                                | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Release on Linux OS                              | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Integrate a Code Editor into the Application     | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |
| Add upgrade Projects to .rtf format              | ![#721c24](https://placehold.co/15x15/721c24/721c24.png) |


## Tech Stack

**Client:** HTML, CSS, Vanilla Javascript, Electron

**Server:** Firebase

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Fire Opal | ![#e0584f](https://placehold.co/15x15/e0584f/e0584f.png) `#e0584f` |
| Teal | ![#008080](https://placehold.co/15x15/008080/008080.png) `#008080` |
| Harvest Gold | ![#df9500](https://placehold.co/15x15/df9500/df9500.png) `#df9500` |
| Light Sea Green | ![#14aba2](https://placehold.co/15x15/14aba2/14aba2.png) `#14aba2` |

## Feedback

If you have any feedback, please reach out to us on [email](mailto:oreoluwa.ajibade525@yahoo.com)


## Author

 **[@king525dev](https://github.com/king525dev)**

 For more information on the author click [here](https://king525-portfolio.pages.dev/)

## Badges

| [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) | [![Signature](https://img.shields.io/badge/Signature-ORE.A.ORIGINAL-brightgreen)](https://choosealicense.com/licenses/mit/) |

## License

- [MIT](https://choosealicense.com/licenses/mit/)
- [ORE.A. License](license.txt)

## Acknowledgements

 - [Dcode](https://dcode.domenade.com/)
 - [Coding Nepal](https://www.codingnepalweb.com/)
 - [Red Stapler](https://redstapler.co/)
 - [Traversy Media](https://traversymedia.com/)
 - [W3schools](https://www.w3schools.com/)
 - [Whitesands School](http://www.whitesands.org.ng/)
 - [README.so](https://readme.so/)