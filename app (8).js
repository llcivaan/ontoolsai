function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

const C = {
  amber:"#E8960A", amberDim:"#E8960A15", amberBorder:"#E8960A40",
  bg:"#0D0D0D", surface:"#131313", surface2:"#1A1A1A", surface3:"#242424",
  border:"#222222", border2:"#2C2C2C", text:"#F0EBE0", muted:"#888", subtle:"#444",
  green:"#22C55E", greenDim:"#22C55E15", red:"#FF6B6B", redDim:"#FF6B6B15",
};
const FREE_LIMIT = 10;

const TRADES = [
  {id:"cleaning",label:"Cleaning",emoji:"🧹"},
  {id:"hvac",label:"HVAC",emoji:"❄️"},
  {id:"plumbing",label:"Plumbing",emoji:"🔧"},
  {id:"landscaping",label:"Landscaping",emoji:"🌿"},
  {id:"roofing",label:"Roofing",emoji:"🏠"},
  {id:"electrical",label:"Electrical",emoji:"⚡"},
  {id:"painting",label:"Painting",emoji:"🖌️"},
];
const TONES=[{id:"friendly",label:"Friendly",icon:"😊"},{id:"professional",label:"Professional",icon:"💼"},{id:"firm",label:"Firm",icon:"💪"}];
const CHANNELS=[{id:"sms",label:"SMS",icon:"📱"},{id:"email",label:"Email",icon:"📧"},{id:"facebook",label:"Facebook",icon:"💬"}];

