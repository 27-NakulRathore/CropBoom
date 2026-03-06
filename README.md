CropBoom – AI-Powered Smart Agriculture Marketplace
Developer: Akul Rathore

Tech Stack: HTML5, Tailwind CSS, Vanilla JavaScript

Architecture: Frontend-Driven with LocalStorage Mock-Backend

Deployment: Demo-ready for any web browser

--Project Overview--

CropBoom is a direct-to-consumer digital marketplace designed to empower farmers and ensure price transparency. By eliminating middlemen, farmers receive fair value for their harvest while buyers gain access to fresh, AI-verified produce.

 --Smart AI Features--
 
To add technical depth for academic evaluation, the project implements "Neural Simulation" logic:

AI Price Integrity Guard: Farmers cannot manually set prices. Upon uploading a crop image, a Neural Scanner (simulated) identifies the crop type and locks the price based on global market trends to ensure fairness.

Smart Market Tracker: A real-time data tracker allowing farmers to check current market averages for various commodities using a stable indexed pricing engine.

Stock Validation Engine: The marketplace dynamically syncs with farmer inventory. Buyers are restricted from ordering more than the physically available stock.

--Key Technical Modules--

-> Role-Based Access Control (RBAC): Dedicated dashboards for Farmers and Buyers managed via JavaScript session logic.

-> Virtual Database: Utilizes localStorage for data persistence, allowing users, listings, and orders to remain even after browser refreshes.

-> Real-time Chat Module: A peer-to-peer messaging system allowing buyers to inquire about crops directly with the specific farmer.

-> Live Notification Center: A notification bell on the Farmer dashboard that alerts them instantly when a buyer sends a new message.

Dynamic Cart Logic: Supports quantity adjustments (+/-) and automatic total calculations based on verified market rates.

External API Integration: Features a live Agriculture News Feed on the landing page, fetching global farming trends via a News API.
