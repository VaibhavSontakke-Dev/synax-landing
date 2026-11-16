/* Voice-over, one clip per beat. Keys are "<scene id>_<beat index>". script.js anchors actions to words in these lines, so a
   word that is anchored on must keep its spelling. Acronyms are written so the voice reads them well. */
const NARRATION = {
  home_0: "Welcome to Synax HRMS, the Human Resource Management System of Synax ERP. Recruit, onboard, manage, review and offboard your people, all in one connected workspace. Let's open HRMS from the sidebar.",

  "emp-list_0": "Employee List gives you your entire workforce at a glance. The header shows the total records, and the tabs separate live employees, live developers, live staff, employees who have left, extra resources, and the bench.",
  "emp-list_1": "Need someone specific? Search by name, code, company or project, and the table filters instantly. You can also sort the list, and narrow it down by company.",
  "emp-list_2": "Each row carries the department, designation, technologies, joining date, experience, CTC and project, with Edit and Delete actions. Export everything to Excel in one click, or use Add New to onboard an employee.",

  "emp-add_0": "To onboard a new hire, open Employee Add. The employee profile is organised into tabs: Personal Info, Employment, Contact, Identification, Bank and Statutory, Education and Certification, Legal Document, KYC, and Projects. A red marker shows what is still incomplete, while the first tab tracks the completion.",
  "emp-add_1": "Start with the full name, as per Aadhaar or PAN, and the date of birth.",
  "emp-add_2": "Choose the gender, enter the father's or husband's name, and select the marital status.",
  "emp-add_3": "Nationality is already set to Indian, and the blood group is recommended, but optional. Finally, click Submit to save the personal details.",

  "int-list_0": "Interview List tracks every candidate in your hiring pipeline: the candidate name, email, mobile number, interviewer, interview date, status, rating, and role.",
  "int-list_1": "Use the pipeline filters to see candidates by role, or by interviewer, so every hiring manager sees exactly what they need.",

  "int-add_0": "To schedule a new interview, open Interview Add. Upload the candidate's resume, and the AI extracts the candidate details for you.",
  "int-add_1": "Review the extracted details, then set the interview date, the interview stage, and the department.",
  "int-add_2": "Add the relevant experience, and the current and offered CTC.",
  "int-add_3": "Choose the interview type, enter the interviewer name, the in time and the out time, and the candidate and office locations.",
  "int-add_4": "Attach the interview feedback, and add a remark. For the Offered stage, an offer letter is required as well. Then rate the candidate, and click Save Interview.",

  att_0: "Attendance Log records every employee's daily attendance and working hours.",
  att_1: "Attendance OT Approval lets managers review and approve overtime.",
  att_2: "And Break Pass manages employee break passes, so time away from the desk is tracked too.",

  "dwm-list_0": "Daily Work Management, or DWM, turns plans into execution. DWM List is a task board, with To Do, In Progress, Verification, and Done columns.",
  "dwm-list_1": "Filter by date range, user and project, and keep an eye on how many tasks are visible, due today, overdue, and done. Then drag a task from one column to the next, as the work moves forward.",

  "dwm-add_0": "To plan new work, open DWM Add. Give the task a short, action-first title, and add a detailed description.",
  "dwm-add_1": "Pick the project and the department, set the estimated time in minutes, and choose the end date. The task snapshot on the right keeps the essentials in view as you work.",
  "dwm-add_2": "Then select the assignees, and create the task. Collaboration, comments and activity tracking unlock after the first save.",

  "dwm-assign_0": "DWM Assign User connects your people to DWM projects, so the right team sees the right work.",

  "dwm-proj_0": "DWM Create Project sets up a new project. Enter the project name, and a description.",
  "dwm-proj_1": "Then choose the users to assign, and click Create Project.",

  "ref-add_0": "Referrals turn your employees into recruiters. Open Referral List to refer a candidate. Upload the resume, and AI assists with the details.",
  "ref-add_1": "Check the name, email and mobile number, then choose the position, and add the location, the experience, and an optional remark.",
  "ref-add_2": "Each referral also keeps a status trail. Choose a status, add a comment, click Add Update, and then Save Referral.",

  "ref-dash_0": "Referral Dashboard shows how your referral programme is performing: how many candidates applied, were shortlisted, selected, joined, declined, or rejected. Click a tile to filter the list.",
  "ref-dash_1": "The table lists each candidate with the position, experience, location, resume, status, who referred them, and the date, so you can follow every referral to its outcome.",

  "leave_0": "Leave and Absence manages every kind of time away. Click New request to record a leave, an absence, or a client holiday.",
  "leave_1": "Search for the employee by name or code, and choose the dates. Then pick the type: paid leave, unpaid leave, absent, work from home, or a client or project holiday. And a full day, or a half day.",
  "leave_2": "Add a short remark, and submit for approval. Synax raises one request for each working day, and skips week-offs and office holidays.",
  "leave_3": "Every request appears in the list with its status, and who raised it, ready for the approver to act on.",

  "leave-pol_0": "Leave Policies and Holidays sets the rules. The tiles summarise your policy count, the holidays this year, and your carry forward and encashable policies.",
  "leave-pol_1": "To create a policy, enter an ID and a name, and set the annual limit. Tick Carry Forward, or Encashable, if they apply, and click Save Policy. It joins the policy matrix, which also shows usage.",
  "leave-pol_2": "Add an office holiday with a date, the companies it applies to, and a name. It is paid for everyone, needs no request, and appears at once in the holiday calendar.",

  comp_0: "HRMS Compliance brings your HR compliance tracking into one place.",

  "perf_0": "Performance Reviews run in cycles. Create a cycle with a name and a period, and save it.",
  "perf_1": "Then submit an employee review. Choose the cycle and the employee, give a score from one to five, add the manager's notes, and set the variable pay percentage.",

  "off-req_0": "Offboarding starts with a request. Enter the resignation date and the last working date, give a reason, and submit.",
  "off-req_1": "The request joins the list, where you can follow its status, and the status of the full and final settlement.",
  "off-clr_0": "Offboarding Clearance tracks sign-off from HR, IT, administration and finance, so nothing is missed before an employee leaves.",
  "off-fnf_0": "Offboarding FNF handles the full and final settlement, with its status, the current stage, and the amount payable.",
  "off-fnf_1": "Once clearance is complete, process the settlement, and mark it as done.",
  "exit_0": "Finally, the Exit Interview records why people leave. Pick the completed case, describe the experience, and choose the reason category.",
  "exit_1": "Mark whether the person is eligible for rehire, flag any risk, and capture their feedback. Then save the interview.",

  dept_0: "And Department Performance, in the main menu, gives leaders a clear view of how every department is performing.",

  closing_0: "That is Synax HRMS. From hiring and onboarding, to attendance, work, leave, reviews and exit, every people process works together in one system. Book a demo to see it on your own data.",
};
if (typeof module !== "undefined") module.exports = NARRATION;
