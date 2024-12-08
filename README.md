# Beyond-Borders

### About the Project
<p style="font-size: 12px;">
Beyond-Borders is a travel platform designed to simplify vacation planning, offering everything you need to create your perfect trip, from historic landmarks to family-friendly adventures.
</p>

### Motivation
<p style="font-size: 12px;">
The inspiration behind Beyond-Borders stems from a desire to help travelers overcome the hassle of trip planning. We wanted to create a platform that consolidates all essential travel information in one place, making it easier for people to explore the world and discover new experiences without the stress of juggling multiple tools and sources.
</p>

### Build Status

<p style="font-size: 12px;">
The current build of Beyond-Borders is functional but has a few known issues that require attention. These include:
</p>

- **Google Maps API Issue**: The API for Google Maps fails when an advertiser attempts to create an activity. 
- **Slow Fetching of Data**: Fetching data for hotels, flights, and all products can take longer than expected, affecting the user experience.
- **Step-by-Step Tutorial Button**: The open dialog button for the step-by-step tutorial is not immediately obvious to tourists or guests, potentially causing usability challenges.

### Code Style

Our code follows a clean and consistent coding style to ensure maintainability and readability for both backend and frontend code. 

#### Backend Code Style
- **Modular and Reusable Code**: Functions are modular to make them reusable across the application.
- **Clear Comments**: Each function and critical logic segment is well-documented with comments explaining their purpose.
- **Error Handling**: Backend APIs include robust error handling to address edge cases and provide meaningful feedback to users.
- **Consistent Variable Naming**: Variable names are written in `camelCase` to maintain consistency.

### Screenshots
#### Login Page
![login](src/screenshots/login.png)
#### Tourist Home Page
![Tourist Home Page](src/screenshots/touristHomePage.PNG)
#### Activities Page
![Activities Page](src/screenshots/activities.PNG)
#### Events Payment Page
![Activities Pay Page](src/screenshots/activityPay1.PNG)
![Activities Pay Page](src/screenshots/activityPay2.PNG)
![Activities Pay Page](src/screenshots/activityPay3.PNG)
#### Flights API Search
![Flights Page](src/screenshots/flights.PNG)
#### Flights API Search Results
![Flights Page](src/screenshots/flights2.PNG)

### Tech/Framework Used
Below is the list of technologies and frameworks used in the Beyond-Borders project:

- **Node.js**: Used for building the backend server and handling business logic.
- **Express**: A Node.js framework for creating APIs and managing server-side routes.
- **React**: Used for developing the frontend and creating interactive user interfaces.
- **Mongoose**: For object data modeling (ODM) and interacting with the MongoDB database.
- **MongoDB Compass**: GUI for querying and managing the MongoDB database.
- **Postman**: For testing APIs during the development process.
- **Git and GitHub**: For version control and project collaboration.

This stack provides a robust and scalable foundation for the Beyond-Borders platform, enabling seamless integration of backend and frontend components.
### How to Use

Follow these steps to use the Beyond-Borders platform:
#### Guest
1. **Login as a Guest**:
   - On the login page, select the **Continue as Guest** option.
   - You will be redirected to the **Guest Homepage**.

2. **Guest Homepage**:
   - The homepage provides a top bar containing :
     - **Register Now Button**:
       - Click this button to go to the registration page.
       - On the registration page, you can choose to register as one of the following:
         - **Tourist**
         - **Tour Guide**
         - **Advertiser**
         - **Transportation Advertiser**
         - **Seller**

3. **Navigation**:
   - The platform includes a **side navigation bar** with buttons for the following features:
     - **Activities**: Explore upcoming activities available.
     - **Itineraries**: View upcoming itineraries.
     - **Museums**: Discover upcoming museum events and exhibitions.
     - **Historical Places**: Find and view details about upcoming events at historical landmarks.
   - Click on any button to be redirected to the corresponding page for more information.

The guest experience is designed to provide a preview of what the platform offers, while also encouraging registration for a more personalized and feature-rich experience.
#### Tourist

1. **Login**:
   - Use your registered username and password to log in to the platform.
   - If you forgot your password, click the **Forgot Password** button.
   - An OTP will be sent to your registered email. Use it to reset your password.

2. **Tourist Homepage**:
   - After logging in, you will be redirected to the **Tourist Homepage**.
   - The homepage features cards displaying activities, itineraries, and historical places.
   - Click on any card to view more details and access the relevant page.

3. **Navigation**:
   - The platform includes a **side navigation bar** with buttons for the following features:
     - **Flights**: View and book flights.
     - **Hotels**: Browse and reserve accommodations.
     - **Activities**: Explore and book upcoming activities.
     - **Itineraries**: Access upcoming, completed, and saved itineraries.
     - **Museums**: Discover and book museum events.
     - **Historical Places**: Find and book visits to historical landmarks.
     - **Products**: Browse and purchase products.
     - **Transportation**: View and book transportation options.
     - **Complaints**: File complaints or view submitted ones.
     - **Saved Events**: Access events you’ve saved for later.
     - **Orders**: View your product orders.

4. **Top Bar**:
   - The top bar contains the following features:
     - **Profile Button**: View and update your profile details.
     - **Notifications Bell**: Check notifications for updates and alerts.
     - **Cart Icon**: Access your shopping cart to review or update your product selections.
     - **Wishlist Icon**: View and manage your wishlist items.
     - **Logout Button**: Log out of your account.

5. **Bookings and Purchases**:
   - You can view all your current and past bookings, including activities, itineraries, events, flights and hotel reservations.
   - Book events, buy products, and explore various travel options seamlessly on the platform.