const MODULES=[
  {id:"communication",icon:"💬",label:"Customer Messages",desc:"Quotes, complaints, delays & more",tools:[
    {id:"quote_followup",tier:"free",seq:true,label:"Quote Follow-Up",desc:"Chase an unanswered quote — or generate a proven 5-message sequence (Day 1→2→3→5→14)",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Sarah"},{id:"job_type",label:"Job Type",ph:"e.g. deep clean, roof repair, AC service"},{id:"days_since",label:"Days Since Quote",ph:"e.g. 3"},{id:"your_name",label:"Your Name / Business",ph:"e.g. Mike, Sparkle Clean"}]},
    {id:"running_late",tier:"free",seq:false,label:"Running Late",desc:"Notify a customer you're delayed",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. John"},{id:"delay_time",label:"How Late?",ph:"e.g. 20–30 minutes"},{id:"your_name",label:"Your Name",ph:"e.g. Dave, Dave's Plumbing"}]},
    {id:"complaint_response",tier:"free",seq:false,label:"Complaint Response",desc:"Handle an unhappy customer",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Mrs. Thompson"},{id:"complaint",label:"Their Complaint",ph:"e.g. job took too long, left a mess"},{id:"resolution",label:"What You'll Offer",ph:"e.g. free follow-up, 10% discount"}]},
    {id:"price_increase",tier:"pro",seq:false,label:"Price Increase Letter",desc:"Announce a rate rise without losing clients",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Green Valley Landscaping"},{id:"old_price",label:"Current Price",ph:"e.g. $120 per visit"},{id:"new_price",label:"New Price",ph:"e.g. $140 per visit"},{id:"effective_date",label:"Effective Date",ph:"e.g. April 1st"}]},
    {id:"no_show_followup",tier:"free",seq:false,label:"No-Show Follow-Up",desc:"Re-engage a customer who missed their slot",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Mike"},{id:"original_date",label:"Missed Appointment",ph:"e.g. Tuesday 10am"},{id:"your_name",label:"Your Name",ph:"e.g. Jake, ProClean"}]},
    {id:"cancellation_policy",tier:"pro",seq:false,label:"Cancellation Policy",desc:"Set fair expectations after cancellations",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Arctic HVAC"},{id:"policy_details",label:"Your Policy",ph:"e.g. 24-hr notice required, $50 late fee"},{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"}]},
  ]},
  {id:"reviews",icon:"⭐",label:"Review Management",desc:"Get more reviews, respond like a pro",tools:[
    {id:"review_request",tier:"free",seq:true,label:"Review Request",desc:"Ask for a Google review post-job",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Linda"},{id:"job_type",label:"Job Completed",ph:"e.g. boiler service, lawn care"},{id:"your_name",label:"Your Name",ph:"e.g. James"}]},
    {id:"positive_review",tier:"free",seq:false,label:"Respond to 5-Star Review",desc:"Paste their review — we write the perfect reply",fields:[{id:"review_text",label:"Paste the review",ph:"Paste the Google review here...",multiline:true},{id:"business_name",label:"Your Business",ph:"e.g. Elite HVAC"}]},
    {id:"negative_review",tier:"free",seq:false,label:"Respond to Bad Review",desc:"Paste their review — we defuse it professionally",fields:[{id:"review_text",label:"Paste the review",ph:"Paste the Google review here...",multiline:true},{id:"your_side",label:"Context / what you'd like to offer",ph:"e.g. we've addressed this with the team, happy to offer a free follow-up"},{id:"business_name",label:"Your Business",ph:"e.g. Elite HVAC"}]},
    {id:"neutral_review",tier:"pro",seq:false,label:"Respond to Neutral Review",desc:"Paste their review — we turn 'fine' into loyal",fields:[{id:"review_text",label:"Paste the review",ph:"Paste the Google review here...",multiline:true},{id:"business_name",label:"Your Business",ph:"e.g. ProClean Services"}]},
  ]},
  {id:"payments",icon:"💰",label:"Payment Follow-Ups",desc:"Chase invoices without damaging relationships",tools:[
    {id:"invoice_reminder_1",tier:"free",seq:true,label:"First Reminder",desc:"Polite nudge — assumes it's an oversight",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"},{id:"amount",label:"Invoice Amount",ph:"e.g. $350"},{id:"days_overdue",label:"Days Overdue",ph:"e.g. 7"},{id:"your_name",label:"Your Name",ph:"e.g. Sam, ProClean"}]},
    {id:"invoice_reminder_2",tier:"free",seq:false,label:"Second Reminder",desc:"Firmer — urgency without aggression",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"},{id:"amount",label:"Invoice Amount",ph:"e.g. $350"},{id:"days_overdue",label:"Days Overdue",ph:"e.g. 21"}]},
    {id:"invoice_final",tier:"pro",seq:false,label:"Final Notice",desc:"Professional final demand before escalation",fields:[{id:"customer_name",label:"Amount Owed",ph:"e.g. Tom"},{id:"amount",label:"Amount Owed",ph:"e.g. $350"},{id:"days_overdue",label:"Days Overdue",ph:"e.g. 45"},{id:"your_name",label:"Your Business",ph:"e.g. Dave's Plumbing"}]},
    {id:"deposit_request",tier:"pro",seq:false,label:"Deposit Request",desc:"Ask for upfront payment without awkwardness",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Karen"},{id:"job_type",label:"Job Type",ph:"e.g. full roof replacement"},{id:"deposit_amount",label:"Deposit Amount",ph:"e.g. $500 (50%)"}]},
  ]},
  {id:"social",icon:"📱",label:"Social & Marketing",desc:"Posts, promos & seasonal campaigns",tools:[
    {id:"weekly_posts",tier:"free",seq:false,label:"Weekly Facebook Posts",desc:"3 ready-to-post updates for this week",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Green Cut Landscaping"},{id:"service_area",label:"Service Area",ph:"e.g. Austin, TX"},{id:"focus",label:"This Week's Focus",ph:"e.g. spring deals, hiring, tips"}]},
    {id:"seasonal_promo",tier:"free",seq:false,label:"Seasonal Promotion",desc:"A compelling seasonal offer post",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Arctic HVAC"},{id:"season",label:"Season / Event",ph:"e.g. summer, spring, pre-winter"},{id:"offer",label:"Your Offer",ph:"e.g. 20% off AC tune-up, free assessment"}]},
    {id:"reactivation",tier:"pro",seq:true,label:"Slow Season Reactivation",desc:"Win back past customers when it's quiet",fields:[{id:"business_name",label:"Business Name",ph:"e.g. TidyHome Cleaning"},{id:"service",label:"Service to Promote",ph:"e.g. deep clean, pipe inspection"},{id:"incentive",label:"Incentive Offered",ph:"e.g. 15% off, free add-on"}]},
    {id:"google_bio",tier:"pro",seq:false,label:"Google Business Bio",desc:"Write a compelling Google Business Profile description",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Premier Plumbing Co."},{id:"years_trading",label:"Years in Business",ph:"e.g. 12"},{id:"service_area",label:"Service Area",ph:"e.g. Dallas, TX & surrounds"},{id:"speciality",label:"Your Speciality",ph:"e.g. emergency callouts, eco-friendly products"}]},
  ]},
  {id:"hiring",icon:"👥",label:"Hiring & Team",desc:"Job ads, onboarding & tough conversations",tools:[
    {id:"job_ad",tier:"free",seq:false,label:"Job Ad Writer",desc:"A job listing that actually attracts good people",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Premier Plumbing Co."},{id:"role",label:"Role / Position",ph:"e.g. experienced plumber, cleaning tech"},{id:"pay",label:"Pay / Benefits",ph:"e.g. $25–30/hr, van provided, flexible hours"},{id:"location",label:"Location",ph:"e.g. Dallas, TX"}]},
    {id:"new_hire_welcome",tier:"free",seq:false,label:"New Hire Welcome",desc:"Make someone feel great on day one",fields:[{id:"employee_name",label:"Employee Name",ph:"e.g. Carlos"},{id:"role",label:"Their Role",ph:"e.g. HVAC technician"},{id:"start_date",label:"Start Date",ph:"e.g. Monday March 24th"},{id:"business_name",label:"Your Business",ph:"e.g. CoolAir Services"}]},
    {id:"performance_script",tier:"pro",seq:false,label:"Performance Conversation",desc:"Script a tough conversation with a team member",fields:[{id:"employee_name",label:"Employee Name",ph:"e.g. Ryan"},{id:"issue",label:"The Issue",ph:"e.g. consistently late, quality of work slipping"},{id:"previous_warnings",label:"Previous Warnings?",ph:"e.g. verbal warning last month, or none yet"}]},
  ]},
];

const AFFILIATES={
  quote_followup:{name:"Jobber",cta:"Send quotes & track follow-ups automatically",desc:"200,000+ trade businesses use Jobber. It chases quotes so you don't have to.",link:"#"},
  running_late:{name:"Housecall Pro",cta:"Automate on-my-way texts for every job",desc:"Customers get automatic SMS updates before you arrive. Zero effort.",link:"#"},
  complaint_response:{name:"Podium",cta:"Manage all customer conversations in one inbox",desc:"Never miss a message, review, or complaint again.",link:"#"},
  price_increase:{name:"ActiveCampaign",cta:"Email this to all your clients at once",desc:"Automated email campaigns that reach every customer on your list.",link:"#"},
  no_show_followup:{name:"Jobber",cta:"Eliminate no-shows with automatic reminders",desc:"Automated appointment reminders cut no-shows by up to 40%.",link:"#"},
  cancellation_policy:{name:"Jobber",cta:"Enforce your policy automatically with Jobber",desc:"Jobber handles deposits, cancellations and rebooking — hands-free.",link:"#"},
  review_request:{name:"NiceJob",cta:"Automate review collection after every job",desc:"NiceJob sends review requests automatically. Average 4x more reviews.",link:"#"},
  positive_review:{name:"NiceJob",cta:"Monitor every review across every platform",desc:"See all your Google, Yelp & Facebook reviews in one place, instantly.",link:"#"},
  negative_review:{name:"Podium",cta:"Respond to every review from one app",desc:"Never let a bad review sit unanswered again.",link:"#"},
  neutral_review:{name:"NiceJob",cta:"Turn average customers into raving fans — NiceJob",desc:"Automated follow-ups turn 3-star experiences into 5-star reviews.",link:"#"},
  invoice_reminder_1:{name:"Jobber",cta:"Get paid faster with automated invoice reminders",desc:"Jobber chases invoices for you. Businesses get paid 3x faster.",link:"#"},
  invoice_reminder_2:{name:"Wave",cta:"Free invoicing with automatic payment reminders",desc:"Wave is 100% free invoicing built for small businesses.",link:"#"},
  invoice_final:{name:"Jobber",cta:"Never chase an invoice manually again",desc:"Jobber automates every stage of your payment collection.",link:"#"},
  deposit_request:{name:"Jobber",cta:"Collect deposits online before the job starts",desc:"Online payments, deposits and invoices — all in one place.",link:"#"},
  weekly_posts:{name:"Later",cta:"Schedule all 3 posts automatically — Later",desc:"Later posts to Facebook, Instagram & more on autopilot. Free plan available.",link:"https://try.later.com/pb6zdy4ea0iq"},
  seasonal_promo:{name:"ActiveCampaign",cta:"Email this promo to your entire customer list",desc:"Reach every past customer in one click with automated campaigns.",link:"#"},
  reactivation:{name:"ActiveCampaign",cta:"Send this to all past customers automatically",desc:"Reconnect with hundreds of past clients at once.",link:"#"},
  google_bio:{name:"Podium",cta:"Manage your entire Google presence in one place",desc:"Podium keeps your listings accurate, monitored and converting.",link:"#"},
  job_ad:{name:"Indeed",cta:"Post this job to 250M+ job seekers — Indeed",desc:"Post for free. Boost for faster results.",link:"#"},
  new_hire_welcome:{name:"Connecteam",cta:"Manage your whole team from one app",desc:"Scheduling, time tracking and team comms built for trades.",link:"#"},
  performance_script:{name:"Connecteam",cta:"Track performance and manage your team — Connecteam",desc:"Keep records of every conversation and performance note in one place.",link:"#"},
};

const COMMUNITY=[
  {trade:"Cleaning",tool:"Review Request",stat:"68% response rate",text:"Hi [Name], just a quick one — if today's clean was up to scratch, we'd love a Google review. Takes 30 seconds and means the world to a small business like ours. Here's the link..."},
  {trade:"HVAC",tool:"Invoice Reminder",stat:"Paid within 24hrs",text:"Hey [Name], hope the new unit's keeping you cool! Just noticed invoice #204 is still outstanding — no rush, just wanted to flag it before it slips through the cracks..."},
  {trade:"Plumbing",tool:"Quote Follow-Up",stat:"43% conversion rate",text:"Hi [Name], just circling back on the quote for the bathroom work. Happy to adjust anything if the price is a sticking point — even a phased approach might work for you..."},
  {trade:"Landscaping",tool:"Seasonal Promo",stat:"31 bookings in 48hrs",text:"Spring's here and we're already getting booked up fast. For a limited time we're offering a free lawn assessment with every new seasonal contract. Reply to claim yours..."},
];

// ─── TRADE-AWARE PLACEHOLDERS ─────────────────────────────────────────────────
const TRADE_PH = {
  cleaning: {
    customer_name:"e.g. Sarah", business_name:"e.g. Sparkle Clean Services", your_name:"e.g. Lisa, Sparkle Clean",
    job_type:"e.g. deep clean, end-of-tenancy", service_area:"e.g. Austin, TX", speciality:"e.g. eco-friendly products, Airbnb turnovers",
    service:"e.g. deep clean, oven cleaning", offer:"e.g. 20% off spring deep clean", focus:"e.g. spring deals, hiring, tips",
    role:"e.g. cleaning technician, team lead", location:"e.g. Dallas, TX",
  },
  hvac: {
    customer_name:"e.g. Tom", business_name:"e.g. Arctic HVAC Solutions", your_name:"e.g. Mike, Arctic HVAC",
    job_type:"e.g. AC service, boiler install", service_area:"e.g. Phoenix, AZ", speciality:"e.g. emergency callouts, energy-efficient systems",
    service:"e.g. AC tune-up, furnace check", offer:"e.g. Free AC inspection this month", focus:"e.g. pre-summer tune-ups, tips",
    role:"e.g. HVAC technician, installer", location:"e.g. Phoenix, AZ",
  },
  plumbing: {
    customer_name:"e.g. Dave", business_name:"e.g. Premier Plumbing Co.", your_name:"e.g. Jake, Premier Plumbing",
    job_type:"e.g. bathroom refit, boiler repair", service_area:"e.g. Chicago, IL", speciality:"e.g. emergency callouts, bathroom refits",
    service:"e.g. pipe inspection, drain clearing", offer:"e.g. Free pipe inspection this week", focus:"e.g. winter prep, emergency tips",
    role:"e.g. experienced plumber, apprentice", location:"e.g. Chicago, IL",
  },
  landscaping: {
    customer_name:"e.g. Karen", business_name:"e.g. Green Valley Landscaping", your_name:"e.g. Sam, Green Valley",
    job_type:"e.g. lawn care, garden design", service_area:"e.g. Austin, TX", speciality:"e.g. sustainable gardens, irrigation",
    service:"e.g. lawn care, hedge trimming", offer:"e.g. Free lawn assessment with spring contract", focus:"e.g. spring deals, new services",
    role:"e.g. landscaper, garden designer", location:"e.g. Austin, TX",
  },
  roofing: {
    customer_name:"e.g. Mark", business_name:"e.g. Summit Roofing Co.", your_name:"e.g. Dan, Summit Roofing",
    job_type:"e.g. full roof replacement, leak repair", service_area:"e.g. Denver, CO", speciality:"e.g. storm damage, flat roofs",
    service:"e.g. roof inspection, gutter repair", offer:"e.g. Free roof inspection before winter", focus:"e.g. storm season prep, hiring",
    role:"e.g. experienced roofer, estimator", location:"e.g. Denver, CO",
  },
  electrical: {
    customer_name:"e.g. James", business_name:"e.g. Volt Electrical Services", your_name:"e.g. Chris, Volt Electrical",
    job_type:"e.g. rewire, EV charger install", service_area:"e.g. Seattle, WA", speciality:"e.g. EV chargers, smart home wiring",
    service:"e.g. safety inspection, panel upgrade", offer:"e.g. 15% off EV charger installs", focus:"e.g. EV chargers, safety tips",
    role:"e.g. qualified electrician, apprentice", location:"e.g. Seattle, WA",
  },
  painting: {
    customer_name:"e.g. Chris", business_name:"e.g. Fresh Coat Painting Co.", your_name:"e.g. Matt, Fresh Coat",
    job_type:"e.g. interior repaint, exterior full coat", service_area:"e.g. Toronto, ON", speciality:"e.g. exterior painting, colour consulting",
    service:"e.g. interior repaint, deck stain", offer:"e.g. Free colour consult with every quote", focus:"e.g. spring exterior jobs, tips",
    role:"e.g. experienced painter, colour consultant", location:"e.g. Toronto, ON",
  },
};

function getTradePh(trade, fieldId, fallback) {
  return _optionalChain([TRADE_PH, 'access', _2 => _2[trade], 'optionalAccess', _3 => _3[fieldId]]) || fallback;
}

// Tools where the "Send via" channel picker doesn't apply
const FIXED_CHANNEL = {
  positive_review: "Google Review reply",
  negative_review: "Google Review reply",
  neutral_review: "Google Review reply",
  google_bio: "Google Business Profile bio",
  job_ad: "Job listing post",
  weekly_posts: "Facebook posts",
  performance_script: "Face-to-face script",
};

// ─── REVIEW SENTIMENT MISMATCH DETECTION ─────────────────────────────────────
const POS_WORDS = ["amazing","awesome","excellent","fantastic","great","love","loved","wonderful","best","perfect","highly recommend","professional","friendly","helpful","thorough","outstanding","brilliant","impressed","incredible","superb","thank","thanks","pleased","happy","satisfied","5 star","five star","top notch","couldn't be happier","above and beyond"];
const NEG_WORDS = ["terrible","horrible","awful","worst","rude","unprofessional","never","rip off","ripoff","waste","disappointed","disgusting","avoid","scam","nightmare","incompetent","overcharged","damaged","broke","dirty","late","didn't show","no show","wouldn't recommend","do not use","don't bother","charged me","poor","useless","joke"];

function detectReviewMismatch(toolId, reviewText) {
  if(!reviewText || reviewText.trim().length < 15) return null;
  const lower = reviewText.toLowerCase();
  const posScore = POS_WORDS.filter(w => lower.includes(w)).length;
  const negScore = NEG_WORDS.filter(w => lower.includes(w)).length;

  if(toolId === "negative_review" && posScore >= 2 && posScore > negScore * 2) {
    return {icon:"😅", text:"Sure this is a bad review? Sounds like you're smashing it — your customers couldn't leave a bad one if they tried."};
  }
  if(toolId === "positive_review" && negScore >= 2 && negScore > posScore * 2) {
    return {icon:"😬", text:"This doesn't read like a 5-star. Want to use 'Respond to Bad Review' instead? It'll handle the tone better."};
  }
  return null;
}

// ─── JOBS STORAGE ─────────────────────────────────────────────────────────────
function loadJobs() { try { return JSON.parse(localStorage.getItem("ontoolsai_jobs")||"[]"); } catch (e2) { return []; } }
function saveJobs(jobs) { localStorage.setItem("ontoolsai_jobs",JSON.stringify(jobs)); }
function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function friendlyDate(dk) {
  const today=dateKey(new Date());
  const tom=dateKey(new Date(Date.now()+86400000));
  const yest=dateKey(new Date(Date.now()-86400000));
  if(dk===today) return "Today";
  if(dk===tom) return "Tomorrow";
  if(dk===yest) return "Yesterday";
  const d=new Date(dk+"T12:00:00");
  return d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
}
const JOB_STATUSES=[
  {id:"quoted",label:"Quoted",emoji:"📋",color:"#F59E0B"},
  {id:"booked",label:"Booked",emoji:"📅",color:"#3B82F6"},
  {id:"done",label:"Done",emoji:"✅",color:C.green},
  {id:"paid",label:"Paid",emoji:"💰",color:"#22C55E"},
];

// ─── DEMO JOBS (one per trade, realistic) ────────────────────────────────────
const DEMO_JOBS={
  cleaning:{customer:"Sarah",jobType:"Deep clean",time:"morning",amount:"$180",status:"booked"},
  hvac:{customer:"Tom",jobType:"AC service",time:"morning",amount:"$280",status:"quoted"},
  plumbing:{customer:"Dave",jobType:"Bathroom refit",time:"afternoon",amount:"$450",status:"quoted"},
  landscaping:{customer:"Karen",jobType:"Lawn care",time:"morning",amount:"$120",status:"booked"},
  roofing:{customer:"Mark",jobType:"Roof inspection",time:"morning",amount:"$350",status:"quoted"},
  electrical:{customer:"James",jobType:"EV charger install",time:"afternoon",amount:"$600",status:"quoted"},
  painting:{customer:"Chris",jobType:"Interior repaint",time:"morning",amount:"$850",status:"quoted"},
};

// ─── BREAKFAST NUDGE LINES (shown when free limit hit) ───────────────────────
const BREAKFAST_NUDGES=[
  {text:"You've got a job coming up and a message to send. Buy me a breakfast and I'll get your ducks in a row.",icon:"🍳"},
  {text:"10 messages gone already? You're on fire. Buy me a breakfast and I'll keep the messages coming.",icon:"🔥"},
  {text:"Your next follow-up is sitting right there. Buy me a breakfast and I'll write it for you.",icon:"☕"},
  {text:"You've used all 10 free messages — but your jobs aren't going to chase themselves. Breakfast is $5.99.",icon:"🥞"},
  {text:"Your customers are waiting. Buy me a breakfast — $5.99/mo — and I'll never stop writing for you.",icon:"🍳"},
];

// ─── JOB-BASED NUDGES ────────────────────────────────────────────────────────
function getJobNudges(jobs, msgHistory) {
  const nudges=[];
  const now=Date.now();
  if(!jobs||jobs.length===0) return nudges;
  for(const job of jobs) {
    const days=Math.floor((now-job.created)/(1000*60*60*24));
    const name=job.customer;
    if(!name) continue;
    if(job.status==="quoted"&&days>=2) {
      nudges.push({icon:"📋",urgent:days>=5,text:`${name} — quoted ${days}d ago. Follow up?`,tool:"quote_followup",prefill:{customer_name:name,job_type:job.jobType}});
    }
    if(job.status==="done"&&days>=1) {
      const asked=(msgHistory||[]).some(h=>h.toolId==="review_request"&&(_optionalChain([h, 'access', _4 => _4.fields, 'optionalAccess', _5 => _5.customer_name])||"").toLowerCase()===name.toLowerCase()&&h.timestamp>job.created);
      if(!asked) nudges.push({icon:"⭐",urgent:days>=3,text:`${name}'s job is done — ask for a review?`,tool:"review_request",prefill:{customer_name:name,job_type:job.jobType}});
    }
    if(job.status==="done"&&job.amount&&days>=7) {
      nudges.push({icon:"💰",urgent:true,text:`${name} owes ${job.amount} — ${days} days.`,tool:"invoice_reminder_1",prefill:{customer_name:name,amount:job.amount,days_overdue:String(days)}});
    }
    if(job.status==="booked"&&job.date===dateKey(new Date())) {
      nudges.push({icon:"🚗",urgent:false,text:`${name} booked today${job.time?" ("+job.time+")":""}. Running late?`,tool:"running_late",prefill:{customer_name:name}});
    }
  }
  return nudges.slice(0,5);
}

// ─── SMART NUDGE ENGINE ──────────────────────────────────────────────────────
// Detects follow-up opportunities from message history
const SEQUENCE_MAP = {
  quote_followup: {next:"quote_followup",label:"another follow-up",days:[2,3,5,14]},
  invoice_reminder_1: {next:"invoice_reminder_2",label:"a firmer second reminder",days:[7,14]},
  invoice_reminder_2: {next:"invoice_final",label:"a final notice",days:[14,21]},
  review_request: {next:"review_request",label:"a follow-up review request",days:[5,7,14]},
};

function getSmartNudges(history, currentToolId, currentFields) {
  if(!history||history.length===0) return [];
  const nudges = [];
  const now = Date.now();
  const customerName = (_optionalChain([currentFields, 'optionalAccess', _6 => _6.customer_name])||"").trim().toLowerCase();

  // 1. Check if there's a sequence follow-up opportunity for this customer
  if(customerName) {
    const customerHistory = history.filter(h =>
      (_optionalChain([h, 'access', _7 => _7.fields, 'optionalAccess', _8 => _8.customer_name])||"").trim().toLowerCase() === customerName
    ).sort((a,b) => b.timestamp - a.timestamp);

    if(customerHistory.length > 0) {
      const last = customerHistory[0];
      const daysSince = Math.floor((now - last.timestamp) / (1000*60*60*24));
      const toolLabel = _optionalChain([MODULES, 'access', _9 => _9.flatMap, 'call', _10 => _10(m=>m.tools), 'access', _11 => _11.find, 'call', _12 => _12(t=>t.id===last.toolId), 'optionalAccess', _13 => _13.label]) || last.toolId;

      // Suggest next in sequence
      const seq = SEQUENCE_MAP[last.toolId];
      if(seq && currentToolId === seq.next && daysSince >= 1) {
        nudges.push({
          type:"sequence",
          icon:"🔗",
          text:`You sent ${last.fields.customer_name} a ${toolLabel} ${daysSince} day${daysSince===1?"":"s"} ago. This is the perfect next step.`,
          urgent: daysSince >= seq.days[0],
        });
      }
      // Generic "you've messaged this person before"
      else if(daysSince <= 30 && last.toolId !== currentToolId) {
        nudges.push({
          type:"context",
          icon:"💡",
          text:`You last messaged ${last.fields.customer_name} ${daysSince} day${daysSince===1?"":"s"} ago — ${toolLabel}.`,
          urgent:false,
        });
      }
    }
  }

  // 2. Check for overdue sequence follow-ups across all customers
  for(const entry of history) {
    const seq = SEQUENCE_MAP[entry.toolId];
    if(!seq) continue;
    const daysSince = Math.floor((now - entry.timestamp) / (1000*60*60*24));
    const name = _optionalChain([entry, 'access', _14 => _14.fields, 'optionalAccess', _15 => _15.customer_name]);
    if(!name) continue;

    // Check if we already sent the next message to this customer
    const alreadySent = history.some(h =>
      h.toolId === seq.next &&
      (_optionalChain([h, 'access', _16 => _16.fields, 'optionalAccess', _17 => _17.customer_name])||"").trim().toLowerCase() === name.trim().toLowerCase() &&
      h.timestamp > entry.timestamp
    );

    if(!alreadySent && daysSince >= (seq.days[0]||3) && daysSince <= 60) {
      // Only show if not already in nudges and not for current customer being typed
      const nameLC = name.trim().toLowerCase();
      if(nameLC !== customerName && !nudges.find(n=>n.customerName===nameLC)) {
        const toolLabel = _optionalChain([MODULES, 'access', _18 => _18.flatMap, 'call', _19 => _19(m=>m.tools), 'access', _20 => _20.find, 'call', _21 => _21(t=>t.id===entry.toolId), 'optionalAccess', _22 => _22.label]) || entry.toolId;
        nudges.push({
          type:"overdue",
          icon:"⏰",
          text:`${name} — sent ${toolLabel} ${daysSince} days ago. Time for ${seq.label}?`,
          urgent:true,
          customerName:nameLC,
          nextTool:seq.next,
          prefillName:name,
        });
      }
    }
  }

  return nudges.slice(0, 3); // Max 3 nudges
}

// ─── IDENTITY FIELDS — saved globally across all tools ────────────────────────
const IDENTITY_FIELDS = ["your_name","business_name"];

function loadIdentity() {
  try { return JSON.parse(localStorage.getItem("ontoolsai_identity")||"{}"); } catch (e3) { return {}; }
}
function saveIdentity(fields) {
  const existing = loadIdentity();
  let changed = false;
  for(const key of IDENTITY_FIELDS) {
    if(_optionalChain([fields, 'access', _23 => _23[key], 'optionalAccess', _24 => _24.trim, 'call', _25 => _25()])) { existing[key] = fields[key].trim(); changed = true; }
  }
  if(changed) localStorage.setItem("ontoolsai_identity", JSON.stringify(existing));
}

// ─── PER-TOOL FIELD MEMORY ───────────────────────────────────────────────────
function loadToolFields(toolId) {
  try { return JSON.parse(localStorage.getItem(`ontoolsai_tf_${toolId}`)||"{}"); } catch (e4) { return {}; }
}
function saveToolFields(toolId, fields) {
  localStorage.setItem(`ontoolsai_tf_${toolId}`, JSON.stringify(fields));
}

// ─── MESSAGE HISTORY ─────────────────────────────────────────────────────────
const MAX_HISTORY = 200;
function loadHistory() {
  try { return JSON.parse(localStorage.getItem("ontoolsai_history")||"[]"); } catch (e5) { return []; }
}
function saveHistoryEntry(entry) {
  const history = loadHistory();
  history.unshift(entry);
  if(history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem("ontoolsai_history", JSON.stringify(history));
  return history;
}

// ─── PROMPT BUILDER ────────────────────────────────────────────────────────────
function buildPrompt(trade, toolId, fields, tone, channel, isSeq, bv) {
  const tl = _optionalChain([TRADES, 'access', _26 => _26.find, 'call', _27 => _27(t=>t.id===trade), 'optionalAccess', _28 => _28.label]) || trade;
  const tn = _optionalChain([TONES, 'access', _29 => _29.find, 'call', _30 => _30(t=>t.id===tone), 'optionalAccess', _31 => _31.label]) || "professional";
  const ch = _optionalChain([CHANNELS, 'access', _32 => _32.find, 'call', _33 => _33(c=>c.id===channel), 'optionalAccess', _34 => _34.label]) || "SMS";
  const chRule = channel==="sms"?"Keep under 70 words. No formal greeting. Conversational SMS style.":channel==="email"?"Include a subject line. Greeting, body, sign-off. Up to 150 words.":"Conversational Facebook message. Up to 100 words. 1–2 emojis natural.";
  const tnRule = tone==="friendly"?"Warm and personal, like a trusted friend.":tone==="firm"?"Polite but direct and clear. No filler.":"Professional and polished.";
  const bvBlock = _optionalChain([bv, 'optionalAccess', _35 => _35.name])?`\nBusiness name: ${bv.name}\nOwner name: ${bv.ownerName}\nStyle: ${bv.style}\nHumour: ${bv.humour?"light humour welcome":"no humour"}`:""
  const fv = Object.entries(fields).map(([k,v])=>`${k}: ${v}`).join("\n");

  if(isSeq){
    if(toolId === 'quote_followup'){
      return `Write a 5-message quote follow-up sequence for a ${tl} business owner. Use this exact escalation framework based on how top trade businesses actually follow up:\n\nDay 1 — Politely confirm the customer received the quote. Zero pressure. Warm and brief. Assume it's an oversight.\nDay 2 — Be helpful. Ask if there are any comparisons, questions, or adjustments needed. Open a door, don't nudge a closed one.\nDay 3 — Introduce soft urgency. Mention that the diary is filling up or availability is limited. Still warm, not pushy.\nDay 5 — Force a gentle decision. Something like: "Do you want me to schedule this, or should I let it go for now?" Give them an easy out — that reduces resistance.\nDay 14 — Clean exit. Close it down professionally: "I'll close this on my end for now — but the door stays open whenever you're ready." Never burns the relationship.\n\nTone: ${tnRule}\nChannel: ${ch}. ${chRule}${bvBlock}\n\nDetails:\n${fv}\n\nLabel each message clearly: Day 1, Day 2, Day 3, Day 5, Day 14. Each must be copy-paste ready and stand alone. Mix up the format where appropriate — some calls, some texts.`;
    }
    return `Write a sequence of 3 messages for a ${tl} business owner.\nTask: ${toolId}\nTone: ${tnRule}\nChannel: ${ch}. ${chRule}${bvBlock}\n\nDetails:\n${fv}\n\nLabel them clearly: Message 1, Message 2, Message 3. Each should escalate appropriately. Each must be copy-paste ready and stand alone.`;
  }

  const map={
    quote_followup:`Write a ${tn} follow-up for a ${tl} business owner to a customer who hasn't replied to a quote.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    running_late:`Write a brief ${tn} running-late message for a ${tl} business.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    complaint_response:`Write a ${tn} response to a customer complaint for a ${tl} business. Empathetic and solution-focused.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    price_increase:`Write a ${tn} price increase letter for a ${tl} business. Warm, justifies value, preserves relationships.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    no_show_followup:`Write a ${tn} follow-up for a ${tl} business to a customer who missed their appointment.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    cancellation_policy:`Write a ${tn} cancellation policy message for a ${tl} business. Fair, professional, preserves goodwill.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    review_request:`Write a natural, non-pushy ${tn} review request for a ${tl} business post-job. Human, not robotic. Ask for Google review.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    positive_review:`Write a warm ${tn} public reply to a 5-star Google review for a ${tl} business. Read the actual review below and respond specifically to what the customer praised — don't be generic. Thank them by name if visible in the review. Keep under 80 words. Subtle SEO keywords for ${tl}.\n${tnRule}${bvBlock}\n\nThe review:\n${fields.review_text||""}\n\nBusiness: ${fields.business_name||""}`,
    negative_review:`Write a de-escalating ${tn} public reply to a negative Google review for a ${tl} business. Read the actual review below and address their specific complaints — don't be generic. Never defensive. Empathetic. Invite offline resolution. Keep under 100 words.\n${tnRule}${bvBlock}\n\nThe review:\n${fields.review_text||""}\n\nContext/resolution: ${fields.your_side||""}\nBusiness: ${fields.business_name||""}`,
    neutral_review:`Write a ${tn} public reply to a neutral/mixed Google review for a ${tl} business. Read the actual review below and respond to their specific points. Turn mild satisfaction into loyalty. Invite them back. Keep under 80 words.\n${tnRule}${bvBlock}\n\nThe review:\n${fields.review_text||""}\n\nBusiness: ${fields.business_name||""}`,
    invoice_reminder_1:`Write a polite first invoice reminder for a ${tl} business. Assumes oversight. Preserves relationship.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    invoice_reminder_2:`Write a firmer second invoice reminder for a ${tl} business. Professional urgency without aggression.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    invoice_final:`Write a professional final payment notice for a ${tl} business before escalation.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    deposit_request:`Write a ${tn} deposit request for a ${tl} business. Makes it feel standard practice.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    weekly_posts:`Write exactly 3 separate Facebook posts for a ${tl} business. Conversational, local, authentic. Label Post 1, Post 2, Post 3. Each under 80 words.\n${tnRule}${bvBlock}\n\n${fv}`,
    seasonal_promo:`Write a compelling seasonal promotion for a ${tl} business. Creates urgency, clear CTA.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    reactivation:`Write a warm reactivation message for a ${tl} business to send past customers. Reminds them of the service, includes incentive.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    google_bio:`Write a compelling Google Business Profile description for a ${tl} business. SEO-aware, warm, specific. Under 200 words.\n${tnRule}${bvBlock}\n\n${fv}`,
    job_ad:`Write a compelling job ad for a ${tl} business. Feels like a place people want to work, not just a list of requirements. Under 200 words.\n${tnRule}${bvBlock}\n\n${fv}`,
    new_hire_welcome:`Write a warm new hire welcome message for a ${tl} business. Makes them feel valued from day one.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    performance_script:`Write a professional performance conversation script for a ${tl} business owner to use with a team member. Constructive and fair.\n${tnRule}${bvBlock}\n\n${fv}`,
  };
  return map[toolId]||`Generate ${tn} professional content for a ${tl} business.\n${chRule}\n\n${fv}`;
}

// ─── SHARED STYLES ─────────────────────────────────────────────────────────────
const card=(extra={})=>({background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:14,...extra});
const btn=(active,extra={})=>({background:active?C.amberDim:C.surface2,border:`0.5px solid ${active?C.amber:C.border2}`,borderRadius:8,color:active?C.amber:C.muted,cursor:"pointer",transition:"all 0.15s",...extra});

// ─── TIME HELPERS ─────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if(mins < 1) return "just now";
  if(mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if(hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if(days === 1) return "yesterday";
  if(days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
function OnToolsAI(){
  const [step,setStep]=React.useState("trade");
  const [trade,setTrade]=React.useState(null);
  const [module,setModule]=React.useState(null);
  const [toolId,setToolId]=React.useState(null);
  const [fields,setFields]=React.useState({});
  const [tone,setTone]=React.useState("friendly");
  const [channel,setChannel]=React.useState("sms");
  const [isSeq,setIsSeq]=React.useState(false);
  const [output,setOutput]=React.useState("");
  const [loading,setLoading]=React.useState(false);
  const [copied,setCopied]=React.useState(false);
  const [usage,setUsage]=React.useState(0);
  const [showUpgrade,setShowUpgrade]=React.useState(false);
  const [showBV,setShowBV]=React.useState(false);
  const [bv,setBv]=React.useState(null);
  const [bvDraft,setBvDraft]=React.useState({name:"",ownerName:"",style:"friendly",humour:false});
  const [tab,setTab]=React.useState("write");
  const [feedbackIdea,setFeedbackIdea]=React.useState("");
  const [feedbackTags,setFeedbackTags]=React.useState([]);
  const [feedbackSent,setFeedbackSent]=React.useState(false);
  const [feedbackLoading,setFeedbackLoading]=React.useState(false);
  const [feedbackReply,setFeedbackReply]=React.useState("");

  // ─── Memory, history & jobs state ──────────────────────────────────────────
  const [msgHistory,setMsgHistory]=React.useState([]);
  const [autoFilled,setAutoFilled]=React.useState(false);
  const [jobs,setJobs]=React.useState([]);
  const [showJobModal,setShowJobModal]=React.useState(false);
  const [editingJob,setEditingJob]=React.useState(null);
  const [jobDraft,setJobDraft]=React.useState({customer:"",jobType:"",time:"morning",amount:"",status:"booked",date:dateKey(new Date())});
  const [calDate,setCalDate]=React.useState(dateKey(new Date()));

  React.useEffect(()=>{
    setUsage(parseInt(localStorage.getItem("ontoolsai_usage")||"0"));
    const saved=localStorage.getItem("ontoolsai_bv");
    if(saved){const p=JSON.parse(saved);setBv(p);setBvDraft(p);}
    setMsgHistory(loadHistory());
    setJobs(loadJobs());
  },[]);

  // ─── NEW: Auto-fill fields when tool changes ──────────────────────────────
  React.useEffect(()=>{
    if(!toolId || step !== "fields") return;
    const identity = loadIdentity();
    const toolSaved = loadToolFields(toolId);
    const merged = {};
    // Layer 1: per-tool saved fields (lowest priority for customer-specific fields)
    for(const [k,v] of Object.entries(toolSaved)) { if(_optionalChain([v, 'optionalAccess', _36 => _36.trim, 'call', _37 => _37()])) merged[k] = v; }
    // Layer 2: global identity fields override (your_name, business_name)
    for(const key of IDENTITY_FIELDS) { if(_optionalChain([identity, 'access', _38 => _38[key], 'optionalAccess', _39 => _39.trim, 'call', _40 => _40()])) merged[key] = identity[key]; }
    // Only auto-fill if fields are currently empty (user hasn't started typing)
    const currentlyEmpty = Object.values(fields).every(v=>!_optionalChain([v, 'optionalAccess', _41 => _41.trim, 'call', _42 => _42()]));
    if(currentlyEmpty && Object.keys(merged).length > 0) {
      setFields(merged);
      setAutoFilled(true);
      setTimeout(()=>setAutoFilled(false), 3000);
    }
  },[toolId, step]);

  const tradeObj=TRADES.find(t=>t.id===trade);
  const moduleObj=MODULES.find(m=>m.id===module);
  const toolObj=_optionalChain([moduleObj, 'optionalAccess', _43 => _43.tools, 'access', _44 => _44.find, 'call', _45 => _45(t=>t.id===toolId)]);
  const affiliate=AFFILIATES[toolId];
  const usageLeft=FREE_LIMIT-usage;

  // ─── Job-based nudges from calendar data ──────────────────────────────────
  const jobNudges = getJobNudges(jobs, msgHistory);

  // ─── Smart nudges for current tool + fields ───────────────────────────────
  const nudges = (step==="fields" && toolId) ? getSmartNudges(msgHistory, toolId, fields) : [];

  const generate=async(overrideSeq)=>{
    const seq=overrideSeq!==undefined?overrideSeq:isSeq;
    if(usage>=FREE_LIMIT){setShowUpgrade(true);return;}
    const filled=_optionalChain([toolObj, 'optionalAccess', _46 => _46.fields, 'access', _47 => _47.every, 'call', _48 => _48(f=>_optionalChain([fields, 'access', _49 => _49[f.id], 'optionalAccess', _50 => _50.trim, 'call', _51 => _51()]))]);
    if(!filled)return;
    setLoading(true);setOutput("");setStep("output");
    try{
      const prompt=buildPrompt(trade,toolId,fields,tone,channel,seq,bv);
      const res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      let text=_optionalChain([data, 'access', _52 => _52.content, 'optionalAccess', _53 => _53[0], 'optionalAccess', _54 => _54.text])||"Something went wrong. Please try again.";
      if(!bv)text+="\n\n— Written with OnToolsAI — the AI tool built for trades. Get 10 free messages: ontoolsai.com";
      setOutput(text);
      const n=usage+1;setUsage(n);localStorage.setItem("ontoolsai_usage",n.toString());

      // ─── NEW: Save to history, identity, and per-tool fields ────────────
      saveIdentity(fields);
      saveToolFields(toolId, fields);
      const newHistory = saveHistoryEntry({
        toolId,
        trade,
        fields: {...fields},
        tone,
        channel,
        isSeq: seq,
        output: text.slice(0, 500), // truncate output for storage
        timestamp: Date.now(),
      });
      setMsgHistory(newHistory);
    }catch (e6){setOutput("Connection error. Please check your internet and try again.");}
    setLoading(false);
  };

  const copy=()=>{navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const saveBV=()=>{setBv(bvDraft);localStorage.setItem("ontoolsai_bv",JSON.stringify(bvDraft));setShowBV(false);};
  const resetToFields=()=>{setStep("fields");setOutput("");setCopied(false);};
  const resetToModules=()=>{setStep("module");setToolId(null);setFields({});setOutput("");};
  const goHome=()=>{setStep("trade");setTrade(null);setModule(null);setToolId(null);setFields({});setOutput("");setTab("write");};

  // ─── Navigate to a tool from nudge ────────────────────────────────────
  const goToTool=(nextToolId, prefillCustomerName, extraPrefill)=>{
    const mod = MODULES.find(m=>m.tools.find(t=>t.id===nextToolId));
    if(!mod) return;
    setModule(mod.id);
    setToolId(nextToolId);
    const pf = prefillCustomerName ? {customer_name: prefillCustomerName} : {};
    setFields({...pf,...(extraPrefill||{})});
    setStep("fields");
    setTab("write");
  };

  // ─── Jobs CRUD ─────────────────────────────────────────────────────────
  const saveJob=()=>{
    if(!jobDraft.customer.trim()) return;
    let updated;
    if(editingJob) {
      updated=jobs.map(j=>j.id===editingJob.id?{...editingJob,...jobDraft}:j);
    } else {
      updated=[...jobs,{...jobDraft,id:Date.now().toString(),created:Date.now(),trade}];
    }
    saveJobs(updated);setJobs(updated);
    setShowJobModal(false);setEditingJob(null);
    setJobDraft({customer:"",jobType:"",time:"morning",amount:"",status:"booked",date:calDate});
  };
  const deleteJob=(id)=>{
    const updated=jobs.filter(j=>j.id!==id);
    saveJobs(updated);setJobs(updated);
    setShowJobModal(false);setEditingJob(null);
  };
  const openAddJob=(forDate)=>{
    setJobDraft({customer:"",jobType:"",time:"morning",amount:"",status:"booked",date:forDate||calDate});
    setEditingJob(null);setShowJobModal(true);
  };
  const openEditJob=(job)=>{
    setJobDraft({customer:job.customer,jobType:job.jobType,time:job.time,amount:job.amount||"",status:job.status,date:job.date});
    setEditingJob(job);setShowJobModal(true);
  };

  return(
    React.createElement('div', { style: {minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",color:C.text},}

      /* HEADER */
      , React.createElement('header', { style: {padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`0.5px solid ${C.border}`,position:"sticky",top:0,zIndex:100,background:C.bg},}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,cursor:"pointer"}, onClick: goHome,}
          , React.createElement('div', { style: {width:32,height:32,background:C.amber,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15},}
            , _optionalChain([tradeObj, 'optionalAccess', _55 => _55.emoji])||"⚡"
          )
          , React.createElement('div', null
            , React.createElement('div', { style: {fontSize:16,fontWeight:800,letterSpacing:"-0.3px"},}, "OnTools", React.createElement('span', { style: {color:C.amber},}, "AI"))
            , React.createElement('div', { style: {fontSize:10,color:C.subtle,letterSpacing:"0.8px",textTransform:"uppercase"},}, "You stay on the tools. We'll run the words."        )
          )
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8},}
          , bv&&React.createElement('div', { onClick: ()=>setShowBV(true), style: {fontSize:11,color:C.amber,background:C.amberDim,padding:"3px 9px",borderRadius:12,cursor:"pointer",border:`0.5px solid ${C.amberBorder}`},}, "🎨 " , bv.name)
          , React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {fontSize:11,color:usageLeft<=2?C.red:C.muted,background:C.surface2,padding:"4px 10px",borderRadius:20,cursor:"pointer",border:`0.5px solid ${usageLeft<=2?C.red+"40":C.border}`},}
            , usageLeft, " free left"
          )
        )
      )

      /* TABS */
      , trade&&step!=="trade"&&step!=="output"&&(
        React.createElement('div', { style: {display:"flex",borderBottom:`0.5px solid ${C.border}`,background:C.bg,position:"sticky",top:61,zIndex:99},}
          , [{id:"write",label:"✍️ Write"},{id:"jobs",label:"📅 My Jobs"},{id:"history",label:"📜 History"},{id:"top",label:"🏆 Top Messages"},{id:"wishlist",label:"💡 Build This"}].map(t=>(
            React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id), style: {flex:1,padding:"10px 4px",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${C.amber}`:"2px solid transparent",color:tab===t.id?C.amber:C.subtle,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.15s"},}
              , t.label
            )
          ))
        )
      )

      , React.createElement('main', { style: {maxWidth:500,margin:"0 auto",padding:"22px 18px 100px"},}

        /* ── MY JOBS TAB (Calendar + Nudges + Stats) ─────────────────────────── */
        , trade&&tab==="jobs"&&step!=="output"&&(
          React.createElement('div', null
            , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},}
              , React.createElement('div', null
                , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px"},}, "📅 My Jobs"  )
                , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:4},}, "Your planner — log jobs, get reminders"      )
              )
              , React.createElement('button', { onClick: ()=>openAddJob(calDate), style: {background:C.amber,border:"none",borderRadius:10,padding:"8px 14px",color:"#000",fontSize:12,fontWeight:800,cursor:"pointer"},}, "+ Add Job"  )
            )

            /* Week strip — ALWAYS visible */
            , React.createElement('div', { style: {display:"flex",gap:4,marginBottom:16,overflowX:"auto"},}
              , Array.from({length:7},(_,i)=>{
                const d=new Date();d.setDate(d.getDate()-3+i);
                const dk=dateKey(d);
                const isToday=dk===dateKey(new Date());
                const isSel=dk===calDate;
                const hasJobs=jobs.some(j=>j.date===dk&&(j.trade===trade||!j.trade));
                const dayLabel=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
                return(
                  React.createElement('button', { key: dk, onClick: ()=>setCalDate(dk),
                    style: {flex:1,minWidth:44,padding:"8px 4px",background:isSel?C.amberDim:C.surface,border:`0.5px solid ${isSel?C.amber:C.border}`,borderRadius:10,cursor:"pointer",textAlign:"center",transition:"all 0.15s"},}
                    , React.createElement('div', { style: {fontSize:10,color:isSel?C.amber:C.subtle,fontWeight:600},}, dayLabel)
                    , React.createElement('div', { style: {fontSize:16,fontWeight:800,color:isSel?C.amber:isToday?"#FFF":C.muted,marginTop:2},}, d.getDate())
                    , hasJobs&&React.createElement('div', { style: {width:5,height:5,background:C.amber,borderRadius:3,margin:"3px auto 0"},})
                  )
                );
              })
            )

            /* ── EMPTY STATE (no jobs yet) ──────────────────────────────────────── */
            , jobs.length===0&&(
              React.createElement('div', null
                /* Demo job — immediately visible below week strip */
                , (()=>{
                  const demo=DEMO_JOBS[trade]||DEMO_JOBS.cleaning;
                  const st=JOB_STATUSES.find(s=>s.id===demo.status)||JOB_STATUSES[0];
                  return (
                    React.createElement('div', { style: {...card(),padding:18,border:`0.5px solid ${C.amberBorder}`,marginBottom:14},}
                      , React.createElement('div', { style: {fontSize:14,fontWeight:800,marginBottom:10},}, "See it in action ↓"    )
                      , React.createElement('div', { style: {...card(),padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12,background:C.surface2},}
                        , React.createElement('div', { style: {fontSize:10,color:C.subtle,fontWeight:600,textTransform:"uppercase",minWidth:44,textAlign:"center"},}
                          , demo.time==="morning"?"AM":demo.time==="afternoon"?"PM":"EVE"
                        )
                        , React.createElement('div', { style: {flex:1},}
                          , React.createElement('div', { style: {fontSize:14,fontWeight:700},}, demo.customer)
                          , React.createElement('div', { style: {fontSize:12,color:C.subtle,marginTop:2},}, demo.jobType, " · "  , demo.amount)
                        )
                        , React.createElement('div', { style: {background:st.color+"20",color:st.color,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,border:`0.5px solid ${st.color}40`},}
                          , st.emoji, " " , st.label
                        )
                      )
                      , React.createElement('button', { onClick: ()=>{
                        const d=DEMO_JOBS[trade]||DEMO_JOBS.cleaning;
                        const twoDaysAgo=new Date();twoDaysAgo.setDate(twoDaysAgo.getDate()-2);
                        const newJob={...d,id:Date.now().toString(),created:twoDaysAgo.getTime(),date:dateKey(twoDaysAgo),trade};
                        const updated=[newJob];
                        saveJobs(updated);setJobs(updated);setCalDate(dateKey(twoDaysAgo));
                      }, style: {width:"100%",background:C.amber,border:"none",borderRadius:10,padding:"12px",color:"#000",fontWeight:900,fontSize:14,cursor:"pointer"},}, "Try it — add a sample job"

                      )
                      , React.createElement('div', { style: {fontSize:11,color:C.subtle,textAlign:"center",marginTop:8},}, "Adds a real entry you can edit or delete anytime"         )
                    )
                  );
                })()

                /* How it works — below the fold is fine */
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8,marginBottom:14},}
                  , [
                    {icon:"📋",title:"Log your jobs",desc:"Add customers, job types, amounts — all in one place. Free, unlimited."},
                    {icon:"⚡",title:"Get smart reminders",desc:"Quoted 3 days ago? We'll nudge you to follow up. Job done? We'll prompt a review request."},
                    {icon:"💰",title:"Never miss a payment",desc:"Track what's owed, who's overdue, and send a reminder in one tap."},
                  ].map((c,i)=>(
                    React.createElement('div', { key: i, style: {...card(),padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start"},}
                      , React.createElement('div', { style: {fontSize:18,minWidth:26},}, c.icon)
                      , React.createElement('div', null
                        , React.createElement('div', { style: {fontSize:13,fontWeight:800,marginBottom:2},}, c.title)
                        , React.createElement('div', { style: {fontSize:11,color:C.muted,lineHeight:1.5},}, c.desc)
                      )
                    )
                  ))
                )
              )
            )

            /* ── HAS JOBS — full calendar experience ────────────────────────────── */
            , jobs.length>0&&(
              React.createElement('div', null
                /* Breakfast nudge — when free messages exhausted */
                , usage>=FREE_LIMIT&&(()=>{
                  const nudge=BREAKFAST_NUDGES[Math.floor(Date.now()/86400000)%BREAKFAST_NUDGES.length];
                  return (
                    React.createElement('div', { onClick: ()=>setShowUpgrade(true),
                      style: {...card(),padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,cursor:"pointer",border:`0.5px solid ${C.amberBorder}`,background:C.amberDim},}
                      , React.createElement('span', { style: {fontSize:20},}, nudge.icon)
                      , React.createElement('span', { style: {flex:1,fontSize:13,color:"#DDD",lineHeight:1.4},}, nudge.text)
                      , React.createElement('span', { style: {fontSize:11,color:C.amber,fontWeight:800,whiteSpace:"nowrap"},}, "☕ $5.99" )
                    )
                  );
                })()

                /* Job-based nudges */
                , jobNudges.length>0&&(
                  React.createElement('div', { style: {marginBottom:14},}
                    , React.createElement('div', { style: {fontSize:11,color:C.amber,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8},}, "⚡ Actions needed"  )
                    , jobNudges.map((n,i)=>(
                      React.createElement('div', { key: i, style: {...card(),padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10,border:`0.5px solid ${n.urgent?C.red+"25":C.amberBorder}`},}
                        , React.createElement('span', { style: {fontSize:16},}, n.icon)
                        , React.createElement('span', { style: {flex:1,fontSize:13,color:"#DDD",lineHeight:1.4},}, n.text)
                        , usage>=FREE_LIMIT?(
                          React.createElement('button', { onClick: ()=>setShowUpgrade(true),
                            style: {background:C.surface2,border:`0.5px solid ${C.amberBorder}`,borderRadius:8,padding:"6px 10px",color:C.amber,fontSize:10,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"},}, "☕ Unlock"

                          )
                        ):(
                          React.createElement('button', { onClick: ()=>goToTool(n.tool,_optionalChain([n, 'access', _56 => _56.prefill, 'optionalAccess', _57 => _57.customer_name]),n.prefill),
                            style: {background:C.amber,border:"none",borderRadius:8,padding:"6px 10px",color:"#000",fontSize:10,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"},}, "Go"

                          )
                        )
                      )
                    ))
                  )
                )

                /* Jobs for selected date */
                , React.createElement('div', { style: {marginBottom:16},}
                  , React.createElement('div', { style: {fontSize:13,fontWeight:700,marginBottom:10,color:C.muted},}, friendlyDate(calDate))
                  , (()=>{
                    const dayJobs=jobs.filter(j=>j.date===calDate&&(j.trade===trade||!j.trade)).sort((a,b)=>{
                      const order={morning:0,afternoon:1,evening:2};
                      return (order[a.time]||0)-(order[b.time]||0);
                    });
                    if(dayJobs.length===0) return (
                      React.createElement('div', { style: {...card(),padding:24,textAlign:"center"},}
                        , React.createElement('div', { style: {fontSize:28,marginBottom:8},}, "📭")
                        , React.createElement('div', { style: {fontSize:14,color:C.muted,marginBottom:12},}, "No jobs on "   , friendlyDate(calDate))
                        , React.createElement('button', { onClick: ()=>openAddJob(calDate), style: {background:C.amber,border:"none",borderRadius:10,padding:"10px 20px",color:"#000",fontWeight:800,fontSize:13,cursor:"pointer"},}, "+ Add a job"   )
                      )
                    );
                    return dayJobs.map(job=>{
                      const st=JOB_STATUSES.find(s=>s.id===job.status)||JOB_STATUSES[0];
                      return(
                        React.createElement('div', { key: job.id, onClick: ()=>openEditJob(job),
                          style: {...card(),padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,border:`0.5px solid ${C.border}`},}
                          , React.createElement('div', { style: {fontSize:10,color:C.subtle,fontWeight:600,textTransform:"uppercase",minWidth:44,textAlign:"center"},}
                            , job.time==="morning"?"AM":job.time==="afternoon"?"PM":"EVE"
                          )
                          , React.createElement('div', { style: {flex:1},}
                            , React.createElement('div', { style: {fontSize:14,fontWeight:700},}, job.customer)
                            , React.createElement('div', { style: {fontSize:12,color:C.subtle,marginTop:2},}, job.jobType, job.amount?` · ${job.amount}`:"")
                          )
                          , React.createElement('div', { style: {background:st.color+"20",color:st.color,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,border:`0.5px solid ${st.color}40`},}
                            , st.emoji, " " , st.label
                          )
                        )
                      );
                    });
                  })()
                )

                /* Add job button (always visible) */
                , jobs.filter(j=>j.date===calDate).length>0&&(
                  React.createElement('button', { onClick: ()=>openAddJob(calDate),
                    style: {width:"100%",...card(),padding:"12px",textAlign:"center",cursor:"pointer",color:C.muted,fontSize:13,fontWeight:600,marginBottom:16,border:`0.5px dashed ${C.border2}`},}, "+ Add another job for "
                         , friendlyDate(calDate)
                  )
                )

                /* Stats row — real data */
                , React.createElement('div', { style: {...card(),padding:14},}
                  , React.createElement('div', { style: {fontSize:12,fontWeight:700,marginBottom:10,color:C.muted},}, "📊 This month"  )
                  , React.createElement('div', { style: {display:"flex",gap:8},}
                    , (()=>{
                      const now=new Date();
                      const monthKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
                      const monthJobs=jobs.filter(j=>_optionalChain([j, 'access', _58 => _58.date, 'optionalAccess', _59 => _59.startsWith, 'call', _60 => _60(monthKey)])&&(j.trade===trade||!j.trade));
                      const doneCount=monthJobs.filter(j=>j.status==="done"||j.status==="paid").length;
                      const monthMsgs=msgHistory.filter(h=>{const d=new Date(h.timestamp);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()&&h.trade===trade;}).length;
                      return [
                        [String(monthJobs.length),"Jobs logged"],
                        [String(doneCount),"Completed"],
                        [String(monthMsgs),"Messages sent"],
                      ].map(([n,l])=>(
                        React.createElement('div', { key: l, style: {flex:1,background:C.surface2,borderRadius:10,padding:"10px 8px",textAlign:"center"},}
                          , React.createElement('div', { style: {fontSize:20,fontWeight:900,color:C.amber},}, n)
                          , React.createElement('div', { style: {fontSize:10,color:C.subtle,marginTop:2},}, l)
                        )
                      ));
                    })()
                  )
                  , (()=>{
                    const unpaid=jobs.filter(j=>j.status==="done"&&j.amount&&(j.trade===trade||!j.trade));
                    if(unpaid.length===0) return null;
                    return (
                      React.createElement('div', { style: {marginTop:10,padding:"8px 12px",background:C.redDim,borderRadius:8,border:`0.5px solid ${C.red}25`,fontSize:12,color:"#FFAAAA"},}, "💰 "
                         , unpaid.length, " job" , unpaid.length>1?"s":"", " awaiting payment"
                      )
                    );
                  })()
                )
              )
            )
          )
        )

        /* ── TOP MESSAGES TAB ──────────────────────────────────────────────────── */
        , trade&&tab==="top"&&step!=="output"&&(
          React.createElement('div', null
            , React.createElement('div', { style: {marginBottom:20},}
              , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px"},}, "🏆 Messages that worked"   )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:5},}, "Real messages from real trade business owners — with real results"          )
            )
            , COMMUNITY.map((c,i)=>(
              React.createElement('div', { key: i, style: {...card(),padding:16,marginBottom:10},}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"},}
                  , React.createElement('div', null
                    , React.createElement('span', { style: {fontSize:11,color:C.amber,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"},}, c.trade)
                    , React.createElement('span', { style: {fontSize:11,color:C.subtle,margin:"0 6px"},}, "·")
                    , React.createElement('span', { style: {fontSize:11,color:C.subtle},}, c.tool)
                  )
                  , React.createElement('div', { style: {fontSize:11,background:C.greenDim,color:C.green,padding:"2px 9px",borderRadius:10,fontWeight:700},}, c.stat)
                )
                , React.createElement('div', { style: {fontSize:13,color:"#AAA",lineHeight:1.6,fontStyle:"italic"},}, "\"", c.text, "\"")
                , React.createElement('button', { onClick: ()=>setShowUpgrade(true), style: {marginTop:10,background:"none",border:`0.5px solid ${C.amberBorder}`,borderRadius:8,padding:"6px 12px",color:C.amber,fontSize:12,cursor:"pointer",fontWeight:600},}, "Use this template →"

                )
              )
            ))
            , React.createElement('div', { style: {...card(),padding:16,textAlign:"center"},}
              , React.createElement('div', { style: {fontSize:13,color:C.subtle,marginBottom:6},}, "38 more templates in the library"     )
              , React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {fontSize:13,color:C.amber,fontWeight:700,cursor:"pointer"},}, "☕ Unlock all — one coffee a month"       )
            )
          )
        )

        /* ── HISTORY TAB ──────────────────────────────────────────────────────── */
        , trade&&tab==="history"&&step!=="output"&&(
          React.createElement('div', null
            , React.createElement('div', { style: {marginBottom:20},}
              , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px"},}, "📜 Your message history"   )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:5},}, "Every message you've generated — tap to re-use or follow up"          )
            )

            , msgHistory.length === 0 ? (
              React.createElement('div', { style: {...card(),padding:24,textAlign:"center"},}
                , React.createElement('div', { style: {fontSize:36,marginBottom:12},}, "✍️")
                , React.createElement('div', { style: {fontSize:15,fontWeight:700,marginBottom:6},}, "No messages yet"  )
                , React.createElement('div', { style: {fontSize:13,color:C.muted,lineHeight:1.5},}, "Once you generate your first message, it'll show up here. You'll be able to see who you messaged, when, and follow up at the right time."                         )
                , React.createElement('button', { onClick: ()=>setTab("write"), style: {marginTop:16,background:C.amber,border:"none",borderRadius:10,padding:"10px 20px",color:"#000",fontWeight:800,fontSize:13,cursor:"pointer"},}, "Write your first message →"

                )
              )
            ) : (
              React.createElement(React.Fragment, null
                /* Overdue follow-ups from history */
                , (()=>{
                  const overdueNudges = getSmartNudges(msgHistory, null, {}).filter(n=>n.type==="overdue");
                  if(overdueNudges.length===0) return null;
                  return (
                    React.createElement('div', { style: {marginBottom:16},}
                      , React.createElement('div', { style: {fontSize:11,color:C.red,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8},}, "⏰ Follow-ups due"  )
                      , overdueNudges.map((n,i)=>(
                        React.createElement('div', { key: i, style: {...card(),padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10,border:`0.5px solid ${C.red}25`},}
                          , React.createElement('div', { style: {flex:1,fontSize:13,color:"#DDD",lineHeight:1.4},}, n.text)
                          , React.createElement('button', { onClick: ()=>goToTool(n.nextTool,n.prefillName),
                            style: {background:C.amber,border:"none",borderRadius:8,padding:"6px 12px",color:"#000",fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"},}, "Send now"

                          )
                        )
                      ))
                    )
                  );
                })()

                /* History entries */
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8},}
                  , msgHistory.filter(h=>h.trade===trade).map((entry,i)=>{
                    const toolLabel = _optionalChain([MODULES, 'access', _61 => _61.flatMap, 'call', _62 => _62(m=>m.tools), 'access', _63 => _63.find, 'call', _64 => _64(t=>t.id===entry.toolId), 'optionalAccess', _65 => _65.label]) || entry.toolId;
                    const customerName = _optionalChain([entry, 'access', _66 => _66.fields, 'optionalAccess', _67 => _67.customer_name]) || _optionalChain([entry, 'access', _68 => _68.fields, 'optionalAccess', _69 => _69.business_name]) || "";
                    const preview = _optionalChain([entry, 'access', _70 => _70.output, 'optionalAccess', _71 => _71.slice, 'call', _72 => _72(0,120)]) || "";
                    return (
                      React.createElement('div', { key: i, style: {...card(),padding:"12px 14px",cursor:"pointer"},
                        onClick: ()=>{
                          const mod = MODULES.find(m=>m.tools.find(t=>t.id===entry.toolId));
                          if(mod){
                            setModule(mod.id);
                            setToolId(entry.toolId);
                            setFields({...entry.fields});
                            setTone(entry.tone||"friendly");
                            setChannel(entry.channel||"sms");
                            setStep("fields");
                            setTab("write");
                          }
                        },}
                        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},}
                          , React.createElement('div', { style: {display:"flex",gap:6,alignItems:"center"},}
                            , React.createElement('span', { style: {fontSize:11,color:C.amber,fontWeight:700},}, toolLabel)
                            , entry.isSeq&&React.createElement('span', { style: {fontSize:9,background:C.amberDim,color:C.amber,padding:"1px 6px",borderRadius:6,fontWeight:700,border:`0.5px solid ${C.amberBorder}`},}, "SEQ")
                          )
                          , React.createElement('span', { style: {fontSize:11,color:C.subtle},}, timeAgo(entry.timestamp))
                        )
                        , customerName&&React.createElement('div', { style: {fontSize:13,fontWeight:600,marginBottom:4},}, customerName)
                        , React.createElement('div', { style: {fontSize:12,color:C.subtle,lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},}, preview, "...")
                        , React.createElement('div', { style: {marginTop:8,fontSize:11,color:C.amber,fontWeight:600},}, "Tap to re-use these details →"     )
                      )
                    );
                  })
                  , msgHistory.filter(h=>h.trade===trade).length===0&&(
                    React.createElement('div', { style: {...card(),padding:20,textAlign:"center"},}
                      , React.createElement('div', { style: {fontSize:13,color:C.subtle},}, "No messages for "   , _optionalChain([tradeObj, 'optionalAccess', _73 => _73.label]), " yet. Start writing and they'll appear here."       )
                    )
                  )
                )

                /* Clear history */
                , msgHistory.length>0&&(
                  React.createElement('button', { onClick: ()=>{
                    if(confirm("Clear all message history? This can't be undone.")){
                      localStorage.removeItem("ontoolsai_history");
                      setMsgHistory([]);
                    }
                  }, style: {marginTop:16,display:"block",margin:"16px auto 0",background:"none",border:"none",color:C.subtle,fontSize:11,cursor:"pointer",textDecoration:"underline"},}, "Clear history"

                  )
                )
              )
            )
          )
        )

        /* ── WISHLIST / FEEDBACK TAB ───────────────────────────────────────────── */
        , trade&&tab==="wishlist"&&step!=="output"&&(
          React.createElement('div', null
            , !feedbackSent?(
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {marginBottom:24},}
                  , React.createElement('div', { style: {fontSize:26,fontWeight:900,letterSpacing:"-0.5px",marginBottom:8},}, "You're the boss."
                      , React.createElement('br', null), "What's missing? 🛠️"
                  )
                  , React.createElement('div', { style: {color:C.muted,fontSize:13,lineHeight:1.6},}, "This whole app got built because trade business owners needed it. Got a tool that'd save you an hour a week? Tell us and it'll probably exist by next month."

                  )
                )

                /* Quick-pick idea chips */
                , React.createElement('div', { style: {marginBottom:16},}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10},}, "Or tap something that sounds useful"     )
                  , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:7},}
                    , [
                      {id:"estimates",label:"📋 Estimate templates"},
                      {id:"contracts",label:"📝 Contract templates"},
                      {id:"instagram",label:"📸 Instagram captions"},
                      {id:"trades",label:"🔨 More trade types"},
                      {id:"blast",label:"📢 Message all customers"},
                      {id:"subcontractors",label:"🤝 Subcontractor comms"},
                      {id:"warranty",label:"🛡️ Warranty follow-ups"},
                      {id:"upsell",label:"💰 Upsell scripts"},
                      {id:"referral",label:"🎁 Referral ask messages"},
                      {id:"seasonal_email",label:"📧 Seasonal email blasts"},
                    ].map(chip=>{
                      const active=feedbackTags.includes(chip.id);
                      return(
                        React.createElement('button', { key: chip.id, onClick: ()=>setFeedbackTags(active?feedbackTags.filter(t=>t!==chip.id):[...feedbackTags,chip.id]),
                          style: {...btn(active),padding:"7px 12px",fontSize:12,fontWeight:600,borderRadius:20},}
                          , chip.label
                        )
                      );
                    })
                  )
                )

                /* Free text */
                , React.createElement('div', { style: {marginBottom:16},}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8},}, "Or describe it in your own words"      )
                  , React.createElement('textarea', {
                    value: feedbackIdea,
                    onChange: e=>setFeedbackIdea(e.target.value),
                    placeholder: "e.g. I need a message that asks customers to refer a mate without sounding desperate..."              ,
                    rows: 4,
                    style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box"},
                    onFocus: e=>{e.target.style.borderColor=C.amber;},
                    onBlur: e=>{e.target.style.borderColor=C.border2;},}
                  )
                )

                , React.createElement('button', {
                  onClick: async()=>{
                    if(!feedbackIdea.trim()&&feedbackTags.length===0)return;
                    setFeedbackLoading(true);
                    const tagLabels=feedbackTags.join(", ")||"(no quick picks selected)";
                    const prompt=`You are the OnToolsAI team — a witty, warm, trade-savvy AI tool for small trade businesses (cleaning, HVAC, plumbing, etc). A user just submitted a feature request. Respond in 2–3 sentences max. Be genuinely warm, a little funny, and make them feel like their idea was actually good. Don't be sycophantic. End with ONE punchy line of hype about what's coming.

Tags they selected: ${tagLabels}
Their message: "${feedbackIdea||"(no message — just tapped chips)"}"

Reply directly to them (use "you/your"). No bullet points. No "Thank you for your feedback." energy. Real talk.`;
                    try{
                      const res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,messages:[{role:"user",content:prompt}]})});
                      const data=await res.json();
                      setFeedbackReply(_optionalChain([data, 'access', _74 => _74.content, 'optionalAccess', _75 => _75[0], 'optionalAccess', _76 => _76.text])||"Your idea's in the pile. Good pile though.");
                    }catch (e7){setFeedbackReply("That idea just landed. We'll get on it.");}
                    setFeedbackSent(true);setFeedbackLoading(false);
                  },
                  disabled: feedbackLoading||(!feedbackIdea.trim()&&feedbackTags.length===0),
                  style: {width:"100%",background:(!feedbackIdea.trim()&&feedbackTags.length===0)||feedbackLoading?C.surface3:C.amber,border:"none",borderRadius:12,padding:"14px",color:(!feedbackIdea.trim()&&feedbackTags.length===0)||feedbackLoading?"#555":"#000",fontWeight:900,fontSize:15,cursor:(!feedbackIdea.trim()&&feedbackTags.length===0)||feedbackLoading?"default":"pointer",transition:"all 0.2s"},}
                  , feedbackLoading?"⏳ Sending it up the chain...":"🚀 Send it — make this thing better"
                )
              )
            ):(
              React.createElement('div', null
                /* Success state */
                , React.createElement('div', { style: {textAlign:"center",paddingTop:16,marginBottom:24},}
                  , React.createElement('div', { style: {fontSize:48,marginBottom:12},}, "🛠️")
                  , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px",marginBottom:8},}, "Got it. You're one of the good ones."       )
                )
                /* AI reply card */
                , React.createElement('div', { style: {...card(),padding:20,border:`0.5px solid ${C.amberBorder}`,marginBottom:20},}
                  , React.createElement('div', { style: {fontSize:11,color:C.amber,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10},}, "From the OnToolsAI team"   )
                  , React.createElement('div', { style: {fontSize:14,lineHeight:1.7,color:"#DDD"},}, feedbackReply)
                )
                /* What they sent */
                , (feedbackTags.length>0||feedbackIdea.trim())&&(
                  React.createElement('div', { style: {...card(),padding:16,marginBottom:20},}
                    , React.createElement('div', { style: {fontSize:11,color:C.subtle,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"},}, "What you sent us"   )
                    , feedbackTags.length>0&&React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:6,marginBottom:feedbackIdea.trim()?10:0},}
                      , feedbackTags.map(t=>React.createElement('span', { key: t, style: {background:C.amberDim,color:C.amber,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,border:`0.5px solid ${C.amberBorder}`},}, t))
                    )
                    , feedbackIdea.trim()&&React.createElement('div', { style: {fontSize:13,color:"#AAA",fontStyle:"italic",lineHeight:1.5},}, "\"", feedbackIdea, "\"")
                  )
                )
                , React.createElement('button', { onClick: ()=>{setFeedbackSent(false);setFeedbackIdea("");setFeedbackTags([]);setFeedbackReply("");},
                  style: {width:"100%",background:"none",border:`0.5px solid ${C.border2}`,borderRadius:12,padding:"12px",color:C.muted,fontWeight:600,fontSize:13,cursor:"pointer"},}, "Got another one? Send more ideas"

                )
              )
            )
          )
        )


        , (!trade||(tab==="write"&&step!=="output"))||(step==="output")?(
          React.createElement(React.Fragment, null
            /* TRADE SELECTION */
            , step==="trade"&&(
              React.createElement('div', null
                , React.createElement('div', { style: {textAlign:"center",marginBottom:28,paddingTop:8},}
                  , React.createElement('div', { style: {fontSize:13,color:C.subtle,letterSpacing:"2px",textTransform:"uppercase",marginBottom:10},}, "Step 1 of 3"   )
                  , React.createElement('h1', { style: {fontSize:26,fontWeight:900,margin:0,letterSpacing:"-0.5px"},}, "What's your trade?"  )
                  , React.createElement('p', { style: {color:C.muted,marginTop:8,fontSize:14},}, "Every message gets tailored to your business"      )
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8,marginBottom:24},}
                  , TRADES.map(t=>(
                    React.createElement('button', { key: t.id, onClick: ()=>{setTrade(t.id);setStep("module");setTab("write");},
                      style: {...card(),padding:"15px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",color:C.text,fontSize:15,fontWeight:600,transition:"all 0.15s",textAlign:"left",width:"100%"},
                      onMouseOver: e=>{e.currentTarget.style.border=`0.5px solid ${C.amber}`;e.currentTarget.style.background=C.surface2;},
                      onMouseOut: e=>{e.currentTarget.style.border=`0.5px solid ${C.border}`;e.currentTarget.style.background=C.surface;},}
                      , React.createElement('span', null, t.emoji, " " , t.label)
                      , React.createElement('span', { style: {color:C.amber},}, "→")
                    )
                  ))
                )
                , React.createElement('div', { style: {textAlign:"center",color:C.subtle,fontSize:12},}, "🔒 No account needed  ·  10 free messages/month  ·  No card required"           )
              )
            )

            /* MODULE SELECTION */
            , step==="module"&&(
              React.createElement('div', null
                , React.createElement('button', { onClick: ()=>setStep("trade"), style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0},}, "← Back" )
                , React.createElement('div', { style: {marginBottom:20},}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6},}, "Step 2 of 3"   )
                  , React.createElement('h2', { style: {fontSize:21,fontWeight:900,margin:0},}, "What do you need?"   )
                  , React.createElement('p', { style: {color:C.muted,marginTop:6,fontSize:14},}, _optionalChain([tradeObj, 'optionalAccess', _77 => _77.emoji]), " " , _optionalChain([tradeObj, 'optionalAccess', _78 => _78.label]), " — pick a category"    )
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8,marginBottom:18},}
                  , MODULES.map(m=>(
                    React.createElement('button', { key: m.id, onClick: ()=>{setModule(m.id);setStep("tool");},
                      style: {...card(),padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:C.text,textAlign:"left",transition:"all 0.15s",width:"100%"},
                      onMouseOver: e=>{e.currentTarget.style.border=`0.5px solid ${C.amberBorder}`;e.currentTarget.style.background=C.surface2;},
                      onMouseOut: e=>{e.currentTarget.style.border=`0.5px solid ${C.border}`;e.currentTarget.style.background=C.surface;},}
                      , React.createElement('span', { style: {fontSize:22,minWidth:30,textAlign:"center"},}, m.icon)
                      , React.createElement('div', null, React.createElement('div', { style: {fontWeight:700,fontSize:14},}, m.label), React.createElement('div', { style: {color:C.subtle,fontSize:12,marginTop:1},}, m.desc))
                    )
                  ))
                )
                /* Brand Voice CTA */
                , React.createElement('div', { onClick: ()=>setShowBV(true), style: {...card(),padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,border:`0.5px solid ${bv?C.amberBorder:C.border}`},}
                  , React.createElement('span', { style: {fontSize:20},}, "🎨")
                  , React.createElement('div', null
                    , React.createElement('div', { style: {fontSize:13,fontWeight:700,color:bv?C.amber:"#CCC"},}, bv?`Brand Voice: ${bv.name}`:"Set Your Brand Voice")
                    , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:1},}, bv?"Every message sounds like you — watermark removed":"Make outputs sound like your business, not generic AI")
                  )
                  , React.createElement('div', { style: {marginLeft:"auto",fontSize:12,color:bv?C.amber:C.subtle},}, bv?"Edit →":"Set up →")
                )
              )
            )

            /* TOOL SELECTION */
            , step==="tool"&&moduleObj&&(
              React.createElement('div', null
                , React.createElement('button', { onClick: ()=>setStep("module"), style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0},}, "← Back" )
                , React.createElement('div', { style: {marginBottom:18},}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6},}, "Step 3 of 3"   )
                  , React.createElement('h2', { style: {fontSize:20,fontWeight:900,margin:0},}, moduleObj.icon, " " , moduleObj.label)
                  , React.createElement('p', { style: {color:C.muted,marginTop:6,fontSize:14},}, "Choose what to write"   )
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8},}
                  , moduleObj.tools.map(t=>{
                    const locked=t.tier==="pro";
                    return(
                      React.createElement('button', { key: t.id,
                        onClick: ()=>{if(locked){setShowUpgrade(true);}else{setToolId(t.id);setStep("fields");setIsSeq(false);}},
                        style: {...card(),padding:"13px 16px",cursor:"pointer",textAlign:"left",color:C.text,transition:"all 0.15s",width:"100%",position:"relative",border:`0.5px solid ${toolId===t.id?C.amber:C.border}`,background:toolId===t.id?C.amberDim:C.surface,opacity:locked?0.75:1},
                        onMouseOver: e=>{e.currentTarget.style.border=`0.5px solid ${locked?"#FF6B6B40":C.amberBorder}`;e.currentTarget.style.background=locked?C.surface2:C.amberDim;},
                        onMouseOut: e=>{e.currentTarget.style.border=`0.5px solid ${toolId===t.id?C.amber:C.border}`;e.currentTarget.style.background=toolId===t.id?C.amberDim:C.surface;},}
                        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"},}
                          , React.createElement('div', { style: {fontWeight:700,fontSize:14},}, t.label)
                          , locked&&React.createElement('span', { style: {fontSize:10,background:"#FF6B6B15",color:"#FF6B6B",padding:"2px 8px",borderRadius:8,fontWeight:700,border:"0.5px solid #FF6B6B30",whiteSpace:"nowrap",marginLeft:8},}, "☕ Pro" )
                          , t.seq&&!locked&&React.createElement('span', { style: {fontSize:10,background:C.amberDim,color:C.amber,padding:"2px 8px",borderRadius:8,fontWeight:700,border:`0.5px solid ${C.amberBorder}`,whiteSpace:"nowrap",marginLeft:8},}, "Sequence available" )
                        )
                        , React.createElement('div', { style: {color:C.subtle,fontSize:12,marginTop:3},}, t.desc)
                        , locked&&React.createElement('div', { style: {fontSize:11,color:"#FF6B6B",marginTop:5},}, "One coffee a month unlocks this →"      )
                      )
                    );
                  })
                )
              )
            )

            /* FIELDS */
            , step==="fields"&&toolObj&&(
              React.createElement('div', null
                , React.createElement('button', { onClick: ()=>setStep("tool"), style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0},}, "← Back" )
                , React.createElement('div', { style: {marginBottom:18},}
                  , React.createElement('h2', { style: {fontSize:19,fontWeight:900,margin:0},}, toolObj.label)
                  , React.createElement('p', { style: {color:C.muted,marginTop:6,fontSize:13},}, "Fill in a few details — we handle the writing"         )
                )

                /* ── NEW: Auto-fill notification ──────────────────────────────── */
                , autoFilled&&(
                  React.createElement('div', { style: {background:C.greenDim,border:`0.5px solid ${C.green}30`,borderRadius:10,padding:"8px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:8},}
                    , React.createElement('span', { style: {fontSize:14},}, "⚡")
                    , React.createElement('span', { style: {fontSize:12,color:C.green,fontWeight:600},}, "Fields auto-filled from your last session"     )
                  )
                )

                /* ── NEW: Smart nudges ────────────────────────────────────────── */
                , nudges.length > 0 && (
                  React.createElement('div', { style: {marginBottom:14,display:"flex",flexDirection:"column",gap:6},}
                    , nudges.map((n,i)=>(
                      React.createElement('div', { key: i, style: {background:n.urgent?C.redDim:C.amberDim,border:`0.5px solid ${n.urgent?C.red+"30":C.amberBorder}`,borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8},}
                        , React.createElement('span', { style: {fontSize:14},}, n.icon)
                        , React.createElement('span', { style: {fontSize:12,color:n.urgent?"#FFAAAA":C.amber,lineHeight:1.4,flex:1},}, n.text)
                        , n.nextTool&&(
                          React.createElement('button', { onClick: ()=>goToTool(n.nextTool,n.prefillName),
                            style: {background:C.amber,border:"none",borderRadius:7,padding:"5px 10px",color:"#000",fontSize:10,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"},}, "Go"

                          )
                        )
                      )
                    ))
                  )
                )

                /* Fields */
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12,marginBottom:16},}
                  , toolObj.fields.map(f=>(
                    React.createElement('div', { key: f.id,}
                      , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, f.label)
                      , f.multiline ? (
                        React.createElement('textarea', { value: fields[f.id]||"", onChange: e=>setFields({...fields,[f.id]:e.target.value}), placeholder: getTradePh(trade, f.id, f.ph),
                          rows: 4,
                          style: {width:"100%",background:C.surface,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"11px 13px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color 0.15s",resize:"vertical",lineHeight:1.6},
                          onFocus: e=>{e.target.style.borderColor=C.amber;},
                          onBlur: e=>{e.target.style.borderColor=C.border2;},})
                      ) : (
                      React.createElement('input', { value: fields[f.id]||"", onChange: e=>setFields({...fields,[f.id]:e.target.value}), placeholder: getTradePh(trade, f.id, f.ph),
                        style: {width:"100%",background:C.surface,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"11px 13px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color 0.15s"},
                        onFocus: e=>{e.target.style.borderColor=C.amber;},
                        onBlur: e=>{e.target.style.borderColor=C.border2;},})
                      )
                    )
                  ))
                )

                /* ── Review sentiment mismatch detection ──────────────────── */
                , (()=>{
                  const mismatch = detectReviewMismatch(toolId, fields.review_text);
                  if(!mismatch) return null;
                  return (
                    React.createElement('div', { style: {background:C.amberDim,border:`0.5px solid ${C.amberBorder}`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"flex-start",gap:10},}
                      , React.createElement('span', { style: {fontSize:18,flexShrink:0,marginTop:1},}, mismatch.icon)
                      , React.createElement('span', { style: {fontSize:13,color:C.amber,lineHeight:1.5},}, mismatch.text)
                    )
                  );
                })()

                /* Tone */
                , React.createElement('div', { style: {marginBottom:12},}
                  , React.createElement('div', { style: {fontSize:11,color:"#888",marginBottom:7,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Tone")
                  , React.createElement('div', { style: {display:"flex",gap:6},}
                    , TONES.map(t=>(
                      React.createElement('button', { key: t.id, onClick: ()=>setTone(t.id),
                        style: {...btn(tone===t.id),flex:1,padding:"8px 4px",fontSize:12,fontWeight:600},}
                        , t.icon, " " , t.label
                      )
                    ))
                  )
                )

                /* Channel — only show picker when tool supports multiple channels */
                , !FIXED_CHANNEL[toolId] && (
                React.createElement('div', { style: {marginBottom:16},}
                  , React.createElement('div', { style: {fontSize:11,color:"#888",marginBottom:7,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Send via" )
                  , React.createElement('div', { style: {display:"flex",gap:6},}
                    , CHANNELS.map(c=>(
                      React.createElement('button', { key: c.id, onClick: ()=>setChannel(c.id),
                        style: {...btn(channel===c.id),flex:1,padding:"8px 4px",fontSize:11,fontWeight:600,lineHeight:1.4},}
                        , c.icon, React.createElement('br', null), c.label
                      )
                    ))
                  )
                )
                )

                /* Sequence Toggle */
                , toolObj.seq&&(
                  React.createElement('div', { onClick: ()=>{if(usage>=FREE_LIMIT){setShowUpgrade(true);return;}setIsSeq(!isSeq);},
                    style: {...card(),padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,border:`0.5px solid ${isSeq?C.amberBorder:C.border}`},}
                    , React.createElement('div', null
                      , React.createElement('div', { style: {fontSize:13,fontWeight:700,color:isSeq?C.amber:"#CCC"},}, "✨ Generate full "   , _optionalChain([toolObj, 'optionalAccess', _79 => _79.id])==="quote_followup"?"5":"3", "-message sequence" )
                      , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:1},}, _optionalChain([toolObj, 'optionalAccess', _80 => _80.id])==="quote_followup"?"Day 1 → 2 → 3 → 5 → 14 escalation — how top trade businesses actually follow up":"Instead of one — great for follow-ups that actually work")
                    )
                    , React.createElement('div', { style: {width:36,height:20,background:isSeq?C.amber:C.surface3,borderRadius:10,position:"relative",transition:"background 0.2s",flexShrink:0,marginLeft:12},}
                      , React.createElement('div', { style: {width:14,height:14,background:"#FFF",borderRadius:7,position:"absolute",top:3,left:isSeq?19:3,transition:"left 0.2s"},})
                    )
                  )
                )

                /* Generate Button */
                , !bv&&(
                  React.createElement('div', { style: {fontSize:11,color:C.subtle,marginBottom:8,textAlign:"center"},}, "Free messages include a OnToolsAI footer. "
                          , React.createElement('span', { onClick: ()=>setShowBV(true), style: {color:C.amber,cursor:"pointer"},}, "Remove it with Your Brand Voice →"      )
                  )
                )
                , React.createElement('button', { onClick: ()=>generate(),
                  disabled: !toolObj.fields.every(f=>_optionalChain([fields, 'access', _81 => _81[f.id], 'optionalAccess', _82 => _82.trim, 'call', _83 => _83()])),
                  style: {width:"100%",background:toolObj.fields.every(f=>_optionalChain([fields, 'access', _84 => _84[f.id], 'optionalAccess', _85 => _85.trim, 'call', _86 => _86()]))?C.amber:"#1A1A1A",border:"none",borderRadius:12,padding:"15px",cursor:toolObj.fields.every(f=>_optionalChain([fields, 'access', _87 => _87[f.id], 'optionalAccess', _88 => _88.trim, 'call', _89 => _89()]))?"pointer":"not-allowed",color:toolObj.fields.every(f=>_optionalChain([fields, 'access', _90 => _90[f.id], 'optionalAccess', _91 => _91.trim, 'call', _92 => _92()]))?"#000":"#333",fontSize:15,fontWeight:900,letterSpacing:"-0.2px",transition:"all 0.15s"},}
                  , isSeq?`✨ Generate ${toolId==="quote_followup"?"5":"3"}-Message Sequence`:"✨ Write This Message"
                )
                , React.createElement('div', { style: {textAlign:"center",marginTop:8,color:C.subtle,fontSize:11},}
                  , usageLeft, " of "  , FREE_LIMIT, " free messages remaining this month"
                )
              )
            )

            /* OUTPUT */
            , step==="output"&&(
              React.createElement('div', null
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},}
                  , React.createElement('div', { style: {fontSize:16,fontWeight:900},}, isSeq?`Your ${toolId==="quote_followup"?"5":"3"}-Message Sequence`:"Your Message")
                  , React.createElement('button', { onClick: resetToFields, style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:0},}, "Write another →"  )
                )

                /* Output box */
                , React.createElement('div', { style: {...card(),padding:18,marginBottom:10,border:`0.5px solid ${C.amberBorder}`,minHeight:80},}
                  , loading?(
                    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10},}
                      , [90,75,85,60,78].map((w,i)=>(
                        React.createElement('div', { key: i, style: {height:13,background:C.surface2,borderRadius:4,width:`${w}%`,animation:"pulse 1.4s infinite",animationDelay:`${i*0.1}s`},})
                      ))
                      , React.createElement('div', { style: {color:C.subtle,fontSize:12,marginTop:4,textAlign:"center"},}, "Writing your message..."  )
                    )
                  ):(
                    React.createElement('div', { style: {fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap",color:"#DDD8CC"},}, output)
                  )
                )

                , !loading&&output&&(
                  React.createElement(React.Fragment, null
                    /* Action buttons */
                    , React.createElement('div', { style: {display:"flex",gap:8,marginBottom:12},}
                      , React.createElement('button', { onClick: copy, style: {flex:1,background:copied?C.green:C.amber,border:"none",borderRadius:10,padding:"13px",cursor:"pointer",color:"#000",fontSize:13,fontWeight:800,transition:"all 0.15s"},}
                        , copied?"✓ Copied!":"📋 Copy Message"
                      )
                      , React.createElement('button', { onClick: ()=>generate(), style: {flex:1,background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"13px",cursor:"pointer",color:C.muted,fontSize:13,fontWeight:600},}, "🔄 Try Again"

                      )
                    )

                    /* ── Send via buttons ──────────────────────────────── */
                    , !FIXED_CHANNEL[toolId]&&(channel==="sms"||channel==="email")&&(
                      React.createElement('div', { style: {display:"flex",gap:8,marginBottom:12},}
                        , channel==="sms"&&React.createElement('button', { onClick:()=>{window.location.href="sms:?&body="+encodeURIComponent(output);}, style:{flex:1,background:"#1A2A1A",border:"0.5px solid #2A3A2A",borderRadius:10,padding:"12px",cursor:"pointer",color:"#8BC34A",fontSize:12,fontWeight:700},}, "📱 Send via SMS")
                        , channel==="sms"&&React.createElement('button', { onClick:()=>{window.open("https://wa.me/?text="+encodeURIComponent(output),"_blank");}, style:{flex:1,background:"#1A2A1A",border:"0.5px solid #2A3A2A",borderRadius:10,padding:"12px",cursor:"pointer",color:"#25D366",fontSize:12,fontWeight:700},}, "💬 Send via WhatsApp")
                        , channel==="email"&&React.createElement('button', { onClick:()=>{window.location.href="mailto:?body="+encodeURIComponent(output);}, style:{flex:1,background:"#1A2333",border:"0.5px solid #2A3343",borderRadius:10,padding:"12px",cursor:"pointer",color:"#64B5F6",fontSize:12,fontWeight:700},}, "📧 Send via Email")
                      )
                    )

                    /* ── Saved confirmation ──────────────────────────────── */
                    , React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:12},}
                      , React.createElement('span', { style: {fontSize:12,color:C.green},}, "✓")
                      , React.createElement('span', { style: {fontSize:11,color:C.subtle},}, "Saved to your history · Fields remembered for next time"         )
                    )

                    /* 5-message sequence explainer */
                    , isSeq&&toolId==="quote_followup"&&(
                      React.createElement('div', { style: {...card(),padding:"12px 14px",marginBottom:12,border:`0.5px solid ${C.border2}`},}
                        , React.createElement('div', { style: {fontSize:11,color:C.amber,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:8},}, "How this sequence works"   )
                        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5},}
                          , [
                            ["Day 1","Confirm they got the quote. No pressure."],
                            ["Day 2","Be helpful — address objections before they surface."],
                            ["Day 3","Soft urgency — your diary is filling up."],
                            ["Day 5","Force a gentle decision — give them an easy out."],
                            ["Day 14","Clean exit — never burns the relationship."],
                          ].map(([day,desc])=>(
                            React.createElement('div', { key: day, style: {display:"flex",gap:10,alignItems:"flex-start"},}
                              , React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.amber,minWidth:44,paddingTop:1},}, day)
                              , React.createElement('div', { style: {fontSize:12,color:C.subtle,lineHeight:1.4},}, desc)
                            )
                          ))
                        )
                        , React.createElement('div', { style: {marginTop:10,fontSize:11,color:C.subtle,borderTop:`0.5px solid ${C.border}`,paddingTop:8},}, "Based on how top trade businesses actually convert quotes — not theory."           )
                      )
                    )

                    /* Tone quick-switch */
                    , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:14},}
                      , TONES.map(t=>(
                        React.createElement('button', { key: t.id, onClick: ()=>{setTone(t.id);generate();},
                          style: {...btn(tone===t.id),flex:1,padding:"6px 4px",fontSize:11},}
                          , t.icon, " " , t.label
                        )
                      ))
                    )

                    /* Affiliate — only show when link is live */
                    , affiliate&&affiliate.link!=="#"&&(
                      React.createElement('div', { style: {background:"#0D1A10",border:`0.5px solid #152015`,borderRadius:12,padding:"12px 14px",marginBottom:12},}
                        , React.createElement('div', { style: {fontSize:10,color:C.green,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5},}, "💡 Next step"  )
                        , React.createElement('div', { style: {fontSize:13,color:"#C8E6C9",fontWeight:600,marginBottom:3},}, affiliate.cta)
                        , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginBottom:8},}, affiliate.desc)
                        , React.createElement('a', { href: affiliate.link, style: {display:"inline-block",background:C.green,color:"#000",fontSize:11,fontWeight:700,padding:"6px 12px",borderRadius:7,textDecoration:"none"},}, "Try "
                           , affiliate.name, " Free →"
                        )
                      )
                    )

                    /* Upgrade nudge */
                    , React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {...card(),padding:"10px 14px",textAlign:"center",cursor:"pointer"},}
                      , React.createElement('div', { style: {fontSize:12,color:C.subtle},}, "Unlimited messages · No footer · Full sequences"       )
                      , React.createElement('div', { style: {fontSize:12,color:C.amber,fontWeight:700,marginTop:2},}, "☕ One coffee a month — see plans"       )
                    )
                  )
                )
              )
            )
          )
        ):null

      )

      /* ── JOB ADD/EDIT MODAL ────────────────────────────────────────────── */
      , showJobModal&&(
        React.createElement('div', { style: {position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 16px 20px"}, onClick: ()=>{setShowJobModal(false);setEditingJob(null);},}
          , React.createElement('div', { style: {...card(),padding:22,maxWidth:440,width:"100%",border:`0.5px solid ${C.border2}`}, onClick: e=>e.stopPropagation(),}
            , React.createElement('div', { style: {fontSize:18,fontWeight:900,marginBottom:4},}, editingJob?"Edit Job":"Add Job")
            , React.createElement('div', { style: {color:C.muted,fontSize:13,marginBottom:16},}, friendlyDate(jobDraft.date))

            , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12,marginBottom:16},}
              , React.createElement('div', null
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Customer name" )
                , React.createElement('input', { value: jobDraft.customer, onChange: e=>setJobDraft({...jobDraft,customer:e.target.value}), placeholder: getTradePh(trade,"customer_name","e.g. Sarah"),
                  style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"11px 13px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
                  onFocus: e=>{e.target.style.borderColor=C.amber;}, onBlur: e=>{e.target.style.borderColor=C.border2;},})
              )
              , React.createElement('div', null
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Job type" )
                , React.createElement('input', { value: jobDraft.jobType, onChange: e=>setJobDraft({...jobDraft,jobType:e.target.value}), placeholder: getTradePh(trade,"job_type","e.g. deep clean, AC service"),
                  style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"11px 13px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
                  onFocus: e=>{e.target.style.borderColor=C.amber;}, onBlur: e=>{e.target.style.borderColor=C.border2;},})
              )
              , React.createElement('div', null
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Time")
                , React.createElement('div', { style: {display:"flex",gap:6},}
                  , [["morning","🌅 Morning"],["afternoon","☀️ Afternoon"],["evening","🌙 Evening"]].map(([id,label])=>(
                    React.createElement('button', { key: id, onClick: ()=>setJobDraft({...jobDraft,time:id}),
                      style: {...btn(jobDraft.time===id),flex:1,padding:"8px 4px",fontSize:11,fontWeight:600},}
                      , label
                    )
                  ))
                )
              )
              , React.createElement('div', null
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Amount (optional)" )
                , React.createElement('input', { value: jobDraft.amount, onChange: e=>setJobDraft({...jobDraft,amount:e.target.value}), placeholder: "e.g. $350" ,
                  style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"11px 13px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
                  onFocus: e=>{e.target.style.borderColor=C.amber;}, onBlur: e=>{e.target.style.borderColor=C.border2;},})
              )
              , React.createElement('div', null
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"},}, "Status")
                , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"},}
                  , JOB_STATUSES.map(s=>(
                    React.createElement('button', { key: s.id, onClick: ()=>setJobDraft({...jobDraft,status:s.id}),
                      style: {...btn(jobDraft.status===s.id),flex:1,padding:"8px 4px",fontSize:11,fontWeight:600,minWidth:70,color:jobDraft.status===s.id?s.color:C.muted,background:jobDraft.status===s.id?s.color+"15":C.surface2,borderColor:jobDraft.status===s.id?s.color+"60":C.border2},}
                      , s.emoji, " " , s.label
                    )
                  ))
                )
              )
            )

            , React.createElement('div', { style: {display:"flex",gap:8},}
              , React.createElement('button', { onClick: saveJob, disabled: !jobDraft.customer.trim(),
                style: {flex:2,background:jobDraft.customer.trim()?C.amber:"#333",border:"none",borderRadius:10,padding:"12px",color:jobDraft.customer.trim()?"#000":"#555",fontWeight:900,fontSize:14,cursor:jobDraft.customer.trim()?"pointer":"not-allowed"},}
                , editingJob?"Update Job":"Add Job"
              )
              , editingJob&&(
                React.createElement('button', { onClick: ()=>{if(confirm("Delete this job?"))deleteJob(editingJob.id);},
                  style: {padding:"12px 14px",background:C.redDim,border:`0.5px solid ${C.red}30`,borderRadius:10,color:C.red,fontWeight:700,fontSize:13,cursor:"pointer"},}, "🗑️"

                )
              )
              , React.createElement('button', { onClick: ()=>{setShowJobModal(false);setEditingJob(null);},
                style: {flex:1,background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"12px",color:C.muted,fontWeight:600,fontSize:13,cursor:"pointer"},}, "Cancel"

              )
            )
          )
        )
      )

      /* ── UPGRADE MODAL ──────────────────────────────────────────────────────── */
      , showUpgrade&&(
        React.createElement('div', { style: {position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 16px 20px"}, onClick: ()=>setShowUpgrade(false),}
          , React.createElement('div', { style: {...card(),padding:22,maxWidth:440,width:"100%",border:`0.5px solid ${C.border2}`}, onClick: e=>e.stopPropagation(),}

            , React.createElement('div', { style: {textAlign:"center",marginBottom:18},}
              , React.createElement('div', { style: {fontSize:26,marginBottom:6},}, "☕")
              , React.createElement('div', { style: {fontSize:19,fontWeight:900,letterSpacing:"-0.3px"},}, "Honestly, it's less than a coffee"     )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:6},}, "Unlimited messages. No footer. Full sequences. Daily briefings."       )
            )

            /* Free */
            , React.createElement('div', { style: {...card(),padding:"12px 14px",marginBottom:8,background:C.surface2},}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center"},}
                , React.createElement('div', null
                  , React.createElement('div', { style: {fontSize:14,fontWeight:700},}, "🤝 Always on us"   )
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:2},}, "10 messages/month · Basic tools · Footer on outputs"        )
                )
                , React.createElement('div', { style: {fontSize:16,fontWeight:900,color:C.muted},}, "Free")
              )
            )

            /* Pro */
            , React.createElement('div', { style: {...card(),padding:14,marginBottom:8,border:`1.5px solid ${C.amber}`,position:"relative",background:C.amberDim},}
              , React.createElement('div', { style: {position:"absolute",top:-10,right:12,background:C.amber,color:"#000",fontSize:10,fontWeight:900,padding:"2px 10px",borderRadius:10},}, "MOST POPULAR" )
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"},}
                , React.createElement('div', null
                  , React.createElement('div', { style: {fontSize:14,fontWeight:900,color:C.amber},}, "☕ Buy me a coffee a month"      )
                  , React.createElement('div', { style: {fontSize:11,color:"#888",marginTop:3},}, "Unlimited messages · Full sequences · No footer · All 5 modules · SMS + email + Facebook versions · Community templates"                     )
                )
                , React.createElement('div', { style: {textAlign:"right",minWidth:48},}
                  , React.createElement('div', { style: {fontSize:20,fontWeight:900,color:C.amber},}, "$5.99")
                  , React.createElement('div', { style: {fontSize:10,color:C.subtle},}, "/month")
                )
              )
              , React.createElement('button', { onClick:()=>window.open("https://ontoolsai.lemonsqueezy.com/checkout/buy/484e3e85-688b-4dba-9e7d-30356cf18767","_blank"), style: {marginTop:12,width:"100%",background:C.amber,border:"none",borderRadius:10,padding:"12px",color:"#000",fontWeight:900,fontSize:14,cursor:"pointer"},}, "Start for $5.99/month →"

              )
            )

            /* Business */
            , React.createElement('div', { style: {...card(),padding:"12px 14px",marginBottom:14,background:C.surface2},}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"},}
                , React.createElement('div', null
                  , React.createElement('div', { style: {fontSize:14,fontWeight:700},}, "🍳 Buy me breakfast a month"     )
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:2},}, "Everything in Pro + Your Brand Voice · Daily AI briefing · Health score · Saved history · 3 team members · Priority support"                       )
                )
                , React.createElement('div', { style: {textAlign:"right",minWidth:48},}
                  , React.createElement('div', { style: {fontSize:18,fontWeight:900},}, "$17.99")
                  , React.createElement('div', { style: {fontSize:10,color:C.subtle},}, "/month")
                )
              )
              , React.createElement('button', { onClick:()=>window.open("https://ontoolsai.lemonsqueezy.com/checkout/buy/ffd389d2-a278-4005-9023-54acdd81fe99","_blank"), style: {marginTop:10,width:"100%",background:C.surface3,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"10px",color:"#AAA",fontWeight:700,fontSize:13,cursor:"pointer"},}, "Start for $17.99/month →"

              )
            )

            , React.createElement('div', { style: {textAlign:"center",fontSize:11,color:C.subtle,marginBottom:10},}, "Cancel anytime · No contracts · Your messages are always yours"          )
            , React.createElement('button', { onClick: ()=>setShowUpgrade(false), style: {display:"block",margin:"0 auto",background:"none",border:"none",color:C.subtle,fontSize:12,cursor:"pointer"},}, "Maybe later" )
          )
        )
      )

      /* ── BRAND VOICE MODAL ─────────────────────────────────────────────────── */
      , showBV&&(
        React.createElement('div', { style: {position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 16px 20px"}, onClick: ()=>setShowBV(false),}
          , React.createElement('div', { style: {...card(),padding:22,maxWidth:440,width:"100%",border:`0.5px solid ${C.border2}`}, onClick: e=>e.stopPropagation(),}
            , React.createElement('div', { style: {marginBottom:16},}
              , React.createElement('div', { style: {fontSize:18,fontWeight:900},}, "🎨 Your Brand Voice"   )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:4},}, "Set once. Every message sounds like you — not generic AI. Removes the footer too."              )
            )
            , [{label:"Business Name",key:"name",ph:"e.g. Sparkle Clean Services"},{label:"Your First Name",key:"ownerName",ph:"e.g. Mike"}].map(f=>(
              React.createElement('div', { key: f.key, style: {marginBottom:12},}
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#888",marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px"},}, f.label)
                , React.createElement('input', { value: bvDraft[f.key]||"", onChange: e=>setBvDraft({...bvDraft,[f.key]:e.target.value}), placeholder: f.ph,
                  style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:9,padding:"10px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
                  onFocus: e=>{e.target.style.borderColor=C.amber;}, onBlur: e=>{e.target.style.borderColor=C.border2;},})
              )
            ))
            , React.createElement('div', { style: {marginBottom:12},}
              , React.createElement('label', { style: {display:"block",fontSize:11,color:"#888",marginBottom:7,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px"},}, "Your Style" )
              , React.createElement('div', { style: {display:"flex",gap:6},}
                , [["friendly","😊 Friendly"],["professional","💼 Professional"],["blunt","💪 Straight-talking"]].map(([id,label])=>(
                  React.createElement('button', { key: id, onClick: ()=>setBvDraft({...bvDraft,style:id}),
                    style: {...btn(bvDraft.style===id),flex:1,padding:"8px 4px",fontSize:11,fontWeight:600},}
                    , label
                  )
                ))
              )
            )
            , React.createElement('div', { onClick: ()=>setBvDraft({...bvDraft,humour:!bvDraft.humour}),
              style: {...card(),padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,border:`0.5px solid ${bvDraft.humour?C.amberBorder:C.border}`},}
              , React.createElement('div', { style: {fontSize:13,color:bvDraft.humour?C.amber:"#AAA",fontWeight:600},}, "😄 A bit of humour in my messages"       )
              , React.createElement('div', { style: {width:34,height:18,background:bvDraft.humour?C.amber:C.surface3,borderRadius:9,position:"relative"},}
                , React.createElement('div', { style: {width:12,height:12,background:"#FFF",borderRadius:6,position:"absolute",top:3,left:bvDraft.humour?18:3,transition:"left 0.2s"},})
              )
            )
            , React.createElement('div', { style: {padding:"10px 12px",background:C.surface2,borderRadius:10,marginBottom:14,fontSize:12,color:C.subtle,lineHeight:1.5},}, "☕ "
               , React.createElement('strong', { style: {color:"#888"},}, "Your Brand Voice is a paid feature — $17.99/mo."        ), " That's less than a breakfast. Save your settings now, they'll kick in the moment you upgrade."
            )
            , React.createElement('div', { style: {display:"flex",gap:8},}
              , React.createElement('button', { onClick: saveBV, style: {flex:2,background:C.amber,border:"none",borderRadius:10,padding:"12px",color:"#000",fontWeight:900,fontSize:14,cursor:"pointer"},}, "Save Your Brand Voice"   )
              , React.createElement('button', { onClick: ()=>setShowBV(false), style: {flex:1,background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"12px",color:C.muted,fontWeight:600,fontSize:13,cursor:"pointer"},}, "Cancel")
            )
          )
        )
      )

      , React.createElement('style', null, `
        @keyframes pulse{0%,100%{opacity:0.3;}50%{opacity:0.7;}}
        *{box-sizing:border-box;margin:0;}
        input::placeholder{color:#2E2E2E;}
        button:active{transform:scale(0.98);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px;}
      `)
    )
  );
}


const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(OnToolsAI));
document.getElementById("loader")?.remove();
