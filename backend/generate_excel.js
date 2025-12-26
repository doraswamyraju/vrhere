const XLSX = require('xlsx');

console.log("Creating Service Template Excel...");

// --- SHEET 1: Parent Task Structure ---
const sheet1Data = [
    ["S.No", "Task Code", "Audit Procedure / Main Task", "Description", "Owner (Checker)", "Start Trigger", "Status"], // Headers
    [1, "PL-01", "Client Onboarding & Data Collection", "Collect structured data & documents", "Manager", "Engagement approval", "Not Started"],
    [2, "PL-02", "Digital & Statutory Setup", "DSC, DIN & MCA access", "Manager", "PL-01 complete", "Not Started"],
    [3, "PL-03", "Name Reservation", "SPICe+ Part A filing", "Partner", "PL-02 complete", "Not Started"],
    [4, "PL-04", "Incorporation Filing", "SPICe+ Part B & attachments", "Partner", "PL-03 approved", "Not Started"],
    [5, "PL-05", "Certificate & Statutory Allotments", "COI, PAN, TAN", "Manager", "PL-04 approved", "Not Started"],
    [6, "PL-06", "Post-Incorporation Setup", "Bank, GST, registers", "Manager", "PL-05 issued", "Not Started"]
];

// --- SHEET 2: Detailed Maker–Checker Sub-Tasks ---
const sheet2Data = [
    ["Task Code", "Sub Task Code", "Sub Task Name", "Maker Role", "Checker Role", "Duration", "Dependency", "Output"], // Headers
    
    // PL-01
    ["PL-01", "PL-01.1", "Create client master", "Jr. Executive", "Sr. Executive", "0.5 day", "-", "Client created"],
    ["PL-01", "PL-01.2", "Capture company basic data", "Jr. Executive", "Sr. Executive", "0.5 day", "PL-01.1", "Data validated"],
    ["PL-01", "PL-01.3", "Capture director details", "Jr. Executive", "Sr. Executive", "1 day", "PL-01.1", "Director data"],
    ["PL-01", "PL-01.4", "Capture shareholding structure", "Jr. Executive", "Manager", "0.5 day", "PL-01.3", "Share pattern"],
    ["PL-01", "PL-01.5", "Upload KYC documents", "Jr. Executive", "Sr. Executive", "1 day", "PL-01.3", "Docs approved"],
    ["PL-01", "PL-01.6", "Upload registered office docs", "Jr. Executive", "Manager", "0.5 day", "PL-01.2", "Office proof"],

    // PL-02
    ["PL-02", "PL-02.1", "Apply DSC – Director 1", "Executive", "Manager", "0.5 day", "PL-01 complete", "DSC"],
    ["PL-02", "PL-02.2", "Apply DSC – Director 2", "Executive", "Manager", "0.5 day", "PL-02.1", "DSC"],
    ["PL-02", "PL-02.3", "Apply DIN (if required)", "Executive", "Partner", "0.5 day", "PL-02.2", "DIN"],
    ["PL-02", "PL-02.4", "Verify DSC & DIN mapping", "Executive", "Manager", "0.25 day", "PL-02.3", "Valid setup"],

    // PL-03
    ["PL-03", "PL-03.1", "Name availability check", "Executive", "Sr. Executive", "0.5 day", "PL-02 complete", "Shortlist"],
    ["PL-03", "PL-03.2", "Draft name significance", "Executive", "Manager", "0.25 day", "PL-03.1", "Draft"],
    ["PL-03", "PL-03.3", "File SPICe+ Part A", "Executive", "Partner", "0.25 day", "PL-03.2", "Filed"],
    ["PL-03", "PL-03.4", "Track approval / resubmission", "Executive", "Manager", "1 day", "PL-03.3", "Approved name"],

    // PL-04
    ["PL-04", "PL-04.1", "Draft MOA objects", "Executive", "Manager", "0.5 day", "PL-03 approved", "Draft MOA"],
    ["PL-04", "PL-04.2", "Draft AOA clauses", "Executive", "Manager", "0.5 day", "PL-04.1", "Draft AOA"],
    ["PL-04", "PL-04.3", "Prepare INC-9 & DIR-2", "Executive", "Sr. Executive", "0.25 day", "PL-04.2", "Forms"],
    ["PL-04", "PL-04.4", "Upload SPICe+ Part B", "Executive", "Partner", "0.5 day", "PL-04.3", "Filed"],
    ["PL-04", "PL-04.5", "Handle MCA resubmission", "Executive", "Partner", "As needed", "PL-04.4", "Approved"],

    // PL-05
    ["PL-05", "PL-05.1", "Download COI", "Executive", "Manager", "0.25 day", "PL-04 approved", "COI"],
    ["PL-05", "PL-05.2", "Verify PAN & TAN", "Executive", "Manager", "0.25 day", "PL-05.1", "Verified"],
    ["PL-05", "PL-05.3", "Update client records", "Executive", "Sr. Executive", "0.25 day", "PL-05.2", "Updated"],

    // PL-06
    ["PL-06", "PL-06.1", "Bank account opening", "Executive", "Manager", "1 day", "PL-05 complete", "Account"],
    ["PL-06", "PL-06.2", "GST registration (if req.)", "Executive", "Manager", "1 day", "PL-06.1", "GSTIN"],
    ["PL-06", "PL-06.3", "Statutory registers setup", "Executive", "Sr. Executive", "0.5 day", "PL-06.1", "Registers"],
    ["PL-06", "PL-06.4", "Final closure & handover", "Executive", "Partner", "0.25 day", "All complete", "Closed"]
];

// Create Workbook
const wb = XLSX.utils.book_new();

// Create Sheets
const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);

// Set Column Widths for readability (Optional)
const wscols1 = [{wch:6}, {wch:10}, {wch:35}, {wch:35}, {wch:15}, {wch:20}, {wch:15}];
ws1['!cols'] = wscols1;

const wscols2 = [{wch:10}, {wch:15}, {wch:35}, {wch:15}, {wch:15}, {wch:10}, {wch:20}, {wch:20}];
ws2['!cols'] = wscols2;

// Append Sheets to Workbook
XLSX.utils.book_append_sheet(wb, ws1, "Parent Tasks");
XLSX.utils.book_append_sheet(wb, ws2, "Sub Tasks");

// Write File
XLSX.writeFile(wb, "Service_Template.xlsx");

console.log("✅ Success! 'Service_Template.xlsx' has been created in this folder.");