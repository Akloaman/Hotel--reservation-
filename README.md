# Hotel Reservation Management System

This project is a **Hotel Reservation Management System** built primarily as a backend application in Node.js/MySQL
The system allows customers to book, view, manage, and cancel room reservations efficiently and provides a **user-friendly, menu-driven interface** 



The main goal of this project is to implement a **simple and efficient hotel booking system** that enables real-time room management and reservation tracking.  
Users can reserve rooms, view availability, manage bookings, and calculate costs automatically.



Core Functionalities

 1. Room Reservation
- Reserve available rooms by providing:
  - Name  
  - Contact information  
  - Number of days of stay  
- Automatically calculates the **total cost** based on room type and stay duration.

2. Room Availability Tracking
- Maintains a list of rooms and their occupancy status.  
- Users can view which rooms are **booked** and which are **available** in real time.

3. Customer Information Management
- Stores customer details for each reservation (name, contact number, booking duration).  
- Allows **searching for a customer by name** to retrieve booking details.

4. Cancellation of Reservations
- Users can **cancel a booking**, after which the room will be marked as available again.

5. Display All Reservations
- Shows a **summary of all current bookings**, including:
  - Room numbers  
  - Customer names  
  - Booking durations  



 Backend Features (Node.js/MySQL)

- RESTful API endpoints for managing:
  - Rooms (CRUD operations)  
  - Bookings/Reservations  
  - Customers (if applicable)  
- Uses **Express.js** and **MySQL** for server and database management  
- Environment variables managed with **dotenv**  
- Session management and basic authentication (optional)  

**Example API Endpoints:**

- `GET /rooms` - List all rooms  
- `POST /rooms` - Add a new room  
- `PUT /rooms/:id` - Update a room  
- `DELETE /rooms/:id` - Delete a room  



Expected Output

- **Efficient Booking Process:** Quick reservations with immediate feedback on availability.  
- **Real-Time Availability Display:** Clear display of available and booked rooms.  
- **Accurate Billing:** Automatic cost calculation based on room rates and duration.  
- **User-Friendly Interface:** Menu-driven navigation and RESTful endpoints (for backend).  
- **Error Handling:** Prevents invalid inputs like booking an occupied room.  


```bash
git clone https://github.com/YourUsername/hotel-booking-project.git
