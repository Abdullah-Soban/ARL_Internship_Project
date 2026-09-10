const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('../ARL_OilSync_Project_Report.pdf'));

// Title
doc.fontSize(24).font('Helvetica-Bold').text('ARL OilSync: Project Summary', { align: 'center' });
doc.moveDown();

// Section 1
doc.fontSize(16).font('Helvetica-Bold').text('1. Project Overview');
doc.fontSize(12).font('Helvetica').text(
  'ARL OilSync is a full-stack, enterprise-grade accounting and logistics dashboard designed for the Attock Refinery Limited (ARL) Oil Department. It was built using the MERN Stack (MongoDB, Express, React, Node.js) and is orchestrated using Docker for seamless deployment.\n\nThe application serves as a modern prototype to replace legacy accounting systems, providing real-time tracking, financial summaries, and AI-powered anomaly detection for both the Procurement (Upstream) and Sales (Downstream) divisions.',
  { align: 'justify' }
);
doc.moveDown();

// Section 2
doc.fontSize(16).font('Helvetica-Bold').text('2. Core Technologies');
doc.fontSize(12).font('Helvetica').text(
  '- Frontend: React (Vite), React Router, Recharts, Lucide-React, pure CSS for premium glassmorphism aesthetics.\n- Backend: Node.js, Express.js, Mongoose (ODM).\n- Database: MongoDB (running in a Docker container).\n- Infrastructure: Docker & Docker Compose.\n- Data Ingestion: xlsx parser for integrating real-world Excel data.',
  { align: 'justify' }
);
doc.moveDown();

// Section 3
doc.fontSize(16).font('Helvetica-Bold').text('3. Major Modules Built');
doc.moveDown(0.5);
doc.fontSize(14).font('Helvetica-Bold').text('Phase 1: Procurement & Upstream Logistics');
doc.fontSize(12).font('Helvetica-Oblique').text('Focused on tracking raw materials and supplier transactions.');
doc.fontSize(12).font('Helvetica').text(
  '- Procurement Dashboard: Displays real-time metrics (Expenditure, Volume, Active transactions).\n- Interactive Charts: Visualizes monthly expenditure trends and breaks down volume by crude grade.\n- Transactions Data Table: A highly functional table allowing search, filter, and CSV export.\n- Transaction Details View: A dedicated page to print official receipts and download invoices.',
  { align: 'justify' }
);
doc.moveDown(0.5);

doc.fontSize(14).font('Helvetica-Bold').text('Phase 2: Sales & Downstream Dispatches');
doc.fontSize(12).font('Helvetica-Oblique').text('Focused on tracking refined product dispatches to OMCs.');
doc.fontSize(12).font('Helvetica').text(
  '- Real Data Integration: Parsed 858 real dispatch records from an ARL Excel sheet, calculating realistic revenue, costs, and profit margins automatically.\n- Sales Overview Dashboard: A dedicated dashboard featuring charts for Total Profit, Revenue, and top products.\n- Sales Dispatches Table: Displays all records, tracking OMC Client, Volume, Transport Type, Tank No, and Bowser No.\n- Dispatch Details View: Allows downloading an official ARL Sales Dispatch Invoice.',
  { align: 'justify' }
);
doc.moveDown();

// Section 4
doc.fontSize(16).font('Helvetica-Bold').text('4. Key Features & Innovations');
doc.moveDown(0.5);

doc.fontSize(14).font('Helvetica-Bold').text('AI Exception Engine');
doc.fontSize(12).font('Helvetica').text(
  'We built a simulated, rule-based Artificial Intelligence engine into the Node.js backend. The AI scans specific records (Volume, Price, Capacity, Margins) and automatically flags anomalies. For example, if a Sales Dispatch exceeds 55,000 Liters (the physical limit of a standard tank lorry) or results in a negative profit margin, the AI throws a warning and recommends managerial review.',
  { align: 'justify' }
);
doc.moveDown(0.5);

doc.fontSize(14).font('Helvetica-Bold').text('Premium Glassmorphism UI');
doc.fontSize(12).font('Helvetica').text(
  'The frontend was designed without heavy CSS frameworks. Instead, custom CSS was written to achieve a highly modern, dark-themed, premium aesthetic. It features glass panels, vibrant accent colors, micro-animations, and a fully responsive layout.',
  { align: 'justify' }
);
doc.moveDown(0.5);

doc.fontSize(14).font('Helvetica-Bold').text('Docker Orchestration');
doc.fontSize(12).font('Helvetica').text(
  'The database environment is managed by Docker Compose. This ensures that the application can run identically on any machine without complex manual setup, fulfilling the core proposal requirement for containerization.',
  { align: 'justify' }
);
doc.moveDown();

// Section 5
doc.fontSize(16).font('Helvetica-Bold').text('5. Conclusion');
doc.fontSize(12).font('Helvetica').text(
  'ARL OilSync successfully demonstrates a scalable, modern approach to refinery accounting. By combining highly interactive data visualizations, real-world data parsing, and an automated AI exception engine, the prototype proves that upgrading from legacy systems will drastically improve operational visibility and reduce logistical errors at ARL.',
  { align: 'justify' }
);

doc.end();
console.log('PDF generated successfully!');
