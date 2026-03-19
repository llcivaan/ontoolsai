function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { useState, useEffect } = React;

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
];
const TONES=[{id:"friendly",label:"Friendly",icon:"😊"},{id:"professional",label:"Professional",icon:"💼"},{id:"firm",label:"Firm",icon:"💪"}];
const CHANNELS=[{id:"sms",label:"SMS",icon:"📱"},{id:"email",label:"Email",icon:"📧"},{id:"facebook",label:"Facebook",icon:"💬"}];

const MODULES=[
  {id:"communication",icon:"💬",label:"Customer Messages",desc:"Quotes, complaints, delays & more",tools:[
    {id:"quote_followup",tier:"free",seq:true,label:"Quote Follow-Up",desc:"Chase an unanswered quote",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Sarah"},{id:"job_type",label:"Job Type",ph:"e.g. deep clean, roof repair, AC service"},{id:"days_since",label:"Days Since Quote",ph:"e.g. 3"},{id:"your_name",label:"Your Name / Business",ph:"e.g. Mike, Sparkle Clean"}]},
    {id:"running_late",tier:"free",seq:false,label:"Running Late",desc:"Notify a customer you're delayed",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. John"},{id:"delay_time",label:"How Late?",ph:"e.g. 20–30 minutes"},{id:"your_name",label:"Your Name",ph:"e.g. Dave, Dave's Plumbing"}]},
    {id:"complaint_response",tier:"free",seq:false,label:"Complaint Response",desc:"Handle an unhappy customer",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Mrs. Thompson"},{id:"complaint",label:"Their Complaint",ph:"e.g. job took too long, left a mess"},{id:"resolution",label:"What You'll Offer",ph:"e.g. free follow-up, 10% discount"}]},
    {id:"price_increase",tier:"pro",seq:false,label:"Price Increase Letter",desc:"Announce a rate rise without losing clients",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Green Valley Landscaping"},{id:"old_price",label:"Current Price",ph:"e.g. $120 per visit"},{id:"new_price",label:"New Price",ph:"e.g. $140 per visit"},{id:"effective_date",label:"Effective Date",ph:"e.g. April 1st"}]},
    {id:"no_show_followup",tier:"free",seq:false,label:"No-Show Follow-Up",desc:"Re-engage a customer who missed their slot",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Mike"},{id:"original_date",label:"Missed Appointment",ph:"e.g. Tuesday 10am"},{id:"your_name",label:"Your Name",ph:"e.g. Jake, ProClean"}]},
    {id:"cancellation_policy",tier:"pro",seq:false,label:"Cancellation Policy",desc:"Set fair expectations after cancellations",fields:[{id:"business_name",label:"Business Name",ph:"e.g. Arctic HVAC"},{id:"policy_details",label:"Your Policy",ph:"e.g. 24-hr notice required, $50 late fee"},{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"}]},
  ]},
  {id:"reviews",icon:"⭐",label:"Review Management",desc:"Get more reviews, respond like a pro",tools:[
    {id:"review_request",tier:"free",seq:true,label:"Review Request",desc:"Ask for a Google review post-job",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Linda"},{id:"job_type",label:"Job Completed",ph:"e.g. boiler service, lawn care"},{id:"your_name",label:"Your Name",ph:"e.g. James"}]},
    {id:"positive_review",tier:"free",seq:false,label:"Respond to 5-Star Review",desc:"Thank a happy customer & boost SEO",fields:[{id:"customer_name",label:"Reviewer Name",ph:"e.g. Bob"},{id:"what_they_said",label:"What Did They Mention?",ph:"e.g. praised punctuality, clean finish"},{id:"business_name",label:"Your Business",ph:"e.g. Elite HVAC"}]},
    {id:"negative_review",tier:"free",seq:false,label:"Respond to Bad Review",desc:"Defuse a 1–3 star without escalating",fields:[{id:"customer_name",label:"Reviewer Name",ph:"e.g. John D."},{id:"their_complaint",label:"What Did They Say?",ph:"e.g. tech was rude, left a mess"},{id:"your_side",label:"Your Resolution",ph:"e.g. offered refund, addressed with team"}]},
    {id:"neutral_review",tier:"pro",seq:false,label:"Respond to Neutral Review",desc:"Turn a 3-star 'it was fine' into loyalty",fields:[{id:"customer_name",label:"Reviewer Name",ph:"e.g. Amanda"},{id:"review_content",label:"What Did They Say?",ph:"e.g. service was okay, arrived on time"},{id:"business_name",label:"Your Business",ph:"e.g. ProClean Services"}]},
  ]},
  {id:"payments",icon:"💰",label:"Payment Follow-Ups",desc:"Chase invoices without damaging relationships",tools:[
    {id:"invoice_reminder_1",tier:"free",seq:true,label:"First Reminder",desc:"Polite nudge — assumes it's an oversight",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"},{id:"amount",label:"Invoice Amount",ph:"e.g. $350"},{id:"days_overdue",label:"Days Overdue",ph:"e.g. 7"},{id:"your_name",label:"Your Name",ph:"e.g. Sam, ProClean"}]},
    {id:"invoice_reminder_2",tier:"free",seq:false,label:"Second Reminder",desc:"Firmer — urgency without aggression",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"},{id:"amount",label:"Invoice Amount",ph:"e.g. $350"},{id:"days_overdue",label:"Days Overdue",ph:"e.g. 21"}]},
    {id:"invoice_final",tier:"pro",seq:false,label:"Final Notice",desc:"Professional final demand before escalation",fields:[{id:"customer_name",label:"Customer Name",ph:"e.g. Tom"},{id:"amount",label:"Amount Owed",ph:"e.g. $350"},{id:"days_overdue",label:"Days Overdue",ph:"e.g. 45"},{id:"your_name",label:"Your Business",ph:"e.g. Dave's Plumbing"}]},
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

// ─── SMART BRIEFING GENERATOR (Option C) ──────────────────────────────────────
function getSmartBriefing(trade, isPro) {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDay();
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
  const isMonday = day === 1;
  const isFriday = day === 5;
  const isWeekend = day === 0 || day === 6;
  const season = month >= 2 && month <= 4 ? "spring" : month >= 5 && month <= 7 ? "summer" : month >= 8 && month <= 10 ? "autumn" : "winter";

  const items = {
    cleaning: [
      isMonday && {icon:"📋",urgent:true,text:`It's ${dayName} — clients often book cleans at the start of the week. Send a 'slots available this week' post to your Facebook page.`,action:"Write post",tool:"weekly_posts"},
      season==="spring" && {icon:"🌸",urgent:false,text:"Spring is peak season for deep cleans. A seasonal promotion right now could fill your next 2 weeks.",action:"Write promo",tool:"seasonal_promo"},
      {icon:"⭐",urgent:false,text:"Every job you completed last week is a missed review opportunity. Reach out now while the experience is fresh.",action:"Request review",tool:"review_request"},
      isFriday && {icon:"💰",urgent:true,text:"End of week — chase any open invoices before the weekend so you're not waiting until Monday.",action:"Send reminder",tool:"invoice_reminder_1"},
      {icon:"📱",urgent:false,text:"Your Google Business Profile bio could be working harder. A fresh description boosts local search ranking.",action:"Write bio",tool:"google_bio"},
    ],
    hvac: [
      season==="summer" && {icon:"🔥",urgent:true,text:"Peak AC season — you're likely fully booked, but a waitlist message keeps future customers warm.",action:"Write message",tool:"quote_followup"},
      season==="winter" && {icon:"❄️",urgent:true,text:"Heating season is here. A boiler service promotion right now will fill your diary fast.",action:"Write promo",tool:"seasonal_promo"},
      season==="spring" && {icon:"✅",urgent:false,text:"Pre-summer AC tune-ups are a goldmine. Now is the time to reach out to last year's customers.",action:"Write reactivation",tool:"reactivation"},
      isMonday && {icon:"📋",urgent:false,text:`${dayName} is perfect for chasing any quotes that went quiet last week.`,action:"Follow up quotes",tool:"quote_followup"},
      {icon:"⭐",urgent:false,text:"HVAC reviews are high-value — homeowners research heavily before booking. Ask every completed job.",action:"Request review",tool:"review_request"},
    ],
    plumbing: [
      {icon:"💰",urgent:true,text:"Plumbers are among the most under-paid on invoices. If you have anything over 7 days outstanding, chase it today.",action:"Send reminder",tool:"invoice_reminder_1"},
      isMonday && {icon:"📋",urgent:false,text:"Start the week right — follow up on any quotes you sent last week that haven't converted.",action:"Follow up quotes",tool:"quote_followup"},
      {icon:"⭐",urgent:false,text:"82% of people read reviews before hiring a plumber. A consistent review strategy is your best marketing.",action:"Request review",tool:"review_request"},
      season==="winter" && {icon:"🌡️",urgent:true,text:"Frozen pipe season — a social post warning homeowners positions you as the local expert and drives calls.",action:"Write post",tool:"weekly_posts"},
      {icon:"👥",urgent:false,text:"Plumbing labour shortages are real. If you need anyone, a well-written job ad gets you better candidates.",action:"Write job ad",tool:"job_ad"},
    ],
    landscaping: [
      season==="spring" && {icon:"🌱",urgent:true,text:"Spring is your busiest season. If your diary isn't full yet, a promotional post today will fill it by Friday.",action:"Write promo",tool:"seasonal_promo"},
      season==="autumn" && {icon:"🍂",urgent:false,text:"End-of-season leaf clearance packages are an easy upsell right now. Reach out to existing clients.",action:"Write reactivation",tool:"reactivation"},
      season==="winter" && {icon:"❄️",urgent:true,text:"Quiet season — reactivate past customers with a winter/early spring booking offer before your diary fills.",action:"Write reactivation",tool:"reactivation"},
      isFriday && {icon:"💰",urgent:true,text:"Collect before the weekend — chase any outstanding invoices now.",action:"Send reminder",tool:"invoice_reminder_1"},
      {icon:"⭐",urgent:false,text:"Landscaping is a high-trust purchase. One bad review can cost you 10 jobs. Actively build your rating.",action:"Request review",tool:"review_request"},
    ],
    roofing: [
      {icon:"💰",urgent:true,text:"Roofing jobs are high-value — even one late invoice is a serious cash flow problem. Chase anything overdue today.",action:"Send reminder",tool:"invoice_reminder_1"},
      {icon:"📋",urgent:false,text:"Roofing quotes often go cold while clients 'think about it'. A well-timed follow-up converts more than you'd expect.",action:"Follow up quotes",tool:"quote_followup"},
      season==="autumn" && {icon:"🏠",urgent:true,text:"Pre-winter roof checks are a compelling pitch right now. A promotional post could generate leads this week.",action:"Write promo",tool:"seasonal_promo"},
      {icon:"⭐",urgent:false,text:"Roofing is a high-anxiety purchase for homeowners. 5-star reviews reduce that anxiety and win you jobs.",action:"Request review",tool:"review_request"},
      {icon:"👥",urgent:false,text:"Roofers are in short supply. A strong job ad right now could secure your team for the busy season.",action:"Write job ad",tool:"job_ad"},
    ],
    electrical: [
      {icon:"💰",urgent:true,text:"Electrical jobs often involve parts and materials upfront. Chase any late invoices to protect your cash flow.",action:"Send reminder",tool:"invoice_reminder_1"},
      isMonday && {icon:"📋",urgent:false,text:"Follow up on any quotes from last week — electrical work decisions often happen at the start of the week.",action:"Follow up quotes",tool:"quote_followup"},
      {icon:"⭐",urgent:false,text:"Electricians live and die by reputation. Every completed job is a chance to build yours.",action:"Request review",tool:"review_request"},
      {icon:"📱",urgent:false,text:"Most people search 'electrician near me' on Google. Your Business Profile bio is the first thing they read.",action:"Write bio",tool:"google_bio"},
      season==="summer" && {icon:"🔌",urgent:false,text:"Summer is peak time for EV charger installs and garden lighting. A promo post now captures that demand.",action:"Write promo",tool:"seasonal_promo"},
    ],
  };

  return (items[trade] || items.cleaning)
    .filter(Boolean)
    .slice(0, isPro ? 5 : 3);
}

// ─── PROMPT BUILDER ────────────────────────────────────────────────────────────
function buildPrompt(trade, toolId, fields, tone, channel, isSeq, bv) {
  const tl = _optionalChain([TRADES, 'access', _ => _.find, 'call', _2 => _2(t=>t.id===trade), 'optionalAccess', _3 => _3.label]) || trade;
  const tn = _optionalChain([TONES, 'access', _4 => _4.find, 'call', _5 => _5(t=>t.id===tone), 'optionalAccess', _6 => _6.label]) || "professional";
  const ch = _optionalChain([CHANNELS, 'access', _7 => _7.find, 'call', _8 => _8(c=>c.id===channel), 'optionalAccess', _9 => _9.label]) || "SMS";
  const chRule = channel==="sms"?"Keep under 70 words. No formal greeting. Conversational SMS style.":channel==="email"?"Include a subject line. Greeting, body, sign-off. Up to 150 words.":"Conversational Facebook message. Up to 100 words. 1–2 emojis natural.";
  const tnRule = tone==="friendly"?"Warm and personal, like a trusted friend.":tone==="firm"?"Polite but direct and clear. No filler.":"Professional and polished.";
  const bvBlock = _optionalChain([bv, 'optionalAccess', _10 => _10.name])?`\nBusiness name: ${bv.name}\nOwner name: ${bv.ownerName}\nStyle: ${bv.style}\nHumour: ${bv.humour?"light humour welcome":"no humour"}`:""
  const fv = Object.entries(fields).map(([k,v])=>`${k}: ${v}`).join("\n");

  if(isSeq){
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
    positive_review:`Write a warm ${tn} response to a 5-star Google review for a ${tl} business. Thank by name, mention specific praise, subtle SEO.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    negative_review:`Write a de-escalating ${tn} response to a negative Google review for a ${tl} business. Never defensive. Invite offline resolution.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
    neutral_review:`Write a ${tn} response to a neutral Google review for a ${tl} business. Turn mild satisfaction into loyalty.\n${chRule}\n${tnRule}${bvBlock}\n\n${fv}`,
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

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
function OnToolsAI(){
  const [step,setStep]=useState("trade");
  const [trade,setTrade]=useState(null);
  const [module,setModule]=useState(null);
  const [toolId,setToolId]=useState(null);
  const [fields,setFields]=useState({});
  const [tone,setTone]=useState("friendly");
  const [channel,setChannel]=useState("sms");
  const [isSeq,setIsSeq]=useState(false);
  const [output,setOutput]=useState("");
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const [usage,setUsage]=useState(0);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const [showBV,setShowBV]=useState(false);
  const [bv,setBv]=useState(null);
  const [bvDraft,setBvDraft]=useState({name:"",ownerName:"",style:"friendly",humour:false});
  const [tab,setTab]=useState("write");
  const [demoRunning,setDemoRunning]=useState(false);
  const [demoOutput,setDemoOutput]=useState("");
  const [demoUsed,setDemoUsed]=useState(false);
  const [feedbackIdea,setFeedbackIdea]=useState("");
  const [feedbackTags,setFeedbackTags]=useState([]);
  const [feedbackSent,setFeedbackSent]=useState(false);
  const [feedbackLoading,setFeedbackLoading]=useState(false);
  const [feedbackReply,setFeedbackReply]=useState("");

  useEffect(()=>{
    setUsage(parseInt(localStorage.getItem("ontoolsai_usage")||"0"));
    const saved=localStorage.getItem("ontoolsai_bv");
    if(saved){const p=JSON.parse(saved);setBv(p);setBvDraft(p);}
    setDemoUsed(!!localStorage.getItem("ontoolsai_demo"));
  },[]);

  const tradeObj=TRADES.find(t=>t.id===trade);
  const moduleObj=MODULES.find(m=>m.id===module);
  const toolObj=_optionalChain([moduleObj, 'optionalAccess', _11 => _11.tools, 'access', _12 => _12.find, 'call', _13 => _13(t=>t.id===toolId)]);
  const affiliate=AFFILIATES[toolId];
  const usageLeft=FREE_LIMIT-usage;
  const isPro=false; // wire to auth in production
  const briefing=trade?getSmartBriefing(trade,isPro):[];

  const generate=async(overrideSeq)=>{
    const seq=overrideSeq!==undefined?overrideSeq:isSeq;
    if(usage>=FREE_LIMIT){setShowUpgrade(true);return;}
    const filled=_optionalChain([toolObj, 'optionalAccess', _14 => _14.fields, 'access', _15 => _15.every, 'call', _16 => _16(f=>_optionalChain([fields, 'access', _17 => _17[f.id], 'optionalAccess', _18 => _18.trim, 'call', _19 => _19()]))]);
    if(!filled)return;
    setLoading(true);setOutput("");setStep("output");
    try{
      const prompt=buildPrompt(trade,toolId,fields,tone,channel,seq,bv);
      const res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      let text=_optionalChain([data, 'access', _20 => _20.content, 'optionalAccess', _21 => _21[0], 'optionalAccess', _22 => _22.text])||"Something went wrong. Please try again.";
      if(!bv||!isPro)text+="\n\n— Sorted with OnToolsAI (ontoolsai.com)";
      setOutput(text);
      const n=usage+1;setUsage(n);localStorage.setItem("ontoolsai_usage",n.toString());
    }catch (e2){setOutput("Connection error. Please check your internet and try again.");}
    setLoading(false);
  };

  const runDemo=async()=>{
    if(demoRunning)return;
    setDemoRunning(true);setDemoOutput("");
    const tradeLabel=_optionalChain([tradeObj, 'optionalAccess', _23 => _23.label])||"trade";
    const now=new Date();
    const month=now.getMonth();
    const season=month>=2&&month<=4?"spring":month>=5&&month<=7?"summer":month>=8&&month<=10?"autumn":"winter";
    const day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
    const prompt=`You are OnToolsAI's smart daily briefing engine. Generate a realistic morning briefing for a ${tradeLabel} business owner. It's ${day} in ${season}. Give exactly 4 specific, actionable items they should address today — based on what typically happens in a ${tradeLabel} business at this time of year and week. Make each item specific, practical and urgent-feeling. Format as a numbered list. Each item should be 1–2 sentences. Tone: like a knowledgeable business partner giving friendly morning advice, not a robot. End with one line of genuine encouragement.`;
    try{
      const res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      setDemoOutput(_optionalChain([data, 'access', _24 => _24.content, 'optionalAccess', _25 => _25[0], 'optionalAccess', _26 => _26.text])||"");
      localStorage.setItem("ontoolsai_demo","1");setDemoUsed(true);
    }catch (e3){setDemoOutput("Couldn't load your demo briefing. Check your connection.");}
    setDemoRunning(false);
  };

  const copy=()=>{navigator.clipboard.writeText(output).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}).catch(()=>{});};
  const saveBV=()=>{setBv(bvDraft);localStorage.setItem("ontoolsai_bv",JSON.stringify(bvDraft));setShowBV(false);};
  const resetToFields=()=>{setStep("fields");setOutput("");setCopied(false);};
  const resetToModules=()=>{setStep("module");setToolId(null);setFields({});setOutput("");};
  const goHome=()=>{setStep("trade");setTrade(null);setModule(null);setToolId(null);setFields({});setOutput("");setTab("write");};

  return(
    React.createElement('div', { style: {minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",color:C.text}}

      /* HEADER */
      , React.createElement('header', { style: {padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`0.5px solid ${C.border}`,position:"sticky",top:0,zIndex:100,background:C.bg}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,cursor:"pointer"}, onClick: goHome}
          , React.createElement('div', { style: {width:32,height:32,background:C.amber,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}
            , _optionalChain([tradeObj, 'optionalAccess', _27 => _27.emoji])||"⚡"
          )
          , React.createElement('div', {}
            , React.createElement('div', { style: {fontSize:16,fontWeight:800,letterSpacing:"-0.3px"}}, "OnTools", React.createElement('span', { style: {color:C.amber}}, "AI"))
            , React.createElement('div', { style: {fontSize:10,color:C.subtle,letterSpacing:"0.8px",textTransform:"uppercase"}}, "You stay on the tools. We'll run the words."        )
          )
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}}
          , bv&&React.createElement('div', { onClick: ()=>setShowBV(true), style: {fontSize:11,color:C.amber,background:C.amberDim,padding:"3px 9px",borderRadius:12,cursor:"pointer",border:`0.5px solid ${C.amberBorder}`}}, "🎨 " , bv.name)
          , React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {fontSize:11,color:usageLeft<=2?C.red:C.muted,background:C.surface2,padding:"4px 10px",borderRadius:20,cursor:"pointer",border:`0.5px solid ${usageLeft<=2?C.red+"40":C.border}`}}
            , usageLeft, " free left"
          )
        )
      )

      /* TABS — only when trade selected */
      , trade&&step!=="output"&&(
        React.createElement('div', { style: {display:"flex",borderBottom:`0.5px solid ${C.border}`,background:C.bg}}
          , [{id:"write",label:"✍️ Write"},{id:"briefing",label:"☀️ Your Day"},{id:"top",label:"🏆 Top Messages"},{id:"wishlist",label:"💡 Build This"}].map(t=>(
            React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id), style: {flex:1,padding:"10px 4px",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${C.amber}`:"2px solid transparent",color:tab===t.id?C.amber:C.subtle,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s"}}
              , t.label
            )
          ))
        )
      )

      , React.createElement('main', { style: {maxWidth:500,margin:"0 auto",padding:"22px 18px 100px"}}

        /* ── YOUR DAY TAB ──────────────────────────────────────────────────────── */
        , trade&&tab==="briefing"&&step!=="output"&&(
          React.createElement('div', {}
            , React.createElement('div', { style: {marginBottom:20}}
              , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px"}}, "☀️ Your day, sorted"   )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:5}}, "Based on your trade, the season, and the day of the week — no setup needed"               )
            )

            /* Health Score */
            , React.createElement('div', { style: {...card(),padding:16,marginBottom:14}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:700}}, "🏥 Business health score"   )
                , React.createElement('div', { style: {fontSize:22,fontWeight:900,color:C.amber}}, "72", React.createElement('span', { style: {fontSize:12,color:C.subtle}}, "/100"))
              )
              , React.createElement('div', { style: {background:C.surface3,borderRadius:8,height:5,overflow:"hidden",marginBottom:10}}
                , React.createElement('div', { style: {width:"72%",height:"100%",background:C.amber,borderRadius:8}})
              )
              , React.createElement('div', { style: {display:"flex",gap:12,flexWrap:"wrap"}}
                , React.createElement('span', { style: {fontSize:11,color:C.green}}, "✅ Communication" )
                , React.createElement('span', { style: {fontSize:11,color:"#F97316"}}, "⚠️ Reviews (low this month)"    )
                , React.createElement('span', { style: {fontSize:11,color:C.red}}, "❌ Reactivation overdue"  )
              )
            )

            /* Briefing Items */
            , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8,marginBottom:16}}
              , briefing.map((item,i)=>(
                React.createElement('div', { key: i, style: {...card(),padding:"12px 14px",display:"flex",alignItems:"center",gap:12,border:`0.5px solid ${item.urgent?C.red+"25":C.border}`}}
                  , React.createElement('div', { style: {fontSize:18,minWidth:26}}, item.icon)
                  , React.createElement('div', { style: {flex:1}}
                    , React.createElement('div', { style: {fontSize:13,color:"#CCC",lineHeight:1.45}}, item.text)
                    , item.urgent&&React.createElement('div', { style: {fontSize:10,color:C.red,marginTop:3,fontWeight:700,letterSpacing:"0.5px"}}, "NEEDS ATTENTION" )
                  )
                  , React.createElement('button', { onClick: ()=>{
                    const mod=MODULES.find(m=>m.tools.find(t=>t.id===item.tool));
                    if(mod){setModule(mod.id);setToolId(item.tool);setStep("fields");setTab("write");}
                  }, style: {background:C.amber,border:"none",borderRadius:8,padding:"7px 11px",color:"#000",fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}
                    , item.action
                  )
                )
              ))
            )

            /* Monthly snapshot */
            , React.createElement('div', { style: {...card(),padding:16,marginBottom:14}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:700,marginBottom:12}}, "📊 This month at a glance"     )
              , React.createElement('div', { style: {display:"flex",gap:8}}
                , [["47","Messages"],["18","Reminders"],["14","Reviews"]].map(([n,l])=>(
                  React.createElement('div', { key: l, style: {flex:1,background:C.surface2,borderRadius:10,padding:"10px 8px",textAlign:"center"}}
                    , React.createElement('div', { style: {fontSize:20,fontWeight:900,color:C.amber}}, n)
                    , React.createElement('div', { style: {fontSize:10,color:C.subtle,marginTop:2}}, l)
                  )
                ))
              )
              , React.createElement('div', { style: {marginTop:12,padding:"10px 12px",background:C.amberDim,borderRadius:10,border:`0.5px solid ${C.amberBorder}`,fontSize:12,color:"#AAA",lineHeight:1.5}}, "💡 "
                 , React.createElement('strong', { style: {color:C.amber}}, "Tip:"), " Businesses that request reviews within 24hrs of a job get 3x more responses. You're averaging 48hrs."
              )
            )

            /* Demo / Upgrade for AI briefing */
            , !demoUsed&&!demoOutput?(
              React.createElement('div', { style: {...card(),padding:20,textAlign:"center",border:`0.5px solid ${C.amberBorder}`}}
                , React.createElement('div', { style: {fontSize:16,fontWeight:800,marginBottom:6}}, "🤖 Want a smarter briefing?"    )
                , React.createElement('div', { style: {fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.5}}, "OnToolsAI can generate a fully personalised morning briefing — powered by Claude AI, based on your trade, season, and what typically needs attention. Try one free demo below."                           )
                , React.createElement('button', { onClick: runDemo, style: {background:C.amber,border:"none",borderRadius:10,padding:"12px 24px",color:"#000",fontWeight:800,fontSize:14,cursor:"pointer"}}
                  , demoRunning?"⏳ Generating your briefing...":"✨ Show me my AI briefing (free demo)"
                )
              )
            ):demoOutput?(
              React.createElement('div', { style: {...card(),padding:18,border:`0.5px solid ${C.amberBorder}`}}
                , React.createElement('div', { style: {fontSize:12,color:C.amber,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}, "✨ Your AI-powered morning briefing"    )
                , React.createElement('div', { style: {fontSize:13,lineHeight:1.7,color:"#DDD",whiteSpace:"pre-wrap"}}, demoOutput)
                , React.createElement('div', { style: {marginTop:14,padding:"12px 14px",background:C.surface2,borderRadius:10,border:`0.5px solid ${C.border2}`}}
                  , React.createElement('div', { style: {fontSize:13,fontWeight:700,marginBottom:4}}, "Get this every morning, automatically"    )
                  , React.createElement('div', { style: {fontSize:12,color:C.muted,marginBottom:10}}, "Your AI briefing waits for you before your first job — no setup, no input, just open the app."                  )
                  , React.createElement('button', { onClick: ()=>setShowUpgrade(true), style: {background:C.amber,border:"none",borderRadius:8,padding:"10px 18px",color:"#000",fontWeight:800,fontSize:13,cursor:"pointer"}}, "🍳 Unlock with breakfast — $17.99/mo"

                  )
                )
              )
            ):(
              React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {...card(),padding:16,textAlign:"center",cursor:"pointer",border:`0.5px solid ${C.amberBorder}`}}
                , React.createElement('div', { style: {fontSize:14,fontWeight:700,marginBottom:4}}, "🍳 Daily AI briefing — breakfast plan"      )
                , React.createElement('div', { style: {fontSize:12,color:C.muted,marginBottom:10}}, "Fully personalised every morning. No setup. Just open the app."         )
                , React.createElement('div', { style: {color:C.amber,fontWeight:800,fontSize:13}}, "$17.99/month → unlock now"   )
              )
            )
          )
        )

        /* ── TOP MESSAGES TAB ──────────────────────────────────────────────────── */
        , trade&&tab==="top"&&step!=="output"&&(
          React.createElement('div', {}
            , React.createElement('div', { style: {marginBottom:20}}
              , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px"}}, "🏆 Messages that worked"   )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:5}}, "Real messages from real trade business owners — with real results"          )
            )
            , COMMUNITY.map((c,i)=>(
              React.createElement('div', { key: i, style: {...card(),padding:16,marginBottom:10}}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}
                  , React.createElement('div', {}
                    , React.createElement('span', { style: {fontSize:11,color:C.amber,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}, c.trade)
                    , React.createElement('span', { style: {fontSize:11,color:C.subtle,margin:"0 6px"}}, "·")
                    , React.createElement('span', { style: {fontSize:11,color:C.subtle}}, c.tool)
                  )
                  , React.createElement('div', { style: {fontSize:11,background:C.greenDim,color:C.green,padding:"2px 9px",borderRadius:10,fontWeight:700}}, c.stat)
                )
                , React.createElement('div', { style: {fontSize:13,color:"#AAA",lineHeight:1.6,fontStyle:"italic"}}, "\"", c.text, "\"")
                , React.createElement('button', { onClick: ()=>setShowUpgrade(true), style: {marginTop:10,background:"none",border:`0.5px solid ${C.amberBorder}`,borderRadius:8,padding:"6px 12px",color:C.amber,fontSize:12,cursor:"pointer",fontWeight:600}}, "Use this template →"

                )
              )
            ))
            , React.createElement('div', { style: {...card(),padding:16,textAlign:"center"}}
              , React.createElement('div', { style: {fontSize:13,color:C.subtle,marginBottom:6}}, "38 more templates in the library"     )
              , React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {fontSize:13,color:C.amber,fontWeight:700,cursor:"pointer"}}, "☕ Unlock all — one coffee a month"       )
            )
          )
        )

        /* ── WISHLIST / FEEDBACK TAB ───────────────────────────────────────────── */
        , trade&&tab==="wishlist"&&step!=="output"&&(
          React.createElement('div', {}
            , !feedbackSent?(
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {marginBottom:24}}
                  , React.createElement('div', { style: {fontSize:26,fontWeight:900,letterSpacing:"-0.5px",marginBottom:8}}, "You're the boss."
                      , React.createElement('br', {}), "What's missing? 🛠️"
                  )
                  , React.createElement('div', { style: {color:C.muted,fontSize:13,lineHeight:1.6}}, "This whole app got built because trade business owners needed it. Got a tool that'd save you an hour a week? Tell us and it'll probably exist by next month."

                  )
                )

                /* Quick-pick idea chips */
                , React.createElement('div', { style: {marginBottom:16}}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}, "Or tap something that sounds useful"     )
                  , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:7}}
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
                          style: {...btn(active),padding:"7px 12px",fontSize:12,fontWeight:600,borderRadius:20}}
                          , chip.label
                        )
                      );
                    })
                  )
                )

                /* Free text */
                , React.createElement('div', { style: {marginBottom:16}}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8}}, "Or describe it in your own words"      )
                  , React.createElement('textarea', {
                    value: feedbackIdea,
                    onChange: e=>setFeedbackIdea(e.target.value),
                    placeholder: "e.g. I need a message that asks customers to refer a mate without sounding desperate..."              ,
                    rows: 4,
                    style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box"},
                    onFocus: e=>{e.target.style.borderColor=C.amber;},
                    onBlur: e=>{e.target.style.borderColor=C.border2;}}
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
                      const res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,messages:[{role:"user",content:prompt}]})});
                      const data=await res.json();
                      setFeedbackReply(_optionalChain([data, 'access', _28 => _28.content, 'optionalAccess', _29 => _29[0], 'optionalAccess', _30 => _30.text])||"Your idea's in the pile. Good pile though.");
                    }catch (e4){setFeedbackReply("That idea just landed. We'll get on it.");}
                    setFeedbackSent(true);setFeedbackLoading(false);
                  },
                  disabled: feedbackLoading||(!feedbackIdea.trim()&&feedbackTags.length===0),
                  style: {width:"100%",background:(!feedbackIdea.trim()&&feedbackTags.length===0)||feedbackLoading?C.surface3:C.amber,border:"none",borderRadius:12,padding:"14px",color:(!feedbackIdea.trim()&&feedbackTags.length===0)||feedbackLoading?"#555":"#000",fontWeight:900,fontSize:15,cursor:(!feedbackIdea.trim()&&feedbackTags.length===0)||feedbackLoading?"default":"pointer",transition:"all 0.2s"}}
                  , feedbackLoading?"⏳ Sending it up the chain...":"🚀 Send it — make this thing better"
                )
              )
            ):(
              React.createElement('div', {}
                /* Success state */
                , React.createElement('div', { style: {textAlign:"center",paddingTop:16,marginBottom:24}}
                  , React.createElement('div', { style: {fontSize:48,marginBottom:12}}, "🛠️")
                  , React.createElement('div', { style: {fontSize:22,fontWeight:900,letterSpacing:"-0.4px",marginBottom:8}}, "Got it. You're one of the good ones."       )
                )
                /* AI reply card */
                , React.createElement('div', { style: {...card(),padding:20,border:`0.5px solid ${C.amberBorder}`,marginBottom:20}}
                  , React.createElement('div', { style: {fontSize:11,color:C.amber,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}, "From the OnToolsAI team"   )
                  , React.createElement('div', { style: {fontSize:14,lineHeight:1.7,color:"#DDD"}}, feedbackReply)
                )
                /* What they sent */
                , (feedbackTags.length>0||feedbackIdea.trim())&&(
                  React.createElement('div', { style: {...card(),padding:16,marginBottom:20}}
                    , React.createElement('div', { style: {fontSize:11,color:C.subtle,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}, "What you sent us"   )
                    , feedbackTags.length>0&&React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:6,marginBottom:feedbackIdea.trim()?10:0}}
                      , feedbackTags.map(t=>React.createElement('span', { key: t, style: {background:C.amberDim,color:C.amber,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,border:`0.5px solid ${C.amberBorder}`}}, t))
                    )
                    , feedbackIdea.trim()&&React.createElement('div', { style: {fontSize:13,color:"#AAA",fontStyle:"italic",lineHeight:1.5}}, "\"", feedbackIdea, "\"")
                  )
                )
                , React.createElement('button', { onClick: ()=>{setFeedbackSent(false);setFeedbackIdea("");setFeedbackTags([]);setFeedbackReply("");},
                  style: {width:"100%",background:"none",border:`0.5px solid ${C.border2}`,borderRadius:12,padding:"12px",color:C.muted,fontWeight:600,fontSize:13,cursor:"pointer"}}, "Got another one? Send more ideas"

                )
              )
            )
          )
        )


        , (!trade||(tab==="write"&&step!=="output"))||(step==="output")?(
          React.createElement(React.Fragment, null
            /* TRADE SELECTION */
            , step==="trade"&&(
              React.createElement('div', {}
                , React.createElement('div', { style: {textAlign:"center",marginBottom:28,paddingTop:8}}
                  , React.createElement('div', { style: {fontSize:13,color:C.subtle,letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}, "Step 1 of 3"   )
                  , React.createElement('h1', { style: {fontSize:26,fontWeight:900,margin:0,letterSpacing:"-0.5px"}}, "What's your trade?"  )
                  , React.createElement('p', { style: {color:C.muted,marginTop:8,fontSize:14}}, "Every message gets tailored to your business"      )
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8,marginBottom:24}}
                  , TRADES.map(t=>(
                    React.createElement('button', { key: t.id, onClick: ()=>{setTrade(t.id);setStep("module");setTab("write");},
                      style: {...card(),padding:"15px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",color:C.text,fontSize:15,fontWeight:600,transition:"all 0.15s",textAlign:"left",width:"100%"},
                      onMouseOver: e=>{e.currentTarget.style.border=`0.5px solid ${C.amber}`;e.currentTarget.style.background=C.surface2;},
                      onMouseOut: e=>{e.currentTarget.style.border=`0.5px solid ${C.border}`;e.currentTarget.style.background=C.surface;}}
                      , React.createElement('span', {}, t.emoji, " " , t.label)
                      , React.createElement('span', { style: {color:C.amber}}, "→")
                    )
                  ))
                )
                , React.createElement('div', { style: {textAlign:"center",color:C.subtle,fontSize:12}}, "🔒 No account needed  ·  10 free messages/month  ·  No card required"           )
              )
            )

            /* MODULE SELECTION */
            , step==="module"&&(
              React.createElement('div', {}
                , React.createElement('button', { onClick: ()=>setStep("trade"), style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0}}, "← Back" )
                , React.createElement('div', { style: {marginBottom:20}}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}, "Step 2 of 3"   )
                  , React.createElement('h2', { style: {fontSize:21,fontWeight:900,margin:0}}, "What do you need?"   )
                  , React.createElement('p', { style: {color:C.muted,marginTop:6,fontSize:14}}, _optionalChain([tradeObj, 'optionalAccess', _31 => _31.emoji]), " " , _optionalChain([tradeObj, 'optionalAccess', _32 => _32.label]), " — pick a category"    )
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8,marginBottom:18}}
                  , MODULES.map(m=>(
                    React.createElement('button', { key: m.id, onClick: ()=>{setModule(m.id);setStep("tool");},
                      style: {...card(),padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:C.text,textAlign:"left",transition:"all 0.15s",width:"100%"},
                      onMouseOver: e=>{e.currentTarget.style.border=`0.5px solid ${C.amberBorder}`;e.currentTarget.style.background=C.surface2;},
                      onMouseOut: e=>{e.currentTarget.style.border=`0.5px solid ${C.border}`;e.currentTarget.style.background=C.surface;}}
                      , React.createElement('span', { style: {fontSize:22,minWidth:30,textAlign:"center"}}, m.icon)
                      , React.createElement('div', {}, React.createElement('div', { style: {fontWeight:700,fontSize:14}}, m.label), React.createElement('div', { style: {color:C.subtle,fontSize:12,marginTop:1}}, m.desc))
                    )
                  ))
                )
                /* Brand Voice CTA */
                , React.createElement('div', { onClick: ()=>setShowBV(true), style: {...card(),padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,border:`0.5px solid ${bv?C.amberBorder:C.border}`}}
                  , React.createElement('span', { style: {fontSize:20}}, "🎨")
                  , React.createElement('div', {}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:700,color:bv?C.amber:"#CCC"}}, bv?`Brand Voice: ${bv.name}`:"Set Your Brand Voice")
                    , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:1}}, bv?"Every message sounds like you — watermark removed":"Make outputs sound like your business, not generic AI")
                  )
                  , React.createElement('div', { style: {marginLeft:"auto",fontSize:12,color:bv?C.amber:C.subtle}}, bv?"Edit →":"Set up →")
                )
              )
            )

            /* TOOL SELECTION */
            , step==="tool"&&moduleObj&&(
              React.createElement('div', {}
                , React.createElement('button', { onClick: ()=>setStep("module"), style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0}}, "← Back" )
                , React.createElement('div', { style: {marginBottom:18}}
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}, "Step 3 of 3"   )
                  , React.createElement('h2', { style: {fontSize:20,fontWeight:900,margin:0}}, moduleObj.icon, " " , moduleObj.label)
                  , React.createElement('p', { style: {color:C.muted,marginTop:6,fontSize:14}}, "Choose what to write"   )
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}}
                  , moduleObj.tools.map(t=>{
                    const locked=t.tier==="pro";
                    return(
                      React.createElement('button', { key: t.id,
                        onClick: ()=>{if(locked){setShowUpgrade(true);}else{setToolId(t.id);setStep("fields");setIsSeq(false);}},
                        style: {...card(),padding:"13px 16px",cursor:"pointer",textAlign:"left",color:C.text,transition:"all 0.15s",width:"100%",position:"relative",border:`0.5px solid ${toolId===t.id?C.amber:C.border}`,background:toolId===t.id?C.amberDim:C.surface,opacity:locked?0.75:1},
                        onMouseOver: e=>{e.currentTarget.style.border=`0.5px solid ${locked?"#FF6B6B40":C.amberBorder}`;e.currentTarget.style.background=locked?C.surface2:C.amberDim;},
                        onMouseOut: e=>{e.currentTarget.style.border=`0.5px solid ${toolId===t.id?C.amber:C.border}`;e.currentTarget.style.background=toolId===t.id?C.amberDim:C.surface;}}
                        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}
                          , React.createElement('div', { style: {fontWeight:700,fontSize:14}}, t.label)
                          , locked&&React.createElement('span', { style: {fontSize:10,background:"#FF6B6B15",color:"#FF6B6B",padding:"2px 8px",borderRadius:8,fontWeight:700,border:"0.5px solid #FF6B6B30",whiteSpace:"nowrap",marginLeft:8}}, "☕ Pro" )
                          , t.seq&&!locked&&React.createElement('span', { style: {fontSize:10,background:C.amberDim,color:C.amber,padding:"2px 8px",borderRadius:8,fontWeight:700,border:`0.5px solid ${C.amberBorder}`,whiteSpace:"nowrap",marginLeft:8}}, "Sequence available" )
                        )
                        , React.createElement('div', { style: {color:C.subtle,fontSize:12,marginTop:3}}, t.desc)
                        , locked&&React.createElement('div', { style: {fontSize:11,color:"#FF6B6B",marginTop:5}}, "One coffee a month unlocks this →"      )
                      )
                    );
                  })
                )
              )
            )

            /* FIELDS */
            , step==="fields"&&toolObj&&(
              React.createElement('div', {}
                , React.createElement('button', { onClick: ()=>setStep("tool"), style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0}}, "← Back" )
                , React.createElement('div', { style: {marginBottom:18}}
                  , React.createElement('h2', { style: {fontSize:19,fontWeight:900,margin:0}}, toolObj.label)
                  , React.createElement('p', { style: {color:C.muted,marginTop:6,fontSize:13}}, "Fill in a few details — we handle the writing"         )
                )

                /* Fields */
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12,marginBottom:16}}
                  , toolObj.fields.map(f=>(
                    React.createElement('div', { key: f.id}
                      , React.createElement('label', { style: {display:"block",fontSize:11,color:"#AAA",marginBottom:5,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"}}, f.label)
                      , React.createElement('input', { value: fields[f.id]||"", onChange: e=>setFields({...fields,[f.id]:e.target.value}), placeholder: f.ph,
                        style: {width:"100%",background:C.surface,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"11px 13px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color 0.15s"},
                        onFocus: e=>{e.target.style.borderColor=C.amber;},
                        onBlur: e=>{e.target.style.borderColor=C.border2;}})
                    )
                  ))
                )

                /* Tone */
                , React.createElement('div', { style: {marginBottom:12}}
                  , React.createElement('div', { style: {fontSize:11,color:"#888",marginBottom:7,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"}}, "Tone")
                  , React.createElement('div', { style: {display:"flex",gap:6}}
                    , TONES.map(t=>(
                      React.createElement('button', { key: t.id, onClick: ()=>setTone(t.id),
                        style: {...btn(tone===t.id),flex:1,padding:"8px 4px",fontSize:12,fontWeight:600}}
                        , t.icon, " " , t.label
                      )
                    ))
                  )
                )

                /* Channel */
                , React.createElement('div', { style: {marginBottom:16}}
                  , React.createElement('div', { style: {fontSize:11,color:"#888",marginBottom:7,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase"}}, "Send via" )
                  , React.createElement('div', { style: {display:"flex",gap:6}}
                    , CHANNELS.map(c=>(
                      React.createElement('button', { key: c.id, onClick: ()=>setChannel(c.id),
                        style: {...btn(channel===c.id),flex:1,padding:"8px 4px",fontSize:11,fontWeight:600,lineHeight:1.4}}
                        , c.icon, React.createElement('br', {}), c.label
                      )
                    ))
                  )
                )

                /* Sequence Toggle */
                , toolObj.seq&&(
                  React.createElement('div', { onClick: ()=>{if(usage>=FREE_LIMIT){setShowUpgrade(true);return;}setIsSeq(!isSeq);},
                    style: {...card(),padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,border:`0.5px solid ${isSeq?C.amberBorder:C.border}`}}
                    , React.createElement('div', {}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:700,color:isSeq?C.amber:"#CCC"}}, "✨ Generate full 3-message sequence"    )
                      , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:1}}, "Instead of one — great for follow-ups that actually work"         )
                    )
                    , React.createElement('div', { style: {width:36,height:20,background:isSeq?C.amber:C.surface3,borderRadius:10,position:"relative",transition:"background 0.2s",flexShrink:0,marginLeft:12}}
                      , React.createElement('div', { style: {width:14,height:14,background:"#FFF",borderRadius:7,position:"absolute",top:3,left:isSeq?19:3,transition:"left 0.2s"}})
                    )
                  )
                )

                /* Generate Button */
                , !bv&&(
                  React.createElement('div', { style: {fontSize:11,color:C.subtle,marginBottom:8,textAlign:"center"}}, "Free messages include an OnToolsAI footer. "
                          , React.createElement('span', { onClick: ()=>setShowBV(true), style: {color:C.amber,cursor:"pointer"}}, "Remove it with Brand Voice →"     )
                  )
                )
                , React.createElement('button', { onClick: ()=>generate(),
                  disabled: !toolObj.fields.every(f=>_optionalChain([fields, 'access', _33 => _33[f.id], 'optionalAccess', _34 => _34.trim, 'call', _35 => _35()])),
                  style: {width:"100%",background:toolObj.fields.every(f=>_optionalChain([fields, 'access', _36 => _36[f.id], 'optionalAccess', _37 => _37.trim, 'call', _38 => _38()]))?C.amber:"#1A1A1A",border:"none",borderRadius:12,padding:"15px",cursor:toolObj.fields.every(f=>_optionalChain([fields, 'access', _39 => _39[f.id], 'optionalAccess', _40 => _40.trim, 'call', _41 => _41()]))?"pointer":"not-allowed",color:toolObj.fields.every(f=>_optionalChain([fields, 'access', _42 => _42[f.id], 'optionalAccess', _43 => _43.trim, 'call', _44 => _44()]))?"#000":"#333",fontSize:15,fontWeight:900,letterSpacing:"-0.2px",transition:"all 0.15s"}}
                  , isSeq?"✨ Generate 3-Message Sequence":"✨ Write This Message"
                )
                , React.createElement('div', { style: {textAlign:"center",marginTop:8,color:C.subtle,fontSize:11}}
                  , usageLeft, " of "  , FREE_LIMIT, " free messages remaining this month"
                )
              )
            )

            /* OUTPUT */
            , step==="output"&&(
              React.createElement('div', {}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}
                  , React.createElement('div', { style: {fontSize:16,fontWeight:900}}, isSeq?"Your 3-Message Sequence":"Your Message")
                  , React.createElement('button', { onClick: resetToFields, style: {background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:0}}, "← Change details"  )
                )

                /* Output box */
                , React.createElement('div', { style: {...card(),padding:18,marginBottom:10,border:`0.5px solid ${C.amberBorder}`,minHeight:80}}
                  , loading?(
                    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}}
                      , [90,75,85,60,78].map((w,i)=>(
                        React.createElement('div', { key: i, style: {height:13,background:C.surface2,borderRadius:4,width:`${w}%`,animation:"pulse 1.4s infinite",animationDelay:`${i*0.1}s`}})
                      ))
                      , React.createElement('div', { style: {color:C.subtle,fontSize:12,marginTop:4,textAlign:"center"}}, "Writing your message..."  )
                    )
                  ):(
                    React.createElement('div', { style: {fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap",color:"#DDD8CC"}}, output)
                  )
                )

                , !loading&&output&&(
                  React.createElement(React.Fragment, null
                    /* Action buttons */
                    , React.createElement('div', { style: {display:"flex",gap:8,marginBottom:12}}
                      , React.createElement('button', { onClick: copy, style: {flex:1,background:copied?C.green:C.amber,border:"none",borderRadius:10,padding:"13px",cursor:"pointer",color:"#000",fontSize:13,fontWeight:800,transition:"all 0.15s"}}
                        , copied?"✓ Copied!":"📋 Copy Message"
                      )
                      , React.createElement('button', { onClick: ()=>generate(), style: {flex:1,background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"13px",cursor:"pointer",color:C.muted,fontSize:13,fontWeight:600}}, "🔄 Try Again"

                      )
                    )

                    /* Tone quick-switch */
                    , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:14}}
                      , TONES.map(t=>(
                        React.createElement('button', { key: t.id, onClick: ()=>{setTone(t.id);generate();},
                          style: {...btn(tone===t.id),flex:1,padding:"6px 4px",fontSize:11}}
                          , t.icon, " " , t.label
                        )
                      ))
                    )

                    /* Affiliate */
                    , affiliate&&(
                      React.createElement('div', { style: {background:"#0D1A10",border:`0.5px solid #152015`,borderRadius:12,padding:"12px 14px",marginBottom:12}}
                        , React.createElement('div', { style: {fontSize:10,color:C.green,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5}}, "💡 Next step"  )
                        , React.createElement('div', { style: {fontSize:13,color:"#C8E6C9",fontWeight:600,marginBottom:3}}, affiliate.cta)
                        , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginBottom:8}}, affiliate.desc)
                        , React.createElement('a', { href: affiliate.link, style: {display:"inline-block",background:C.green,color:"#000",fontSize:11,fontWeight:700,padding:"6px 12px",borderRadius:7,textDecoration:"none"}}, "Try "
                           , affiliate.name, " Free →"
                        )
                      )
                    )

                    /* Upgrade nudge */
                    , React.createElement('div', { onClick: ()=>setShowUpgrade(true), style: {...card(),padding:"10px 14px",textAlign:"center",cursor:"pointer"}}
                      , React.createElement('div', { style: {fontSize:12,color:C.subtle}}, "Unlimited messages · No footer · Full sequences"       )
                      , React.createElement('div', { style: {fontSize:12,color:C.amber,fontWeight:700,marginTop:2}}, "☕ One coffee a month — see plans"       )
                    )
                  )
                )
              )
            )
          )
        ):null

      )

      /* ── UPGRADE MODAL ──────────────────────────────────────────────────────── */
      , showUpgrade&&(
        React.createElement('div', { style: {position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 16px 20px"}, onClick: ()=>setShowUpgrade(false)}
          , React.createElement('div', { style: {...card(),padding:22,maxWidth:440,width:"100%",border:`0.5px solid ${C.border2}`}, onClick: e=>e.stopPropagation()}

            , React.createElement('div', { style: {textAlign:"center",marginBottom:18}}
              , React.createElement('div', { style: {fontSize:26,marginBottom:6}}, "☕")
              , React.createElement('div', { style: {fontSize:19,fontWeight:900,letterSpacing:"-0.3px"}}, "Honestly, it's less than a coffee"     )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:6}}, "Unlimited messages. No footer. Full sequences. Daily briefings."       )
            )

            /* Free */
            , React.createElement('div', { style: {...card(),padding:"12px 14px",marginBottom:8,background:C.surface2}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center"}}
                , React.createElement('div', {}
                  , React.createElement('div', { style: {fontSize:14,fontWeight:700}}, "🤝 Always on us"   )
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:2}}, "10 messages/month · Basic tools · Footer on outputs"        )
                )
                , React.createElement('div', { style: {fontSize:16,fontWeight:900,color:C.muted}}, "Free")
              )
            )

            /* Pro */
            , React.createElement('div', { style: {...card(),padding:14,marginBottom:8,border:`1.5px solid ${C.amber}`,position:"relative",background:C.amberDim}}
              , React.createElement('div', { style: {position:"absolute",top:-10,right:12,background:C.amber,color:"#000",fontSize:10,fontWeight:900,padding:"2px 10px",borderRadius:10}}, "MOST POPULAR" )
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}
                , React.createElement('div', {}
                  , React.createElement('div', { style: {fontSize:14,fontWeight:900,color:C.amber}}, "☕ Buy me a coffee a month"      )
                  , React.createElement('div', { style: {fontSize:11,color:"#888",marginTop:3}}, "Unlimited messages · Full sequences · No footer · All 5 modules · SMS + email + Facebook versions · Community templates"                     )
                )
                , React.createElement('div', { style: {textAlign:"right",minWidth:48}}
                  , React.createElement('div', { style: {fontSize:20,fontWeight:900,color:C.amber}}, "$5.99")
                  , React.createElement('div', { style: {fontSize:10,color:C.subtle}}, "/month")
                )
              )
              , React.createElement('button', { style: {marginTop:12,width:"100%",background:C.amber,border:"none",borderRadius:10,padding:"12px",color:"#000",fontWeight:900,fontSize:14,cursor:"pointer"}}, "Start for $5.99/month →"

              )
            )

            /* Business */
            , React.createElement('div', { style: {...card(),padding:"12px 14px",marginBottom:14,background:C.surface2}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}
                , React.createElement('div', {}
                  , React.createElement('div', { style: {fontSize:14,fontWeight:700}}, "🍳 Buy me breakfast a month"     )
                  , React.createElement('div', { style: {fontSize:11,color:C.subtle,marginTop:2}}, "Everything in Pro + Brand Voice · Daily AI briefing · Health score · Saved history · 3 team members · Priority support"                      )
                )
                , React.createElement('div', { style: {textAlign:"right",minWidth:48}}
                  , React.createElement('div', { style: {fontSize:18,fontWeight:900}}, "$17.99")
                  , React.createElement('div', { style: {fontSize:10,color:C.subtle}}, "/month")
                )
              )
              , React.createElement('button', { style: {marginTop:10,width:"100%",background:C.surface3,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"10px",color:"#AAA",fontWeight:700,fontSize:13,cursor:"pointer"}}, "Start for $17.99/month →"

              )
            )

            , React.createElement('div', { style: {textAlign:"center",fontSize:11,color:C.subtle,marginBottom:10}}, "Cancel anytime · No contracts · Your messages are always yours"          )
            , React.createElement('button', { onClick: ()=>setShowUpgrade(false), style: {display:"block",margin:"0 auto",background:"none",border:"none",color:C.subtle,fontSize:12,cursor:"pointer"}}, "Maybe later" )
          )
        )
      )

      /* ── BRAND VOICE MODAL ─────────────────────────────────────────────────── */
      , showBV&&(
        React.createElement('div', { style: {position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 16px 20px"}, onClick: ()=>setShowBV(false)}
          , React.createElement('div', { style: {...card(),padding:22,maxWidth:440,width:"100%",border:`0.5px solid ${C.border2}`}, onClick: e=>e.stopPropagation()}
            , React.createElement('div', { style: {marginBottom:16}}
              , React.createElement('div', { style: {fontSize:18,fontWeight:900}}, "🎨 Your Brand Voice"   )
              , React.createElement('div', { style: {color:C.muted,fontSize:13,marginTop:4}}, "Set once. Every message sounds like you — not generic AI. Removes the footer too."              )
            )
            , [{label:"Business Name",key:"name",ph:"e.g. Sparkle Clean Services"},{label:"Your First Name",key:"ownerName",ph:"e.g. Mike"}].map(f=>(
              React.createElement('div', { key: f.key, style: {marginBottom:12}}
                , React.createElement('label', { style: {display:"block",fontSize:11,color:"#888",marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px"}}, f.label)
                , React.createElement('input', { value: bvDraft[f.key]||"", onChange: e=>setBvDraft({...bvDraft,[f.key]:e.target.value}), placeholder: f.ph,
                  style: {width:"100%",background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:9,padding:"10px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
                  onFocus: e=>{e.target.style.borderColor=C.amber;}, onBlur: e=>{e.target.style.borderColor=C.border2;}})
              )
            ))
            , React.createElement('div', { style: {marginBottom:12}}
              , React.createElement('label', { style: {display:"block",fontSize:11,color:"#888",marginBottom:7,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px"}}, "Your Style" )
              , React.createElement('div', { style: {display:"flex",gap:6}}
                , [["friendly","😊 Friendly"],["professional","💼 Professional"],["blunt","💪 Straight-talking"]].map(([id,label])=>(
                  React.createElement('button', { key: id, onClick: ()=>setBvDraft({...bvDraft,style:id}),
                    style: {...btn(bvDraft.style===id),flex:1,padding:"8px 4px",fontSize:11,fontWeight:600}}
                    , label
                  )
                ))
              )
            )
            , React.createElement('div', { onClick: ()=>setBvDraft({...bvDraft,humour:!bvDraft.humour}),
              style: {...card(),padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,border:`0.5px solid ${bvDraft.humour?C.amberBorder:C.border}`}}
              , React.createElement('div', { style: {fontSize:13,color:bvDraft.humour?C.amber:"#AAA",fontWeight:600}}, "😄 A bit of humour in my messages"       )
              , React.createElement('div', { style: {width:34,height:18,background:bvDraft.humour?C.amber:C.surface3,borderRadius:9,position:"relative"}}
                , React.createElement('div', { style: {width:12,height:12,background:"#FFF",borderRadius:6,position:"absolute",top:3,left:bvDraft.humour?18:3,transition:"left 0.2s"}})
              )
            )
            , React.createElement('div', { style: {padding:"10px 12px",background:C.surface2,borderRadius:10,marginBottom:14,fontSize:12,color:C.subtle,lineHeight:1.5}}, "🍳 "
               , React.createElement('strong', { style: {color:"#888"}}, "Breakfast plan feature"  ), " — Brand Voice is included in the $17.99/mo plan. Save your settings now and they'll activate when you upgrade."
            )
            , React.createElement('div', { style: {display:"flex",gap:8}}
              , React.createElement('button', { onClick: saveBV, style: {flex:2,background:C.amber,border:"none",borderRadius:10,padding:"12px",color:"#000",fontWeight:900,fontSize:14,cursor:"pointer"}}, "Save Brand Voice"  )
              , React.createElement('button', { onClick: ()=>setShowBV(false), style: {flex:1,background:C.surface2,border:`0.5px solid ${C.border2}`,borderRadius:10,padding:"12px",color:C.muted,fontWeight:600,fontSize:13,cursor:"pointer"}}, "Cancel")
            )
          )
        )
      )

      , React.createElement('style', {}, `
        @keyframes pulse{0%,100%{opacity:0.3;}50%{opacity:0.7;}}
        *{box-sizing:border-box;margin:0;}
        input::placeholder{color:#666;}
        button:active{transform:scale(0.98);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px;}
      `)
    )
  );
}

const _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(React.createElement(OnToolsAI));
const _l = document.getElementById('loader');
if(_l){_l.style.opacity='0';setTimeout(()=>_l.remove(),400);}
