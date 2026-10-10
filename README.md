# FixMyCity - Smart Civic & Campus Problem Reporting Platform

> **Real People. Real Issues. Real Change.**  
> A centralized digital platform empowering citizens and students to report, verify, track, and resolve civic and campus infrastructure problems with AI-driven prioritization, duplicate consolidation, in-person citizen resolution verification, and SerpAPI municipal intelligence.

---

## 🌐 Universal Live Website (Works on Every Device)

To open and test **FixMyCity** on **any device** (Android, iPhone, iPad, Windows, macOS, Linux, or tablet) without requiring any login or Google Cloud permissions, use the **Public Shared URL**:

### 📱 **Universal Public URL (Any Device & Browser):**
👉 **[https://ais-pre-gooh2fuo46gwjbbjsqxz6u-456807731743.asia-east1.run.app](https://ais-pre-gooh2fuo46gwjbbjsqxz6u-456807731743.asia-east1.run.app)**

> 💡 **Why this link works everywhere:**  
> - **Publicly accessible:** Anyone with this link can open the app directly on any mobile browser (Chrome, Safari, Firefox, Edge, Samsung Internet) without logging into AI Studio.  
> - **Full HTTPS Camera Support:** Real-time camera hardware streaming and photo snapping works natively over secure HTTPS on mobile and desktop.  
> - **Responsive Touch UI:** Automatically adapts from desktop widescreen dashboards down to native mobile views with touch navigation.

### 📲 Instant Mobile Access via QR Code:
Scan this QR code with your phone camera to open FixMyCity immediately:

<p align="center">
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fais-pre-gooh2fuo46gwjbbjsqxz6u-456807731743.asia-east1.run.app" alt="FixMyCity QR Code" width="160" />
  <br/>
  <sub><i>Point your mobile camera here to test on your phone</i></sub>
</p>

---

### 💻 Developer App URL (Studio Session Only):
- Internal AI Studio Workspace: [https://ais-dev-gooh2fuo46gwjbbjsqxz6u-456807731743.asia-east1.run.app](https://ais-dev-gooh2fuo46gwjbbjsqxz6u-456807731743.asia-east1.run.app) *(Requires logged-in AI Studio developer account)*

---

## 💡 Innovation & The Accountability Cycle

Unlike traditional grievance portals that merely collect complaints into unmonitored queues, **FixMyCity** closes the loop with a complete 6-stage accountability cycle:

```
Report  ──▶  Verify  ──▶  Prioritize  ──▶  Assign  ──▶  Resolve  ──▶  Confirm
(Citizen)    (Community)     (AI + Dups)    (SerpAPI Dept)  (Officer Proof)  (Citizen Audit)
```

1. **Report:** Citizens or students submit an issue using photo evidence, live GPS location, and description.
2. **Verify:** Nearby community members corroborate active hazards on-site to filter false reports.
3. **Prioritize:** The AI engine computes a dynamic Urgency Score (0–100) based on hazard severity and consolidated duplicate submissions.
4. **Assign:** The system matches and routes the ticket to the responsible municipal or campus department using SerpAPI intelligence.
5. **Resolve:** Field teams fix the issue and upload verifiable resolution proof photos.
6. **Confirm:** Citizens audit the fix in person and confirm resolution before the ticket is officially closed.

---

## 🚀 How SerpAPI Powers FixMyCity

**SerpAPI is a cornerstone component of the FixMyCity architecture.** It provides live Google Search, Google Knowledge Graph, Google Local, and Google News intelligence directly to citizens and municipal authorities without relying on static or outdated directories.

### 1. Automated Municipal Department & Ward Resolution
* **The Problem:** Citizens rarely know which exact government agency or zonal ward office is responsible for a broken streetlight (Electricity Board vs Municipal Corporation), water pipe burst (Jal Nigam vs PHE), pothole (National Highway vs State PWD vs Municipal Ward), or campus hazard.
* **SerpAPI's Role:** When an issue is logged, FixMyCity queries SerpAPI:
  ```
  Query: "{City} municipal corporation {Category} ward office contact phone email portal"
  ```
  SerpAPI extracts:
  - The exact municipal department (e.g. *Bhopal Municipal Corporation PWD Zone 10*).
  - The designated zonal junior engineer or nodal officer.
  - Official toll-free helplines and direct desk phone numbers.
  - Verified links to the official government grievance portal.

### 2. Live Municipal Corporation Knowledge Graph
* FixMyCity queries SerpAPI to retrieve the official governing entity card for any city (e.g., Bhopal Municipal Corporation - BMC).
* Surfaces verified data points directly in the interface:
  - **Municipal Commissioner:** Harendra Narayan (IAS)
  - **Mayor:** Malti Rai
  - **Headquarters Address:** Sadashiv Rao Bhau Parisar, Mata Mandir, Bhopal
  - **Toll-Free Helpline:** 1800-233-0014 / 0755-2540220
  - **Official Web Portal:** Direct link with sitelinks.

### 3. Real-Time Civic Alerts & Tender Corroboration
* FixMyCity uses SerpAPI to query live local news and municipal tenders:
  ```
  Query: "{City} municipal corporation road repairs water garbage civic news"
  ```
* Informs citizens and officers if a reported road is already under an active repair contract (e.g., *Automated Jetpatcher deployment in Ward 42* or *Kolar pipeline rehabilitation*), preventing redundant tender allocations.

### 4. SerpAPI Civic Radar & Developer Inspector
* FixMyCity features a dedicated **SerpAPI Civic Radar** module in the header.
* Users can:
  - Run arbitrary civic queries across wards and departments.
  - Inspect structured organic results and sitelinks.
  - View live API responses in a transparent **Raw JSON Inspector**.
  - Configure custom SerpAPI API keys (`SERPAPI_API_KEY`) with instant validation.

---

## 📱 Core Application Functionality & Screens

### 1. Citizen Home Feed
- Personalized welcome: *"Good Morning, Gaurav — Together we can build a cleaner, safer and better city."*
- Quick action card: *"Report an Issue — Snap · Add location · Submit"*.
- 4-grid quick navigation:
  - **Nearby Issues:** Geolocation-filtered list of neighborhood hazards.
  - **My Reports:** Personal dashboard tracking submission progress.
  - **Public Map:** Live visual map of all active tickets.
  - **Verify Issues:** Community review hub.
- Live issues ticker showing critical and high-priority tickets near the user's location.

### 2. Issue Reporting Flow with AI Classification
- **Camera Viewfinder:** Visual framing reticle simulating an active camera capture.
- **Location Detection:** Automatic address and GPS coordinate detection (e.g., *MP Nagar Zone 1, Bhopal*).
- **AI Vision Analysis:** Identifies problem category with confidence score (e.g., *Pothole 94%*), assesses impact (*vehicle blowout risk, skid danger*), and suggests turnaround time (*24–48 hours*).
- **Duplicate Detection:** Checks for existing tickets within a 200m radius and allows users to **Upvote (+1)** instead of creating duplicate clutter.
- **Preset Gallery:** Pre-loaded one-click realistic samples for Potholes, Open Drains, Garbage Heaps, Broken Streetlights, Water Pipe Bursts, and Campus Infrastructure.

### 3. Interactive Public Map
- High-contrast city map layout showing major transit corridors, lakes, and zones.
- Color-coded severity pins:
  - 🔴 **Critical:** Pulsing indicator requiring immediate intervention.
  - 🟠 **High:** 48-hour SLA response.
  - 🟡 **Medium:** Routine municipal schedule.
  - 🟢 **Low:** Minor maintenance.
- Interactive category filtering pills and bottom detail drawer.

### 4. Nearby Issues List
- Tabbed filtering (*All, Pothole, Garbage, Streetlight, Water Leakage, Open Drain, Campus*).
- Shows distance estimates (`~250m`, `~1.2km`), consolidated report count (`12 reports`), and community verification status (`8 verified`).

### 5. Municipal Authority & Admin Dashboard
- Officer Command Center (e.g. *Amit Kumar, Zonal Municipal Officer*).
- 4 Real-time KPI Metric Cards:
  - **Critical:** 87
  - **High:** 214
  - **Medium:** 463
  - **Low:** 289
- **AI Priority Queue:** Automatically orders tickets by composite risk score.
- **Dispatch & Assignment Modal:** Assigns tickets to specific zonal engineers (PWD, Sanitation, Water Works, Electrical) and enables uploading **Resolution Proof Photos**.

### 6. Issue Detail & Community Verification Modal
- Photo hero banner with zoom.
- 3 Key Metric Badges: **Severity (92/100)**, **Reports (12)**, **Verified (8)**.
- AI Confidence breakdown and risk explanation.
- SerpAPI Official Municipal Department Routing box.
- Audit timeline logging every state change (*Reported → Verified → Assigned → Resolved → Citizen Confirmed*).
- Citizen action buttons: *"Verify Live Hazard"*, *"I Also Face This (+1)"*, and *"Confirm Issue is Resolved"*.

### 7. Citizen Profile & Civic Badges
- Profile for Gaurav Chotrani (`gaurav@gmail.com`).
- Personal statistics: Total Reports, Resolved Count, In Progress Count.
- Civic Badges: *Verified Reporter Level 3*, *Resolution Auditor*.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion |
| **Backend** | Node.js, Express, tsx |
| **Civic Intelligence** | **SerpAPI** (Google Search, Maps, Knowledge Graph, News) |
| **AI Vision & NLP** | Google Gemini (`@google/genai`) + Heuristic Risk Scorer |
| **Build & Tooling** | Vite 8, ESBuild |
| **Deployment** | Google Cloud Run (AI Studio Build) |

---

## 🔑 Environment Variables & API Key Setup

Configure these variables in your `.env` file or in the **AI Studio Secrets Panel**:

```bash
# SerpAPI API Key for live Google Search and Municipal Directory queries
SERPAPI_API_KEY="your_64_character_serpapi_hex_key"

# Gemini API Key for server-side AI classification
GEMINI_API_KEY="your_gemini_api_key"

# Application host URL (injected automatically in AI Studio)
APP_URL="https://ais-pre-gooh2fuo46gwjbbjsqxz6u-456807731743.asia-east1.run.app"
```

*Note: If no SerpAPI key is provided, FixMyCity seamlessly falls back to built-in high-fidelity municipal intelligence data for Bhopal, Indore, Delhi, and Campuses so the app remains 100% operational.*

---

## 💻 Local Development

### Supabase Authentication

The separate `/login` page supports email/password sign-in, account creation, and password reset through Supabase Auth. Copy `.env.example` to `.env`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project. Restart the development server after changing these values. Configure the app's local and deployed URLs in Supabase Auth's allowed redirect/site URL settings, and configure email confirmation if you want new accounts to verify their address.

Only the Supabase publishable/anon key belongs in the browser environment; never use a service-role key. Authentication is currently optional, and the existing Express issue APIs and demo data are not protected or scoped to the signed-in user.

```bash
# Install dependencies
npm install

# Start full-stack dev server (Express backend + Vite frontend on port 3000)
npm run dev

# Run TypeScript compilation check
npm run lint

# Build for production
npm run build
```

---

## 📄 License
Apache-2.0
